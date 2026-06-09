import { UtensilsCrossed } from "lucide-react";

export function OrderCard({ order, statusInfo }) {
  return (
    <div className="bg-white rounded-xl border border-border-warm p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-bold text-base mb-1">{order.id}</div>
          <div className="text-xs text-muted-foreground">{order.time}</div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor}`}
        >
          {statusInfo.text}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-semibold text-xs">
              {order.customer.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{order.customer}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm p-2 bg-muted/30 rounded-lg">
          <UtensilsCrossed className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{order.dish}</div>
            <div className="text-xs text-muted-foreground">
              Quantité: {order.quantity}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border-warm">
        <div className="text-2xl font-bold text-primary">{order.total}€</div>
        <button className="px-4 py-2 bg-muted/70 text-foreground rounded-lg hover:bg-muted active:bg-primary active:text-white transition-colors text-sm font-medium">
          Gérer
        </button>
      </div>
    </div>
  );
}
