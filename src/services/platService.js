import { supabase } from "./supabase";

export async function getPlats() {
  return await supabase.from("plats").select("*");
}

export async function getPlatById(id) {
  return await supabase.from("plats").select("*").eq("id", id).single();
}
