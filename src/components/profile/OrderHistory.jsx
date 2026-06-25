import { useState } from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Link } from "react-router-dom";
import { useUserInfo } from "../../context/UserInfoContext";
import { ChevronDown, ChevronUp, Package } from "lucide-react";

import { cancelOrder } from "../../services/orderService";
import { toast } from "react-toastify";

const statusLabels = {
  // Français (Base de données)
  en_attente: { text: "En attente", color: "bg-warning/15 text-warning" },
  en_cours: { text: "En préparation", color: "bg-info/15 text-info" },
  pret: { text: "Prêt", color: "bg-success/15 text-success" },
  livre: { text: "Livré", color: "bg-success/15 text-success" },
  annulee: { text: "Annulé", color: "bg-error/15 text-error" },

  // Anglais (UI Rétrocompatibilité)
  pending: { text: "En attente", color: "bg-warning/15 text-warning" },
  preparing: { text: "En préparation", color: "bg-info/15 text-info" },
  ready: { text: "Prêt", color: "bg-success/15 text-success" },
  delivered: { text: "Livré", color: "bg-success/15 text-success" },
  cancelled: { text: "Annulé", color: "bg-error/15 text-error" },
};

function OrderCard({ order, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = statusLabels[order.order_status] || statusLabels.en_attente;
  
  const getBadgeVariant = (status) => {
    if (status === "delivered" || status === "livre" || status === "pret" || status === "ready") return "success";
    if (status === "cancelled" || status === "annulee") return "danger";
    return "pending";
  };

  const isCancelable = order.order_status === "en_attente" || order.order_status === "pending";

  return (
    <article className="rounded-xl bg-background-warm p-5 transition-all hover:shadow-sm border border-border-warm bg-white">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-foreground text-sm sm:text-base">Commande #{order.id.slice(0, 8)}...</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {order.date} • {order.items} articles
          </p>
          <p className="mt-2 text-xs sm:text-sm text-foreground/80 leading-relaxed font-medium">
            {order.summary || "Détails non disponibles"}
          </p>
        </div>
        <Badge
          variant={getBadgeVariant(order.order_status)}
          className="normal-case tracking-normal text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-lg"
        >
          {statusInfo.text}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-4 pt-3 border-t border-border-warm/50 mt-3">
        <span className="font-bold text-primary text-base sm:text-lg">{order.total} FCFA</span>
        <div className="flex gap-2">
          {isCancelable && (
            <Button
              variant="outline"
              onClick={() => onCancel(order.id)}
              className="px-3 py-1.5 text-xs font-semibold text-error border-error/30 hover:bg-error/5 hover:border-error rounded-lg"
            >
              Annuler
            </Button>
          )}
          <Button
            variant="link"
            onClick={() => setExpanded(!expanded)}
            className="p-0 h-auto font-semibold text-xs sm:text-sm inline-flex items-center gap-1"
          >
            {expanded ? "Masquer" : "Voir les détails"}
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Panneau de détails extensible */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-border-warm/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">N° de commande :</span> {order.id}
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Date :</span> {order.date}
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Statut :</span> {statusInfo.text}
          </div>

          {order.ligne_commandes && order.ligne_commandes.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-foreground mb-2">Articles commandés :</p>
              <div className="space-y-2">
                {order.ligne_commandes.map((line) => (
                  <div
                    key={line.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-background-warm/70 border border-border-warm/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">
                        {line.plats?.titre || "Plat"}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      x{line.quantite}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-dashed border-border-warm/50 mt-2">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">{order.total} FCFA</span>
          </div>
        </div>
      )}
    </article>
  );
}

export function OrderHistory() {
  const { commandes, commandesLoading: loading, refreshCommandes } = useUserInfo();

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      return;
    }

    try {
      await cancelOrder(orderId);
      toast.success("Commande annulée avec succès.");
      await refreshCommandes();
    } catch (err) {
      console.error("Erreur lors de l'annulation de la commande:", err);
      toast.error(err.message || "Impossible d'annuler la commande.");
    }
  };

  return (
    <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Mes commandes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Consultez l'historique de vos commandes et leur statut.
        </p>
      </div>

      <div className="space-y-4">
        {
          loading ? (
            <p className="text-muted-foreground text-center">Chargement des commandes...</p>
          ) :
          commandes && commandes.length > 0 ? (
            commandes.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={handleCancelOrder} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-muted-foreground">Vous n'avez pas encore de commandes.</p>
              <Link
                  to="/plats"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
              >
                Explorer le catalogue
              </Link>
            </div>
          )
        }
      </div>
    </section>
  );
}
