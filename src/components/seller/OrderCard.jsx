import React, { useState } from "react";
import { UtensilsCrossed, Check, X, Loader2 } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { updateOrderStatus } from "../../services/orderService";
import { toast } from "react-toastify";

const statusLabels = {
  en_attente: { text: "En attente", color: "bg-warning/15 text-warning", variant: "pending" },
  en_cours: { text: "En préparation", color: "bg-info/15 text-info", variant: "pending" },
  pret: { text: "Prêt", color: "bg-success/15 text-success", variant: "success" },
  livre: { text: "Livré", color: "bg-success/15 text-success", variant: "success" },
  annulee: { text: "Annulé", color: "bg-error/15 text-error", variant: "danger" },

  pending: { text: "En attente", color: "bg-warning/15 text-warning", variant: "pending" },
  preparing: { text: "En préparation", color: "bg-info/15 text-info", variant: "pending" },
  ready: { text: "Prêt", color: "bg-success/15 text-success", variant: "success" },
  delivered: { text: "Livré", color: "bg-success/15 text-success", variant: "success" },
  cancelled: { text: "Annulé", color: "bg-error/15 text-error", variant: "danger" },
};

export function OrderCard({ order, onStatusUpdated }) {
  const [loading, setLoading] = useState(false);
  const statusInfo = statusLabels[order.order_status] || statusLabels.en_attente;

  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      toast.success("Statut de la commande mis à jour !");
      if (onStatusUpdated) {
        await onStatusUpdated();
      }
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
      toast.error("Impossible de modifier le statut de la commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col justify-between h-full font-poppins">
      <div>
        <Card.Header
          title={`Commande #${order.id.slice(0, 8)}...`}
          subtitle={order.time}
          action={
            <Badge
              variant={statusInfo.variant}
              className="normal-case tracking-normal px-2.5 py-1 font-semibold text-xs rounded-lg"
            >
              {statusInfo.text}
            </Badge>
          }
        />

        <Card.Content className="space-y-4 pt-4">
          {/* Infos Client */}
          <div className="flex items-center gap-2.5 text-sm">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-xs">
                {order.customer?.charAt(0) || "C"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground truncate">{order.customer}</div>
            </div>
          </div>

          {/* Détails Plats */}
          <div className="flex items-start gap-2 text-sm p-3 bg-background-warm/50 rounded-xl border border-border-warm/50">
            <UtensilsCrossed className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground leading-relaxed">
                {order.dish}
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">
                Nombre d'articles: {order.quantity}
              </div>
            </div>
          </div>
        </Card.Content>
      </div>

      <Card.Footer className="mt-4 border-t border-border-warm/50 pt-4">
        <div className="break-words text-lg font-bold text-primary sm:text-xl">{Number(order.total).toFixed(0)} FCFA</div>
        
        <div className="flex flex-wrap items-center gap-2">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <>
              {order.order_status === "en_attente" && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleUpdateStatus("annulee")}
                    className="p-2 border-error/20 hover:bg-error/5 hover:border-error text-error rounded-lg"
                    aria-label="Refuser la commande"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleUpdateStatus("en_cours")}
                    className="px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Accepter
                  </Button>
                </>
              )}

              {order.order_status === "en_cours" && (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleUpdateStatus("pret")}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Prêt
                </Button>
              )}

              {order.order_status === "pret" && (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleUpdateStatus("livre")}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Livré
                </Button>
              )}
            </>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
}
