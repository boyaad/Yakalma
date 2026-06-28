import { Eye } from "lucide-react";
import Badge from "../ui/Badge";
import { getStatusInfo } from "./adminStatus";

export default function OrdersTable({ orders, onView }) {
  return (
    <div className="bg-white rounded-xl border border-border-warm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-warm bg-muted/30">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Commande</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Client</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Chef</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground max-md:hidden">Plats</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Total</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Statut</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground max-sm:hidden">Date</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-warm">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <tr key={order.orderId} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 font-medium truncate max-w-[140px]">
                    {order.customer}
                  </td>
                  <td className="px-4 py-3 truncate max-w-[140px]">
                    {order.seller}
                  </td>
                  <td className="px-4 py-3 truncate max-w-[200px] max-md:hidden text-muted-foreground">
                    {order.dish}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {order.total.toLocaleString()} FCFA
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={statusInfo.variant}
                      className="normal-case tracking-normal text-xs"
                    >
                      {statusInfo.text}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-sm:hidden">
                    {order.date}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(order)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">Aucune commande trouvée.</div>
      )}
    </div>
  );
}
