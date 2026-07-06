export function QuantityPicker({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="inline-flex h-11 overflow-hidden rounded-xl border border-border-warm bg-white">
      <button
        type="button"
        onClick={onDecrease}
        className="w-12 font-poppins text-lg font-semibold text-foreground transition-colors hover:bg-background-warm"
        aria-label="Diminuer la quantité"
      >
        -
      </button>

      <span className="flex w-12 items-center justify-center border-x border-border-warm font-poppins text-foreground">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className="w-12 font-poppins text-lg font-semibold text-foreground transition-colors hover:bg-background-warm"
        aria-label="Augmenter la quantité"
      >
        +
      </button>
    </div>
  );
}
