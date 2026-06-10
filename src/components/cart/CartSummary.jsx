import Button from "../ui/Button";

export function CartSummary({ subtotal, deliveryFee, total, onCheckout }) {
  return (
    <aside className="bg-white rounded-xl p-6 sticky top-24">
      <h3 className="mb-4">Résumé de la commande</h3>

      <div className="space-y-3 mb-4 pb-4">
        <div className="flex justify-between text-muted-foreground">
          <span>Sous-total</span>
          <span>{subtotal.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Frais de livraison</span>
          <span>{deliveryFee.toFixed(2)}€</span>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <span className="font-medium">Total</span>
        <span className="text-primary font-medium text-xl">
          {total.toFixed(2)}€
        </span>
      </div>

      <Button
        type="button"
        variant="primary"
        onClick={onCheckout}
        className="w-full mb-3 py-3 rounded-lg"
      >
        Procéder au paiement
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full bg-muted hover:bg-muted/80 py-3 rounded-lg text-foreground"
      >
        Ajouter un code promo
      </Button>
    </aside>
  );
}
