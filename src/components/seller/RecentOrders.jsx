import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import Badge from "../ui/Badge";

export function RecentOrders({ orders, getStatusInfo }) {
  return (
    <div className="bg-white rounded-xl border border-border-warm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Commandes récentes</h2>
        <Link
          to="/seller/orders"
          className="text-sm text-primary hover:underline font-medium"
        >
          Voir tout
        </Link>
      </div>
      <div className="space-y-3">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          return (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{order.id}</span>
                    <Badge
                      variant={statusInfo.variant || order.status}
                      className="normal-case tracking-normal px-2 py-0.5 font-medium"
                    >
                      {statusInfo.text}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {order.dish} • {order.customer}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-primary">{order.total} FCFA</div>
                <div className="text-xs text-muted-foreground">
                  {order.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
