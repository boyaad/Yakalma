import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export function EmptyFavorites() {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-border-warm">
      <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">
        Aucun favori pour le moment
      </h2>
      <p className="text-muted-foreground mb-6">
        Ajoutez vos plats préférés à vos favoris pour les retrouver facilement
      </p>
      <Link
        to="/catalogue"
        className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        Découvrir les plats
      </Link>
    </div>
  );
}
