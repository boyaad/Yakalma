import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="text-center py-16 bg-white rounded-2xl">
      <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h2 className="mb-2">Votre panier est vide</h2>
      <p className="text-muted-foreground mb-6">
        Découvrez nos délicieux plats faits maison
      </p>
      <Link
        to="/plats"
        className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors"
      >
        Voir le catalogue
      </Link>
    </div>
  );
}
