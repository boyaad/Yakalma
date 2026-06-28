import { useState, useEffect } from "react";
import { getCategories } from "../../services/platService";
import { FALLBACK_CATEGORIES } from "../../data/plats";

export function CategoryTabs({
  dishes = [],
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function chargerCategories() {
      try {
        const { data, error } = await getCategories();
        if (!error && data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (err) {
        setCategories(FALLBACK_CATEGORIES);
      }
    }
    chargerCategories();
  }, []);

  // On construit la liste des catégories avec leur nombre de plats
  const categoriesAvecCount = categories.map((cat) => ({
    id: cat.id,
    nom: cat.nom,
    count: dishes.filter((dish) => dish.category === cat.id).length,
  }));

  // On garde uniquement les catégories qui ont au moins 1 plat
  const categoriesActives = categoriesAvecCount.filter((cat) => cat.count > 0);

  // On ajoute "Tous" en premier (toujours visible)
  const categoriesAvecTous = [
    { id: "all", nom: "Tous", count: dishes.length },
    ...categoriesActives,
  ];

  return (
    <div className="mb-6 overflow-x-auto pb-2" role="tablist" aria-label="Catégories de plats">
      <div className="flex gap-3 min-w-max sm:min-w-0">
        {categoriesAvecTous.map((category) => (
          <button
            key={category.id}
            role="tab"
            aria-selected={selectedCategory === category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setCurrentPage(1);
            }}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all font-medium whitespace-nowrap cursor-pointer ${
              selectedCategory === category.id
                ? "bg-primary text-white shadow-md scale-105"
                : "bg-white hover:bg-white hover:border-primary/30"
            }`}
          >
            {category.nom}
            <span className="ml-2 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
