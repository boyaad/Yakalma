import { useState, useCallback } from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Link } from "react-router-dom";
import { useUserInfo } from "../../context/UserInfoContext";
import { ChevronDown, ChevronUp, Package, EyeOff, Eye, Trash2 } from "lucide-react";

import { cancelOrder, deleteOrder, hideOrder } from "../../services/orderService";
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

const TERMINATED_STATUSES = ["livre", "delivered", "annulee", "cancelled"];

function OrderCard({ order, onCancel, onHide, onDelete, isHidden, onRestore }) {
  const [expanded, setExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const statusInfo = statusLabels[order.order_status] || statusLabels.en_attente;
  
  const getBadgeVariant = (status) => {
    if (status === "delivered" || status === "livre" || status === "pret" || status === "ready") return "success";
    if (status === "cancelled" || status === "annulee") return "danger";
    return "pending";
  };

  const isCancelable = order.order_status === "en_attente" || order.order_status === "pending";
  const isDeletable = TERMINATED_STATUSES.includes(order.order_status);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(order.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleHideToggle = async () => {
    setIsHiding(true);
    try {
      if (isHidden) {
        await onRestore(order.id);
      } else {
        await onHide(order.id);
      }
    } finally {
      setIsHiding(false);
    }
  };

  return (
    <article
      className={`rounded-xl p-5 transition-all hover:shadow-sm border bg-white ${
        isHidden ? "border-border-warm/40 opacity-60" : "border-border-warm"
      }`}
    >
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
        <div className="flex items-center gap-2">
          <Badge
            variant={getBadgeVariant(order.order_status)}
            className="normal-case tracking-normal text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-lg"
          >
            {statusInfo.text}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-3 border-t border-border-warm/50 mt-3">
        <span className="font-bold text-primary text-base sm:text-lg">{order.total} FCFA</span>
        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          {/* Bouton Annuler (seulement pour les commandes en attente) */}
          {isCancelable && !isHidden && (
            <Button
              variant="outline"
              onClick={() => onCancel(order.id)}
              className="px-3 py-1.5 text-xs font-semibold text-error border-error/30 hover:border-error rounded-lg"
            >
              Annuler
            </Button>
          )}

          {/* Bouton Masquer / Restaurer (Icône uniquement) */}
          <button
            onClick={handleHideToggle}
            disabled={isHiding}
            title={isHidden ? "Restaurer dans l'historique" : "Masquer de l'historique"}
            className={`p-2 rounded-lg border transition-all ${
              isHidden
                ? "text-info border-info/20 bg-info/5 hover:bg-info/10 hover:border-info"
                : "text-muted-foreground border-border-warm hover:bg-background-warm hover:text-foreground"
            } disabled:opacity-50`}
          >
            {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>

          {/* Bouton Supprimer (Icône uniquement, seulement pour les commandes terminées/annulées) */}
          {isDeletable && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Supprimer définitivement"
              className="p-2 text-error border border-error/20 bg-error/5 hover:bg-error/10 hover:border-error rounded-lg transition-all disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <Button
            variant="link"
            onClick={() => setExpanded(!expanded)}
            className="p-0 h-auto font-semibold text-xs sm:text-sm inline-flex items-center gap-1 ml-2"
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
                      <Package className="h-4 w-4 text-primary shrink-0" />
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
  const [showHidden, setShowHidden] = useState(false);

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

  const handleHideOrder = useCallback(async (orderId) => {
    try {
      await hideOrder(orderId, true);
      toast.info("Commande masquée de l'historique.");
      await refreshCommandes();
    } catch (err) {
      console.error("Erreur lors du masquage de la commande:", err);
      toast.error(err.message || "Impossible de masquer la commande.");
    }
  }, [refreshCommandes]);

  const handleRestoreOrder = useCallback(async (orderId) => {
    try {
      await hideOrder(orderId, false);
      toast.info("Commande restaurée dans l'historique.");
      await refreshCommandes();
    } catch (err) {
      console.error("Erreur lors de la restauration de la commande:", err);
      toast.error(err.message || "Impossible de restaurer la commande.");
    }
  }, [refreshCommandes]);

  const handleDeleteOrder = useCallback(async (orderId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cette commande ? Cette action est irréversible.")) {
      return;
    }

    try {
      await deleteOrder(orderId);
      toast.success("Commande supprimée définitivement.");
      await refreshCommandes();
    } catch (err) {
      console.error("Erreur lors de la suppression de la commande:", err);
      toast.error(err.message || "Impossible de supprimer la commande.");
    }
  }, [refreshCommandes]);

  // Séparer commandes visibles et masquées
  const visibleOrders = commandes?.filter((order) => !order.masquee) || [];
  const hiddenOrders = commandes?.filter((order) => order.masquee) || [];

  return (
    <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Mes commandes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Consultez l'historique de vos commandes et leur statut.
          </p>
        </div>

        {/* Toggle pour afficher/masquer les commandes masquées */}
        {hiddenOrders.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowHidden(!showHidden)}
            className="px-3 py-1.5 text-xs font-semibold text-muted-foreground border-border-warm hover:bg-background-warm hover:text-foreground rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            {showHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showHidden ? "Cacher" : "Afficher"} masquées ({hiddenOrders.length})
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {
          loading ? (
            <p className="text-muted-foreground text-center">Chargement des commandes...</p>
          ) :
          visibleOrders.length > 0 || (showHidden && hiddenOrders.length > 0) ? (
            <>
              {/* Commandes visibles */}
              {visibleOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={handleCancelOrder}
                  onHide={handleHideOrder}
                  onDelete={handleDeleteOrder}
                  isHidden={false}
                  onRestore={handleRestoreOrder}
                />
              ))}

              {/* Section des commandes masquées */}
              {showHidden && hiddenOrders.length > 0 && (
                <>
                  <div className="flex items-center gap-3 pt-4">
                    <div className="h-px flex-1 bg-border-warm/50" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Commandes masquées
                    </span>
                    <div className="h-px flex-1 bg-border-warm/50" />
                  </div>
                  {hiddenOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onCancel={handleCancelOrder}
                      onHide={handleHideOrder}
                      onDelete={handleDeleteOrder}
                      isHidden={true}
                      onRestore={handleRestoreOrder}
                    />
                  ))}
                </>
              )}
            </>
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
