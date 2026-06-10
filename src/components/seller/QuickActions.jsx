import { Link } from "react-router-dom";
import { Plus, Package, UtensilsCrossed } from "lucide-react";

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-border-warm p-5">
      <h2 className="text-lg font-bold mb-4">Actions rapides</h2>
      <div className="space-y-3">
        <Link
          to="/seller/add-dish"
          className="flex items-center gap-3 p-3 bg-muted/50 text-foreground rounded-lg hover:bg-muted/70 active:bg-primary active:text-white transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Ajouter un plat</span>
        </Link>
        <Link
          to="/seller/orders"
          className="group w-full flex items-center gap-3 p-3 bg-muted/50 text-foreground rounded-lg hover:bg-muted/70 active:bg-primary active:text-white transition-all text-left"
        >
          <Package className="w-5 h-5" />
          <div>
            <div className="font-medium text-sm">Gérer les commandes</div>
            <div className="text-xs text-muted-foreground group-active:text-white/80">
              42 en attente
            </div>
          </div>
        </Link>
        <Link
          to="/seller/dishes"
          className="group w-full flex items-center gap-3 p-3 bg-muted/50 text-foreground rounded-lg hover:bg-muted/70 active:bg-primary active:text-white transition-all text-left"
        >
          <UtensilsCrossed className="w-5 h-5" />
          <div>
            <div className="font-medium text-sm">Mes plats</div>
            <div className="text-xs text-muted-foreground group-active:text-white/80">
              12 actifs
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
