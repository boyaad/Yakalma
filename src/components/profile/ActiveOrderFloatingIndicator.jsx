import React from "react";
import { ChefHat, Package, ArrowRight, Bell } from "lucide-react";

export function ActiveOrderFloatingIndicator({ orders, onViewOrders }) {
  if (!orders || orders.length === 0) return null;

  // Trouver les commandes actives (en cours de préparation ou prêtes)
  const activeOrders = orders.filter(
    (order) => order.order_status === "en_cours" || order.order_status === "pret"
  );

  if (activeOrders.length === 0) return null;

  // Prendre la plus récente
  const latestActiveOrder = activeOrders[0];
  const isReady = latestActiveOrder.order_status === "pret";

  return (
    <div
      onClick={onViewOrders}
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 max-w-full sm:max-w-sm bg-white border border-border-warm rounded-2xl shadow-[0_10px_30px_rgba(160,67,10,0.15)] p-4 cursor-pointer hover:scale-[1.02] sm:hover:scale-105 hover:shadow-[0_15px_35px_rgba(160,67,10,0.22)] transition-all duration-300 flex items-center gap-3 group animate-slide-up"
    >
      {/* Icône avec pulsation */}
      <div className="relative">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isReady ? 'bg-success/15' : 'bg-primary/15'}`}>
          {isReady ? (
            <Package className="w-6 h-6 text-success animate-bounce" />
          ) : (
            <ChefHat className="w-6 h-6 text-primary animate-pulse" />
          )}
        </div>
        {/* Petit point de notification vert/orange clignotant */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isReady ? 'bg-success' : 'bg-warning'}`}></span>
          <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${isReady ? 'bg-success' : 'bg-warning'}`}></span>
        </span>
      </div>

      {/* Contenu textuel */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {isReady ? "Prêt pour livraison" : "Commande acceptée"}
        </h4>
        <p className="text-sm font-semibold text-foreground truncate mt-0.5">
          {isReady ? "Votre plat est prêt !" : "Votre commande est en cours..."}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          Commande #{latestActiveOrder.id.slice(0, 8)}...
        </p>
      </div>

      {/* Bouton flèche d'action */}
      <div className="w-8 h-8 rounded-full bg-background-warm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}
