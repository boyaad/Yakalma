import { supabase } from "./supabase";

/**
 * Récupérer toutes les notifications d'un utilisateur (les plus récentes en premier)
 */
export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("utilisateur_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

/**
 * Compter les notifications non lues
 */
export async function getUnreadCount(userId) {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("utilisateur_id", userId)
    .eq("lue", false);

  if (error) throw error;
  return count || 0;
}

/**
 * Créer une notification
 */
export async function createNotification({ utilisateur_id, type, titre, message, commande_id }) {
  const { data, error } = await supabase
    .from("notifications")
    .insert([
      {
        utilisateur_id,
        type,
        titre,
        message,
        commande_id: commande_id || null,
        lue: false,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Marquer une notification comme lue
 */
export async function markAsRead(notificationId) {
  const { error } = await supabase
    .from("notifications")
    .update({ lue: true })
    .eq("id", notificationId);

  if (error) throw error;
}

/**
 * Marquer toutes les notifications d'un utilisateur comme lues
 */
export async function markAllAsRead(userId) {
  const { error } = await supabase
    .from("notifications")
    .update({ lue: true })
    .eq("utilisateur_id", userId)
    .eq("lue", false);

  if (error) throw error;
}

/**
 * Supprimer une notification
 */
export async function deleteNotification(notificationId) {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) throw error;
}
