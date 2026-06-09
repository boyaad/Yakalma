import { Eye, Edit, Trash2, Power, Star, ShoppingBag } from "lucide-react";

export function DishCard({ dish, statusInfo }) {
  return (
    <div className="bg-white rounded-xl border border-border-warm hover:shadow-md transition-all overflow-hidden">
      <div className="relative">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-40 object-cover"
        />
        <div
          className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${statusInfo.color} ${statusInfo.bgColor}`}
        >
          <Power className="w-3 h-3" />
          {statusInfo.text}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-base mb-2 truncate">{dish.name}</h3>
        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-foreground">{dish.rating}</span>
            <span className="text-xs">({dish.reviews})</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <ShoppingBag className="w-4 h-4" />
            <span>{dish.orders} ventes</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border-warm">
          <div>
            <div className="text-2xl font-bold text-primary">{dish.price}€</div>
            <div className="text-xs text-muted-foreground">
              Rev: {dish.revenue}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-2 text-foreground hover:bg-muted active:bg-primary active:text-white rounded-lg transition-colors"
              title="Voir"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-foreground hover:bg-muted active:bg-primary active:text-white rounded-lg transition-colors"
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-foreground hover:bg-muted active:bg-primary active:text-white rounded-lg transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
