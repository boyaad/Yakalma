import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export function TopDishes({ dishes }) {
  return (
    <div className="bg-white rounded-xl border border-border-warm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Plats populaires</h2>
        <Link
          to="/seller/dishes"
          className="text-sm text-primary hover:underline font-medium"
        >
          Voir tout
        </Link>
      </div>
      <div className="space-y-3">
        {dishes.slice(0, 3).map((dish) => (
          <div
            key={dish.id}
            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:shadow-sm transition-all"
          >
            <img
              src={dish.image}
              alt={dish.name}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{dish.name}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <span>{dish.rating}</span>
                </div>
                <span>•</span>
                <span>{dish.orders} ventes</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-primary">{dish.price}€</div>
              <div className="text-xs text-muted-foreground">
                {dish.revenue}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
