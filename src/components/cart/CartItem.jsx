import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatFcfa } from "../../utils/currency";

export function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 sm:flex-row">
      <img
        src={item.image}
        alt={item.name}
        className="h-40 w-full shrink-0 rounded-lg object-cover sm:h-24 sm:w-24"
      />

      <div className="min-w-0 flex-1">
        <Link to={`/plats/${item.id}`} className="break-words font-medium hover:text-primary">
          {item.name}
        </Link>
        <p className="text-sm text-muted-foreground mb-3">Par {item.chef}</p>

        <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
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

          <span className="text-primary font-medium">
            {formatFcfa(item.price * item.quantity)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="h-fit self-end p-2 text-muted-foreground transition-colors hover:text-destructive sm:self-start"
        aria-label={`Supprimer ${item.name} du panier`}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
