import { supabase } from "./supabase";

export async function getPlats() {
  return await supabase
    .from("plats")
    .select(
      `
      *,
      profiles (
        nom_complet,
        localisation
      ),
      avis (
        note
      )
    `,
    )
    .eq("disponibilite", true);
}

export async function getPlatById(id) {
  return await supabase
    .from("plats")
    .select(
      `
      *,
      profiles (
        nom_complet,
        localisation,
        avatar
      )
    `,
    )
    .eq("id", id)
    .single();
}

export async function getChefStats(vendeurId) {
  if (!vendeurId) {
    return { rating: 0, reviewsCount: 0, dishesCount: 0 };
  }

  const { data: plats, error } = await supabase
    .from("plats")
    .select(
      `
      id,
      disponibilite,
      avis (
        note
      )
    `,
    )
    .eq("vendeur_id", vendeurId);

  if (error) throw error;

  const chefPlats = plats || [];
  const activeDishesCount = chefPlats.filter((plat) => plat.disponibilite).length;
  const notes = chefPlats.flatMap((plat) =>
    (plat.avis || []).map((avis) => avis.note).filter((note) => note != null),
  );

  return {
    rating:
      notes.length > 0
        ? Math.round(
            (notes.reduce((sum, note) => sum + note, 0) / notes.length) * 10,
          ) / 10
        : 0,
    reviewsCount: notes.length,
    dishesCount: activeDishesCount,
  };
}

export async function addPlat(platData) {
  return await supabase.from("plats").insert([platData]).select().single();
}

export async function updatePlat(id, modifications) {
  return await supabase
    .from("plats")
    .update(modifications)
    .eq("id", id)
    .select()
    .single();
}

export async function deletePlat(id) {
  return await supabase.from("plats").delete().eq("id", id);
}

function compresserImage(fichier, maxLargeur = 1000, qualite = 0.7) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let largeur = img.width;
        let hauteur = img.height;

        if (largeur > maxLargeur) {
          hauteur = (hauteur * maxLargeur) / largeur;
          largeur = maxLargeur;
        }

        canvas.width = largeur;
        canvas.height = hauteur;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, largeur, hauteur);

        canvas.toBlob(
          (blob) => {
            const fichierCompresse = new File([blob], fichier.name, {
              type: "image/jpeg",
            });
            resolve(fichierCompresse);
          },
          "image/jpeg",
          qualite,
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(fichier);
  });
}
export async function uploadImagePlat(fichier) {
  const nomFichier = `${Date.now()}-${fichier.name}`;

  const { error } = await supabase.storage
    .from("plats-images")
    .upload(nomFichier, fichier);

  if (error) return { error };

  const { data } = supabase.storage
    .from("plats-images")
    .getPublicUrl(nomFichier);

  return { url: data.publicUrl };
}

export async function getCategories() {
  return await supabase.from("categories").select("*");
}
