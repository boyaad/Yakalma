import { supabase } from "./supabase";

/**
 * Récupère les N chefs les mieux notés avec leurs vraies statistiques :
 * - Note moyenne (depuis la table avis via leurs plats)
 * - Nombre de plats actifs
 * - Nombre de commandes reçues
 */
export async function getTopChefs(limit = 3) {
  // 1. Récupérer tous les plats avec chef, avis et commandes
  const { data: plats, error } = await supabase
    .from("plats")
    .select(`
      id,
      vendeur_id,
      disponibilite,
      profiles (
        user_id,
        nom_complet,
        avatar,
        specialite
      ),
      avis (
        note
      )
    `);

  if (error) throw error;
  if (!plats || plats.length === 0) return [];

  // 2. Compter les commandes par vendeur via ligne_commandes
  const vendeurIds = [...new Set(plats.map((p) => p.vendeur_id).filter(Boolean))];

  const { data: lignes } = await supabase
    .from("ligne_commandes")
    .select("plat_id, plats(vendeur_id)")
    .in("plats.vendeur_id", vendeurIds);

  // Construire un map vendeur_id → nb commandes
  const ordersMap = {};
  if (lignes) {
    lignes.forEach((l) => {
      const vid = l.plats?.vendeur_id;
      if (vid) ordersMap[vid] = (ordersMap[vid] || 0) + 1;
    });
  }

  // 3. Agréger par chef
  const chefsMap = {};
  plats.forEach((plat) => {
    const vid = plat.vendeur_id;
    if (!vid || !plat.profiles) return;

    if (!chefsMap[vid]) {
      chefsMap[vid] = {
        id: vid,
        name: plat.profiles.nom_complet || "Chef",
        avatar: plat.profiles.avatar || null,
        specialty: plat.profiles.specialite || "",
        totalNotes: 0,
        nbAvis: 0,
        dishes: 0,
      };
    }

    // Compter les plats disponibles
    if (plat.disponibilite) chefsMap[vid].dishes += 1;

    // Accumuler les notes
    if (plat.avis) {
      plat.avis.forEach((a) => {
        chefsMap[vid].totalNotes += a.note;
        chefsMap[vid].nbAvis += 1;
      });
    }
  });

  // 4. Calculer note moyenne + orders, trier par note desc
  return Object.values(chefsMap)
    .map((chef) => ({
      ...chef,
      rating:
        chef.nbAvis > 0
          ? Math.round((chef.totalNotes / chef.nbAvis) * 10) / 10
          : null,
      orders: ordersMap[chef.id] || 0,
    }))
    .filter((c) => c.rating !== null)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}
