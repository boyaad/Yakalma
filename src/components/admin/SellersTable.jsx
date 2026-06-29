import { Eye, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import Badge from "../ui/Badge";

export default function SellersTable({ sellers, onView, onToggleStatus, actionLoading }) {
  return (
    <div className="bg-white rounded-xl border border-border-warm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-warm bg-muted/30">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Vendeur</th>
              <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Plats</th>
              <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Ventes</th>
              <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Revenus</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Statut</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-warm">
            {sellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={seller.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(seller.name || "S") + "&background=random"}
                      alt={seller.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="font-semibold truncate max-w-[180px]">{seller.name}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-medium">{seller.dishes}</td>
                <td className="px-4 py-3 text-center font-medium">{seller.orders}</td>
                <td className="px-4 py-3 text-center font-medium text-primary">{seller.revenue}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={seller.status === "active" || seller.status === "verified" ? "success" : "error"}
                    className="normal-case tracking-normal text-xs"
                  >
                    {seller.status === "active" || seller.status === "verified" ? "Actif" : "Suspendu"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(seller)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(seller)}
                      disabled={actionLoading}
                      className={`p-2 rounded-lg transition-colors ${
                        seller.status === "active" || seller.status === "verified"
                          ? "text-error hover:bg-error/5 hover:text-error"
                          : "text-success hover:bg-success/5 hover:text-success"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={seller.status === "active" || seller.status === "verified" ? "Désactiver" : "Activer"}
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : seller.status === "active" || seller.status === "verified" ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sellers.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">Aucun vendeur trouvé.</div>
      )}
    </div>
  );
}
