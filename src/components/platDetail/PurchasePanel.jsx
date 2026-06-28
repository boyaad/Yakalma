import { Heart, ShoppingCart } from "lucide-react";
import { QuantityPicker } from "./QuantityPicker";
import Button from "../ui/Button";
import { formatFcfa } from "../../utils/currency";

export function PurchasePanel({
  isFavorite,
  onAddToCart,
  onDecrease,
  onIncrease,
  onToggleFavorite,
  price,
  quantity,
}) {
  return (
    <section className="border-t border-border-warm pt-6">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <QuantityPicker
          quantity={quantity}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />

        <span className="font-poppins text-2xl font-semibold text-primary">
          {formatFcfa(price * quantity)}
        </span>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="primary"
          onClick={onAddToCart}
          className="flex-1 shadow-[0_6px_14px_rgba(160,67,10,0.22)] h-12"
        >
          <ShoppingCart className="h-5 w-5" />
          Ajouter au panier
        </Button>
      </div>
    </section>
  );
}
