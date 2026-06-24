import { Link } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useEffect, useState } from "react";
import { FALLBACK_PLATS, FALLBACK_CATEGORIES } from "../../data/plats";

// Images correspondant exactement aux catégories sénégalaises
const IMAGES_PAR_CATEGORIE = {
  // Catégories BDD réelle
  "Plat principal":
    "https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjByaWNlJTIwZmlzaCUyMG1lYWx8ZW58MXx8fHwxNzgwNTg0MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Thiéboudienne Rouge":
    "https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjByaWNlJTIwZmlzaCUyMG1lYWx8ZW58MXx8fHwxNzgwNTg0MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Yassa poulet":
    "https://images.unsplash.com/photo-1665400808116-f0e6339b7e9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5lZ2FsZXNlJTIwZm9vZCUyMHlhc3NhJTIwY2hpY2tlbnxlbnwxfHx8fDE3ODA1ODQxNzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Mafé":
    "https://images.unsplash.com/photo-1608500218861-01091cdc501e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHN0ZXclMjBtZWF0JTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3ODA1ODQxODN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Desserts":
    "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=800&q=80",
  "Jus locaux":
    "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80",

  // Catégories fallback
  "Thiéboudienne":
    "https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjByaWNlJTIwZmlzaCUyMG1lYWx8ZW58MXx8fHwxNzgwNTg0MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "Yassa":
    "https://images.unsplash.com/photo-1665400808116-f0e6339b7e9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5lZ2FsZXNlJTIwZm9vZCUyMHlhc3NhJTIwY2hpY2tlbnxlbnwxfHx8fDE3ODA1ODQxNzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Mafé / Domoda":
    "https://images.unsplash.com/photo-1608500218861-01091cdc501e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHN0ZXclMjBtZWF0JTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3ODA1ODQxODN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "Grillades":
    "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMHJpY2UlMjB2ZWdldGFibGVzfGVufDF8fHx8MTc4MDU2NTMxOHww&ixlib=rb-4.1.0&q=80&w=1080",
  "Poisson":
    "https://images.unsplash.com/photo-1548704087-b11dab0fbec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGZpc2glMjBwbGFudGFpbnMlMjBtZWFsfGVufDF8fHx8MTc4MDU4NDE4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
};

const IMAGE_DEFAUT =
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80";

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [vraisPlats, setVraisPlats] = useState([]);

  // 1. Charger les plats
  useEffect(() => {
    async function chargerPlats() {
      try {
        const { data, error } = await supabase.from("plats").select("*");
        if (error || !data || data.length === 0) {
          setVraisPlats(FALLBACK_PLATS);
        } else {
          setVraisPlats(data);
        }
      } catch (err) {
        setVraisPlats(FALLBACK_PLATS);
      }
    }
    chargerPlats();
  }, []);

  // 2. Charger les catégories une fois les plats disponibles
  useEffect(() => {
    if (vraisPlats.length === 0) return;

    async function chargerCategories() {
      let rawCategories = [];
      try {
        const { data, error } = await supabase.from("categories").select("*");
        if (error || !data || data.length === 0) {
          rawCategories = FALLBACK_CATEGORIES;
        } else {
          rawCategories = data;
        }
      } catch (err) {
        rawCategories = FALLBACK_CATEGORIES;
      }

      // On associe l'image correcte + le nombre de plats pour chaque catégorie
      const avecDetails = rawCategories.map((cat) => ({
        ...cat,
        image: IMAGES_PAR_CATEGORIE[cat.nom] || IMAGE_DEFAUT,
        count: vraisPlats.filter((p) => p.categorie_id === cat.id).length,
      }));

      // On n'affiche que les catégories qui ont au moins 1 plat
      setCategories(avecDetails.filter((cat) => cat.count > 0));
    }

    chargerCategories();
  }, [vraisPlats]);

  // Pas encore chargé
  if (categories.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4">Explorez par catégorie</h2>
          <p className="text-lg text-muted-foreground">
            Découvrez une variété de cuisines authentiques
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/plats?category=${category.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-square shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={category.image}
                alt={category.nom}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <h3 className="text-lg sm:text-xl font-semibold mb-1">
                  {category.nom}
                </h3>
                <p className="text-sm text-white/80">{category.count} plat{category.count > 1 ? "s" : ""}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
