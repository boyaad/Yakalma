import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";

export function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="bg-white rounded-xl p-4 flex gap-4">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 rounded-lg object-cover"
      />

      <div className="flex-1">
        <Link to={`/plats/${item.id}`} className="font-medium hover:text-primary">
          {item.name}
        </Link>
        <p className="text-sm text-muted-foreground mb-3">Par {item.chef}</p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center bg-muted rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, -1)}
              className="p-2 hover:bg-muted transition-colors"
              aria-label={`Retirer une portion de ${item.name}`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-1">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, 1)}
              className="p-2 hover:bg-muted transition-colors"
              aria-label={`Ajouter une portion de ${item.name}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <span className="text-primary font-medium whitespace-nowrap">
            {(item.price * item.quantity).toFixed(2)}€
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="p-2 h-fit text-muted-foreground hover:text-destructive transition-colors"
        aria-label={`Supprimer ${item.name} du panier`}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
