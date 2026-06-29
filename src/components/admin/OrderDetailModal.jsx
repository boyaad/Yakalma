import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import { getStatusInfo } from "./adminStatus";

export default function OrderDetailModal({ order, isOpen, onClose }) {
  if (!order) return null;

  const statusInfo = getStatusInfo(order.status);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Détails de la commande ${order.id}`} size="xl">
      <div className="space-y-6">
        <Section title="Informations commande">
          <div className="grid grid-cols-2 gap-4">
            <DetailRow label="ID" value={order.id} mono />
            <DetailRow label="Date" value={order.date} />
            <DetailRow label="Statut">
              <Badge variant={statusInfo.variant} className="normal-case tracking-normal">
                {statusInfo.text}
              </Badge>
            </DetailRow>
            <DetailRow label="Total" value={`${order.total.toLocaleString()} FCFA`} />
          </div>
        </Section>

        <Section title="Acheteur">
          <div className="grid grid-cols-2 gap-4">
            <DetailRow label="Nom" value={order.customer} />
            <DetailRow label="Téléphone" value={order.customerPhone || "Non renseigné"} />
            <DetailRow label="Localisation" value={order.customerLocation || "Non renseignée"} colSpan />
          </div>
        </Section>

        <Section title="Vendeur">
          <div className="grid grid-cols-2 gap-4">
            <DetailRow label="Nom" value={order.seller} />
            <DetailRow label="Téléphone" value={order.sellerPhone || "Non renseigné"} />
            <DetailRow label="Localisation" value={order.sellerLocation || "Non renseignée"} colSpan />
          </div>
        </Section>

        <Section title="Plats commandés">
          {order.ligne_commandes && order.ligne_commandes.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-warm">
                  <th className="text-left py-2 font-semibold text-muted-foreground">Plat</th>
                  <th className="text-center py-2 font-semibold text-muted-foreground">Qté</th>
                  <th className="text-right py-2 font-semibold text-muted-foreground">Prix unitaire</th>
                  <th className="text-right py-2 font-semibold text-muted-foreground">Sous-total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm">
                {order.ligne_commandes.map((line) => (
                  <tr key={line.id}>
                    <td className="py-2 font-medium">{line.plats?.titre || "Plat"}</td>
                    <td className="py-2 text-center">{line.quantite}</td>
                    <td className="py-2 text-right">{Number(line.plats?.prix || 0).toLocaleString()} FCFA</td>
                    <td className="py-2 text-right font-medium">{Number(line.sous_total || 0).toLocaleString()} FCFA</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border-warm font-semibold">
                  <td className="py-2" colSpan={3}>Total</td>
                  <td className="py-2 text-right">{order.total.toLocaleString()} FCFA</td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <p className="text-muted-foreground">Aucun détail de plat disponible.</p>
          )}
        </Section>
      </div>
    </Modal>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="font-semibold text-base mb-3 text-foreground">{title}</h4>
      {children}
    </div>
  );
}

function DetailRow({ label, value, children, mono = false, colSpan = false }) {
  return (
    <div className={`flex items-center gap-2 ${colSpan ? "col-span-2" : ""}`}>
      <span className="text-muted-foreground text-sm min-w-[100px]">{label}</span>
      {children || <span className={`font-medium text-sm ${mono ? "font-mono text-primary" : ""}`}>{value}</span>}
    </div>
  );
}
