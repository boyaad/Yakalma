const statusLabels = {
  delivered: { text: "Livré", color: "bg-green-100 text-green-800" },
  pending: { text: "En cours", color: "bg-amber-100 text-amber-800" },
  cancelled: { text: "Annulé", color: "bg-red-100 text-red-800" },
};

function OrderCard({ order }) {
  const statusInfo = statusLabels[order.status] || statusLabels.delivered;

  return (
    <article className="rounded-xl bg-background-warm p-4 transition-all hover:shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{order.id}</p>
          <p className="text-sm text-muted-foreground">
            {order.date} • {order.items} articles
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{order.summary}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm ${statusInfo.color}`}>
          {statusInfo.text}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-primary">{order.total}€</span>
        <button type="button" className="text-sm text-primary hover:underline">
          Voir les détails
        </button>
      </div>
    </article>
  );
}

export function OrderHistory({ orders }) {
  return (
    <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Mes commandes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Consultez l'historique de vos commandes et leur statut.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
}
