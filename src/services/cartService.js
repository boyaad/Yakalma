import { supabase } from "./supabase";

/**
 * Récupère les articles du panier d'un utilisateur avec les détails du plat
 * (jointure interne sur la table 'plats' et le profil du vendeur).
 */
export async function getCart(userId) {
  const { data, error } = await supabase
    .from("panier_articles")
    .select(
      `
      *,
      plats (
        id,
        titre,
        prix,
        image_url,
        vendeur_id,
        profiles (
          nom_complet
        )
      )
    `,
    )
    .eq("utilisateur_id", userId);

  if (error) throw error;
  return data;
}

/**
 * Ajoute un plat au panier ou incrémente la quantité s'il existe déjà.
 * Utilise upsert avec onConflict pour gérer le cas de doublons.
 */
export async function addToCart(userId, platId, quantite = 1) {
  // Vérifier si l'article existe déjà dans le panier
  const { data: existing, error: fetchError } = await supabase
    .from("panier_articles")
    .select("id, quantite")
    .eq("utilisateur_id", userId)
    .eq("plat_id", platId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    // Mettre à jour la quantité existante
    const { data, error } = await supabase
      .from("panier_articles")
      .update({ quantite: existing.quantite + quantite })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Insérer un nouvel article
    const { data, error } = await supabase
      .from("panier_articles")
      .insert([
        {
          utilisateur_id: userId,
          plat_id: platId,
          quantite,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Modifie directement la quantité d'un article dans le panier.
 */
export async function updateQuantity(userId, platId, quantite) {
  if (quantite < 1) {
    return removeFromCart(userId, platId);
  }

  const { data, error } = await supabase
    .from("panier_articles")
    .update({ quantite })
    .eq("utilisateur_id", userId)
    .eq("plat_id", platId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Retire un article du panier.
 */
export async function removeFromCart(userId, platId) {
  const { error } = await supabase
    .from("panier_articles")
    .delete()
    .eq("utilisateur_id", userId)
    .eq("plat_id", platId);

  if (error) throw error;
}

/**
 * Supprime tous les articles du panier d'un utilisateur.
 */
export async function clearCart(userId) {
  const { error } = await supabase
    .from("panier_articles")
    .delete()
    .eq("utilisateur_id", userId);

  if (error) throw error;
}
