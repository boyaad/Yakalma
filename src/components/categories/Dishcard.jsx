import { Link } from "react-router-dom";
import { Star, Heart, MapPin, Clock } from "lucide-react";

export function DishCard({ dish, isFavorite, onToggleFavorite }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-border">
      <div className="relative">
        <Link to={`/plats/${dish.id}`} className="block">
          <div className="aspect-[4/3] bg-muted overflow-hidden">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>

        {/* Badge */}
        {dish.badge && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium shadow-lg">
            {dish.badge}
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(dish.id)}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg cursor-pointer"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        {/* Chef Info */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={dish.chefAvatar}
            alt={dish.chef}
            className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
          />
          <span className="text-sm text-muted-foreground">Par {dish.chef}</span>
        </div>

        {/* Dish Name */}
        <Link to={`/plats/${dish.id}`}>
          <h3 className="font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-1">
            {dish.name}
          </h3>
        </Link>

        {/* Rating and Delivery */}
        <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span className="text-sm font-medium">{dish.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({dish.reviews})
            </span>
          </div>
          <span className="text-xs text-muted-foreground">•</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{dish.deliveryTime}</span>
          </div>
        </div>

        {/* Distance and Price */}
        <div className="flex flex-col gap-2 pt-3 border-t border-border min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{dish.distance} km</span>
          </div>
          <span className="break-words text-lg font-semibold text-primary">
            {dish.price} FCFA
          </span>
        </div>
      </div>
    </div>
  );
}
