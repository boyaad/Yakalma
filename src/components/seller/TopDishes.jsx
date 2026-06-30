import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export function TopDishes({ dishes }) {
  return (
    <div className="rounded-xl border border-border-warm bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
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
            className="flex flex-col gap-3 rounded-lg bg-muted/30 p-3 transition-all hover:shadow-sm min-[420px]:flex-row min-[420px]:items-center"
          >
            <img
              src={dish.image}
              alt={dish.name}
              className="h-32 w-full shrink-0 rounded-lg object-cover min-[420px]:h-14 min-[420px]:w-14"
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
            <div className="shrink-0 text-left min-[420px]:text-right">
              <div className="break-words font-bold text-primary">{dish.price} FCFA</div>
              <div className="break-words text-xs text-muted-foreground">
                {dish.revenue}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
