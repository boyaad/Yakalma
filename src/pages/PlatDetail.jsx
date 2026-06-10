import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DishSummary, ReviewsList } from "../components/platDetail";
import { allDishes } from "../data/Dishes";
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

const dishDetailsById = {
  1: {
    description:
      "Couscous royal traditionnel préparé avec amour. Semoule fine, légumes de saison, viande d'agneau tendre, poulet épicé et merguez maison. Servi avec bouillon parfumé et pois chiches.",
    ingredients: [
      "Semoule fine",
      "Agneau",
      "Poulet",
      "Merguez",
      "Courgettes",
      "Carottes",
      "Navets",
      "Pois chiches",
      "Épices maison",
    ],
    allergens: ["Gluten"],
    servings: "2-3 personnes",
  },
  2: {
    description:
      "Tajine de poulet au citron confit, olives vertes et épices marocaines. Un plat fondant, parfumé et préparé lentement pour garder toute sa saveur.",
    ingredients: [
      "Poulet",
      "Citron confit",
      "Olives",
      "Oignons",
      "Coriandre",
      "Gingembre",
      "Safran",
    ],
    allergens: [],
    servings: "1-2 personnes",
  },
  3: {
    description:
      "Pastilla croustillante au poulet, amandes grillées et cannelle. Une recette sucrée-salée généreuse, parfaite pour découvrir un classique marocain.",
    ingredients: [
      "Poulet",
      "Feuilles de brick",
      "Amandes",
      "Oignons",
      "Cannelle",
      "Oeufs",
    ],
    allergens: ["Gluten", "Fruits à coque", "Oeufs"],
    servings: "2 personnes",
  },
};

function getDishDetail(id) {
  const baseDish = allDishes.find((dish) => String(dish.id) === String(id));

  if (!baseDish) {
    return null;
  }

  const extra = dishDetailsById[baseDish.id] || {
    description:
      "Plat fait maison préparé avec des ingrédients frais et une recette authentique du chef.",
    ingredients: ["Ingrédients frais", "Épices maison", "Recette artisanale"],
    allergens: [],
    servings: "1-2 personnes",
  };

  return {
    id: baseDish.id,
    name: baseDish.name,
    chef: {
      name: baseDish.chef,
      avatar: baseDish.chefAvatar,
      rating: baseDish.rating,
      dishesCount: Math.max(12, Math.round(baseDish.reviews / 4)),
    },
    image: baseDish.image,
    price: baseDish.price,
    rating: baseDish.rating,
    reviews: baseDish.reviews,
    distance: `${baseDish.distance} km`,
    prepTime: baseDish.deliveryTime,
    ...extra,
  };
}

function PlatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const dish = getDishDetail(id);

  const handleDecrease = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const handleIncrease = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const handleAddToCart = () => {
    navigate("/panier");
  };

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
          <Button
            to="/plats"
            variant="primary"
            className="h-12 px-6"
          >
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
