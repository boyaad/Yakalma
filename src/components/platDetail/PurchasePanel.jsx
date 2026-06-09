import { Heart, ShoppingCart } from "lucide-react";
import { QuantityPicker } from "./QuantityPicker";

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
          {(price * quantity).toFixed(2)}€
        </span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onAddToCart}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-poppins font-semibold text-white shadow-[0_6px_14px_rgba(160,67,10,0.22)] transition-colors hover:bg-accent"
        >
          <ShoppingCart className="h-5 w-5" />
          Ajouter au panier
        </button>

        <button
          type="button"
          onClick={onToggleFavorite}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            isFavorite
              ? "border-primary bg-primary text-white"
              : "border-border-warm bg-white text-foreground hover:bg-background-warm"
          }`}
          aria-label={
            isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
          }
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>
    </section>
  );
}
