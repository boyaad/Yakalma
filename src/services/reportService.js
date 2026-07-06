import { supabase } from "./supabase";

function formatDate(value) {
  if (!value) return "Date non renseignée";

  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getTargetLabel(report) {
  if (report.plats?.titre) return report.plats.titre;
  if (report.profiles?.nom_complet) return report.profiles.nom_complet;
  if (report.cible_nom) return report.cible_nom;
  if (report.plat_id) return "Plat signalé";
  if (report.vendeur_id) return "Vendeur signalé";
  return "Élément concerné";
}

export function normalizeReport(report) {
  const createdAt = report.date_creation || report.created_at || report.date;

  return {
    id: report.id,
    type: report.type_signalement || report.type || report.categorie || "Signalement",
    target: getTargetLabel(report),
    subject: report.objet || report.reason || report.type_signalement || "Signalement",
    description: report.description || "Aucune description renseignée.",
    status: report.statut || report.status || "en_cours",
    response: report.reponse_yakalma || report.reponse || report.response || "",
    date: formatDate(createdAt),
    rawDate: createdAt,
  };
}

export async function createDishReport({
  userId,
  dishId,
  sellerId,
  dishName,
  description,
}) {
  const reportPayload = {
    utilisateur_id: userId,
    plat_id: dishId,
    vendeur_id: sellerId,
    type_signalement: "Plat",
    objet: dishName ? `Signalement du plat ${dishName}` : "Signalement d'un plat",
    description,
    statut: "en_cours",
    date_creation: new Date().toISOString(),
  };

  const response = await supabase
    .from("signalements")
    .insert(reportPayload)
    .select()
    .single();

  if (response.error) {
    const fallbackPayload = { ...reportPayload };
    delete fallbackPayload.date_creation;

    const fallbackResponse = await supabase
      .from("signalements")
      .insert(fallbackPayload)
      .select()
      .single();

    if (fallbackResponse.error) {
      const compatiblePayload = { ...fallbackPayload };
      delete compatiblePayload.vendeur_id;

      const { data, error } = await supabase
        .from("signalements")
        .insert(compatiblePayload)
        .select()
        .single();

      if (error) throw error;

      return data;
    }

    return fallbackResponse.data;
  }

  return response.data;
}

export async function getUserReports(userId) {
  const response = await supabase
    .from("signalements")
    .select(`
      *,
      plats (
        titre
      ),
      profiles (
        nom_complet
      )
    `)
    .eq("utilisateur_id", userId)
    .order("date_creation", { ascending: false });

  if (response.error) {
    const fallbackResponse = await supabase
      .from("signalements")
      .select("*")
      .eq("utilisateur_id", userId)
      .order("date_creation", { ascending: false });

    if (fallbackResponse.error) {
      const { data, error } = await supabase
        .from("signalements")
        .select("*")
        .eq("utilisateur_id", userId);

      if (error) throw error;

      return (data || []).map(normalizeReport);
    }

    return (fallbackResponse.data || []).map(normalizeReport);
  }

  return (response.data || []).map(normalizeReport);
}
