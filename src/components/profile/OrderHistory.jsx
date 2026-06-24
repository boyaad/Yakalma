import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Link } from "react-router-dom";
import { useUserInfo } from "../../context/UserInfoContext";

const statusLabels = {
  delivered: { text: "Livré", color: "bg-success/10 text-success" },
  pending: { text: "En cours", color: "bg-warning/10 text-warning" },
  cancelled: { text: "Annulé", color: "bg-error/10 text-error" },
};

function OrderCard({ order }) {
  const statusInfo = statusLabels[order.status] || statusLabels.delivered;
  
  const getBadgeVariant = (status) => {
    if (status === "delivered") return "success";
    if (status === "cancelled") return "danger";
    return "pending";
  };

  return (
    <article className="rounded-xl bg-background-warm p-4 transition-all hover:shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{order.id}</p>
          <p className="text-sm text-muted-foreground">
            {order.date} • {order.items} articles
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{order.summary || "Voir les détails"}</p>
        </div>
        <Badge
          variant={getBadgeVariant(order.order_status)}
          className="normal-case tracking-normal text-sm font-normal px-3 py-1"
        >
          {statusInfo.text}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-primary">{order.total}€</span>
        <Button variant="link" className="p-0 h-auto font-normal text-sm">
          Voir les détails
        </Button>
      </div>
    </article>
  );
}

export function OrderHistory() {
  const { commandes, commandesLoading: loading } = useUserInfo();

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
          commandes.length > 0 ? (
            commandes.map((order) => (
              <OrderCard key={order.id} order={order} />
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
