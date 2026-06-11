import { supabase } from "./supabase";

export async function signUp(email, password) {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function createProfile(nom_complet, role, user_id, avatar, telephone, localisation) {
  return await supabase.from("profiles").insert({
    nom_complet,
    role,
    user_id,
    avatar,
    telephone,
    localisation,
  });
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function resetPassword(email) {
  return await supabase.auth.resetPasswordForEmail(email);
}
