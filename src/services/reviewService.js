import { supabase } from "./supabase";

/**
 * Récupère tous les avis d'un plat avec le nom complet de l'auteur.
 * Comme la FK profiles est sur user_id (et non id), on récupère
 * d'abord les avis puis les profils correspondants séparément.
 * Retourne les avis triés du plus récent au plus ancien.
 */
export async function getReviews(platId) {
  // 1. Récupérer les avis du plat
  const { data: reviews, error } = await supabase
    .from("avis")
    .select("id, note, commentaire, created_at, utilisateur_id, plat_id")
    .eq("plat_id", platId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!reviews || reviews.length === 0) return [];

  // 2. Récupérer les profils des auteurs via user_id
  const userIds = [...new Set(reviews.map((r) => r.utilisateur_id))];

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("user_id, nom_complet, avatar")
    .in("user_id", userIds);

  if (profilesError) {
    console.error("Erreur chargement profils des auteurs:", profilesError);
  }

  // 3. Construire un map user_id → profil
  const profileMap = {};
  if (profiles) {
    profiles.forEach((p) => {
      profileMap[p.user_id] = p;
    });
  }

  // 4. Enrichir les avis avec les données du profil
  return reviews.map((review) => ({
    ...review,
    profiles: profileMap[review.utilisateur_id] || null,
  }));
}

/**
 * Insère un nouvel avis pour un plat donné.
 * Retourne l'avis créé (sans jointure profiles pour éviter les erreurs FK).
 */
export async function addReview(platId, userId, note, commentaire) {
  const { data, error } = await supabase
    .from("avis")
    .insert([
      {
        plat_id: platId,
        utilisateur_id: userId,
        note,
        commentaire,
      },
    ])
    .select("id, note, commentaire, created_at, utilisateur_id, plat_id")
    .single();

  if (error) throw error;
  return data;
}
