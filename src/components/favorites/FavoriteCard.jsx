import { Link } from "react-router-dom";
import { Star, Heart, MapPin } from "lucide-react";

export function FavoriteCard({ dish, onRemove }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border-warm">
      <Link to={`/plat/${dish.id}`} className="block">
        <div className="aspect-video bg-muted overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1">{dish.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">Par {dish.chef}</p>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium">
                {dish.rating} ({dish.reviews})
              </span>
            </div>
            <span className="text-primary font-semibold">{dish.price}€</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{dish.distance}</span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={() => onRemove(dish.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>Retirer des favoris</span>
        </button>
      </div>
    </div>
  );
}
