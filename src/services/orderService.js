import { supabase } from "./supabase";

export async function getOrders(userId) {
  return await supabase
    .from("commandes")
    .select("*")
    .eq("utilisateur_id", userId);
}
