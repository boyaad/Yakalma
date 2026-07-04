import { supabase } from "./supabase";

export async function signUp(email, password) {
  const redirectBase =
    import.meta.env.VITE_SITE_URL ||
    "https://yakalma-gahs-1sd5nnoie-yakalma.vercel.app/";
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${redirectBase}/create-profile`,
    },
  });
}

export async function createProfile(
  nom_complet,
  role,
  user_id,
  avatar,
  telephone,
  localisation,
) {
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

export async function requestPasswordReset(email, redirectTo) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
}

export async function updatePassword(password) {
  return await supabase.auth.updateUser({
    password,
  });
}

export async function changePassword(email, currentPassword, newPassword) {
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) {
    return {
      data: null,
      error: new Error("Le mot de passe actuel est incorrect."),
    };
  }

  return await supabase.auth.updateUser({
    password: newPassword,
  });
}
