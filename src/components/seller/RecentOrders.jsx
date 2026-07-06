import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import Badge from "../ui/Badge";

export function RecentOrders({ orders, getStatusInfo }) {
  return (
    <div className="rounded-xl border border-border-warm bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
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
              className="flex flex-col gap-3 rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
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
              <div className="shrink-0 text-left min-[520px]:text-right">
                <div className="break-words font-bold text-primary">{order.total} FCFA</div>
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
