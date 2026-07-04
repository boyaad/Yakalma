import React from "react";
import { BellRing, ShoppingBag, ArrowRight } from "lucide-react";

export function PendingOrdersFloatingIndicator({ orders, onViewOrders }) {
  if (!orders || orders.length === 0) return null;

  // Filtrer les commandes avec statut "en_attente" ou "pending"
  const pendingOrders = orders.filter(
    (order) => order.order_status === "en_attente" || order.status === "en_attente"
  );

  const count = pendingOrders.length;
  if (count === 0) return null;

  return (
    <div
      onClick={onViewOrders}
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 max-w-full sm:max-w-sm bg-white border border-warning/30 rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.15)] p-4 cursor-pointer hover:scale-[1.02] sm:hover:scale-105 hover:shadow-[0_15px_35px_rgba(245,158,11,0.22)] transition-all duration-300 flex items-center gap-3 group animate-slide-up"
    >
      {/* Icône avec double pulsation d'alerte */}
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-warning/15 flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-warning animate-bounce" />
        </div>
        {/* Point d'alerte rouge clignotant */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-error text-[10px] font-bold text-white items-center justify-center">
            {count}
          </span>
        </span>
      </div>

      {/* Contenu textuel clair */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-xs font-bold text-warning uppercase tracking-wider flex items-center gap-1.5">
          <BellRing className="w-3.5 h-3.5 animate-pulse" />
          Action requise
        </h4>
        <p className="text-sm font-semibold text-foreground mt-0.5">
          {count > 1 ? `${count} nouvelles commandes !` : "Nouvelle commande reçue !"}
        </p>
        <p className="text-xs text-muted-foreground">
          Cliquez pour accepter ou refuser
        </p>
      </div>

      {/* Bouton flèche d'action */}
      <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-warning group-hover:bg-warning group-hover:text-white transition-all duration-300">
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}
