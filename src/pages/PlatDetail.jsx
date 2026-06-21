import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DishSummary, ReviewsList } from "../components/platDetail";
import { getPlatById } from "../services/platService";
import Button from "../components/ui/Button";

const dishReviews = [
  {
    id: 1,
    author: "Marie L.",
    rating: 5,
    date: "Il y a 2 jours",
    comment:
      "Délicieux ! Exactement comme chez ma grand-mère. Les épices sont parfaitement dosées.",
  },
  {
    id: 2,
    author: "Ahmed B.",
    rating: 5,
    date: "Il y a 1 semaine",
    comment:
      "Meilleur plat que j'ai mangé depuis longtemps. Portions généreuses !",
  },
  {
    id: 3,
    author: "Sophie M.",
    rating: 4,
    date: "Il y a 2 semaines",
    comment:
      "Très bon, juste un peu épicé pour moi mais c'est une question de goût.",
  },
];

function PlatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function chargerPlat() {
      const { data, error } = await getPlatById(id);

      if (error || !data) {
        console.error("Erreur chargement plat:", error);
        setLoading(false);
        return;
      }

      const dishTransforme = {
        id: data.id,
        name: data.titre,
        image: data.image_url,
        price: data.prix,
        rating: 0,
        reviews: 0,
        distance: "0 km",
        prepTime: "30-45 min",
        description: data.description,
        ingredients: [
          "Ingrédients frais",
          "Épices maison",
          "Recette artisanale",
        ],
        allergens: [],
        servings: "1-2 personnes",
        chef: {
          name: data.profiles?.nom_complet || "Vendeur inconnu",
          avatar: data.profiles?.avatar || "",
          rating: 0,
          dishesCount: 0,
        },
      };

      setDish(dishTransforme);
      setLoading(false);
    }

    chargerPlat();
  }, [id]);

  const handleDecrease = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const handleIncrease = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const handleAddToCart = () => {
    navigate("/panier");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du plat...</p>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="bg-background-warm px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border-warm bg-white p-8 text-center">
          <h1 className="mb-3 font-poppins text-3xl font-semibold text-foreground">
            Plat introuvable
          </h1>
          <p className="mb-6 text-muted-foreground">
            Ce plat n'existe pas ou n'est plus disponible.
          </p>
          <Button to="/plats" variant="primary" className="h-12 px-6">
            Retour au catalogue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-warm px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
          <div className="aspect-square overflow-hidden rounded-2xl bg-white">
            <img
              src={dish.image}
              alt={dish.name}
              className="h-full w-full object-cover"
            />
          </div>

          <DishSummary
            dish={dish}
            isFavorite={isFavorite}
            onAddToCart={handleAddToCart}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
            onToggleFavorite={() => setIsFavorite((current) => !current)}
            quantity={quantity}
          />
        </section>

        <ReviewsList reviews={dishReviews} totalReviews={dish.reviews} />
      </div>
    </div>
  );
}

export default PlatDetail;
