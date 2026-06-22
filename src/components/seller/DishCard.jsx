import { Eye, Edit, Trash2, Power, Star, ShoppingBag } from "lucide-react";
import Badge from "../ui/Badge";

export function DishCard({ dish, statusInfo, onDelete, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-border-warm hover:shadow-md transition-all overflow-hidden">
      <div className="relative">
        <img
          src={dish.image_url}
          alt={dish.titre}
          className="w-full h-40 object-cover"
        />
        <Badge
          variant={dish.status}
          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 backdrop-blur-sm normal-case tracking-normal font-medium"
        >
          <Power className="w-3 h-3" />
          {statusInfo.text}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-base mb-2 truncate">{dish.titre}</h3>
        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning fill-warning" />
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
            <div className="text-2xl font-bold text-primary">
              {dish.prix} FCFA
            </div>
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
              onClick={() => onEdit(dish.id)}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-foreground hover:bg-muted active:bg-primary active:text-white rounded-lg transition-colors"
              title="Supprimer"
              onClick={() => {
                if (window.confirm(`Supprimer "${dish.titre}" ?`)) {
                  onDelete(dish.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
