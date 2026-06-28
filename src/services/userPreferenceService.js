import { supabase } from "./supabase";

export const defaultPreferences = {
  promotionalOffers: true,
  orderTrackingNotifications: true,
  weeklyNewsletter: false,
};

function fromDatabase(row) {
  if (!row) return defaultPreferences;

  return {
    promotionalOffers:
      row.recevoir_offres_promotionnelles ?? defaultPreferences.promotionalOffers,
    orderTrackingNotifications:
      row.notifications_suivi_commande ??
      defaultPreferences.orderTrackingNotifications,
    weeklyNewsletter:
      row.newsletter ?? defaultPreferences.weeklyNewsletter,
  };
}

function toDatabase(userId, preferences) {
  return {
    utilisateur_id: userId,
    recevoir_offres_promotionnelles: preferences.promotionalOffers,
    notifications_suivi_commande: preferences.orderTrackingNotifications,
    newsletter: preferences.weeklyNewsletter,
  };
}

export async function getUserPreferences(userId) {
  const { data, error } = await supabase
    .from("preferences_utilisateur")
    .select("*")
    .eq("utilisateur_id", userId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const { data: createdData, error: createError } = await supabase
      .from("preferences_utilisateur")
      .insert(toDatabase(userId, defaultPreferences))
      .select()
      .single();

    if (createError) throw createError;

    return fromDatabase(createdData);
  }

  return fromDatabase(data);
}

export async function saveUserPreferences(userId, preferences) {
  const { data, error } = await supabase
    .from("preferences_utilisateur")
    .update(toDatabase(userId, preferences))
    .eq("utilisateur_id", userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (data) return fromDatabase(data);

  const { data: createdData, error: createError } = await supabase
    .from("preferences_utilisateur")
    .insert(toDatabase(userId, preferences))
    .select()
    .single();

  if (createError) throw createError;

  return fromDatabase(createdData);
}
