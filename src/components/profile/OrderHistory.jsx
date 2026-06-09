const statusLabels = {
  delivered: { text: "Livré", color: "bg-green-100 text-green-800" },
  pending: { text: "En cours", color: "bg-amber-100 text-amber-800" },
  cancelled: { text: "Annulé", color: "bg-red-100 text-red-800" },
};

function OrderCard({ order }) {
  const statusInfo = statusLabels[order.status] || statusLabels.delivered;

  return (
    <article className="p-4 rounded-xl bg-muted/40 transition-colors hover:bg-muted">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="font-medium">{order.id}</p>
          <p className="text-sm text-muted-foreground">
            {order.date} • {order.items} articles
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
          {statusInfo.text}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="text-primary font-medium">{order.total}€</span>
        <button type="button" className="text-sm text-primary hover:underline">
          Voir les détails
        </button>
      </div>
    </article>
  );
}

export function OrderHistory({ orders }) {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 border border-border-warm">
      <h2 className="text-2xl font-semibold mb-8">Mes commandes</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
}
