import { useState } from "react";
import { Heart } from "lucide-react";
import { EmptyFavorites } from "../components/favorites/EmptyFavorites";
import { FavoritesList } from "../components/favorites/FavoritesList";

const initialFavorites = [
  {
    id: 1,
    name: "Couscous Royal",
    chef: "Fatima K.",
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80",
    price: 15,
    rating: 4.8,
    reviews: 127,
    distance: "2.3 km",
  },
  {
    id: 3,
    name: "Pastilla au Poulet",
    chef: "Samira B.",
    image:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800&q=80",
    price: 18,
    rating: 5.0,
    reviews: 64,
    distance: "3.1 km",
  },
  {
    id: 6,
    name: "Baklava Maison",
    chef: "Karim S.",
    image:
      "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=800&q=80",
    price: 8,
    rating: 4.9,
    reviews: 78,
    distance: "2.5 km",
  },
];

export default function Favorites() {
  const [favorites, setFavorites] = useState(initialFavorites);

  const handleRemoveFavorite = (dishId) => {
    setFavorites(favorites.filter((dish) => dish.id !== dishId));
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-background-warm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <h1 className="text-2xl font-bold">
            Mes favoris ({favorites.length})
          </h1>
        </div>

        {favorites.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <FavoritesList
            favorites={favorites}
            onRemove={handleRemoveFavorite}
          />
        )}
      </div>
    </div>
  );
}
