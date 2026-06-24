import { Link } from "react-router-dom";
import { allDishes } from "../../data/Dishes";
import { supabase } from "../../services/supabase";
import { useEffect, useState } from "react";

const CATEGORY_METADATA = [
  {
    id: "moroccan",
    name: "Marocain",
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80",
  },
  {
    id: "mediterranean",
    name: "Méditerranéen",
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80",
  },
  {
    id: "oriental",
    name: "Oriental",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
  },
  {
    id: "desserts",
    name: "Desserts",
    image:
      "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=800&q=80",
  },
];

export function Categories({ dishes = allDishes }) {
  const [categories, setCategories] = useState([]);
  const [vraisPlats, setVraisPlats] = useState([]);

  useEffect(() => {
    async function chargerPlats() {
      const { data } = await supabase.from("plats").select("*");
      if (data) setVraisPlats(data);
    }
    chargerPlats();
  }, []);

  async function getCategories() {
    let { data, error } = await supabase.from("categories").select("*");

    if (data) {
      const imagesParCategorie = {
        Thiéb:
          "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80",
        Yassa:
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
        Mafé: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80",
        Desserts:
          "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=800&q=80",
        "Jus locaux":
          "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80",
      };

      const categoriesAvecCount = data.map((cat) => ({
        ...cat,
        image:
          imagesParCategorie[cat.nom] ||
          "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
        count: vraisPlats.filter((dish) => dish.categorie_id === cat.id).length,
      }));

      setCategories(categoriesAvecCount);
    }
  }

  useEffect(() => {
    if (vraisPlats.length > 0) {
      getCategories();
    }
  }, [vraisPlats]);

  const Placeholder = CATEGORY_METADATA.map((category) => ({
    ...category,
    count: vraisPlats.filter((dish) => dish.category === category.id).length,
  }));

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
          {categories.length > 0
            ? categories.map((category) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                    <h3 className="text-lg sm:text-xl font-semibold mb-1">
                      {category.nom}
                    </h3>
                    <p className="text-sm text-white/80">
                      {category.count} plats
                    </p>
                  </div>
                </Link>
              ))
            : Placeholder.map((category) => (
                <Link
                  key={category.id}
                  to={`/plats?category=${category.id}`}
                  className="group relative overflow-hidden rounded-2xl aspect-square shadow-md hover:shadow-xl transition-all"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                    <h3 className="text-lg sm:text-xl font-semibold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/80">
                      {category.count} plats
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
