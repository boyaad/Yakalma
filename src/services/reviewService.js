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

/**
 * Récupère les N derniers avis (note ≥ 4) toutes catégories confondues.
 * Utilisé pour la section témoignages de la page d'accueil.
 */
export async function getLatestReviews(limit = 3) {
  // 1. Récupérer les derniers avis avec une bonne note
  const { data: reviews, error } = await supabase
    .from("avis")
    .select("id, note, commentaire, created_at, utilisateur_id")
    .gte("note", 4)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  if (!reviews || reviews.length === 0) return [];

  // 2. Récupérer les profils correspondants
  const userIds = [...new Set(reviews.map((r) => r.utilisateur_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, nom_complet, avatar")
    .in("user_id", userIds);

  const profileMap = {};
  if (profiles) {
    profiles.forEach((p) => {
      profileMap[p.user_id] = p;
    });
  }

  // 3. Enrichir et formater
  return reviews.map((review) => {
    const profile = profileMap[review.utilisateur_id] || null;
    const diffMs = Date.now() - new Date(review.created_at).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    let dateLabel;
    if (diffDays === 0) dateLabel = "Aujourd'hui";
    else if (diffDays === 1) dateLabel = "Il y a 1 jour";
    else if (diffDays < 7) dateLabel = `Il y a ${diffDays} jours`;
    else if (diffDays < 14) dateLabel = "Il y a 1 semaine";
    else if (diffDays < 30) dateLabel = `Il y a ${Math.floor(diffDays / 7)} semaines`;
    else dateLabel = `Il y a ${Math.floor(diffDays / 30)} mois`;

    return {
      id: review.id,
      name: profile?.nom_complet || "Client anonyme",
      avatar: profile?.avatar || null,
      rating: review.note,
      text: review.commentaire,
      date: dateLabel,
    };
  });
}
