import Modal from "../ui/Modal";
import Badge from "../ui/Badge";

export default function SellerDetailModal({ seller, isOpen, onClose, onUpdateStatus }) {
  if (!seller) return null;

  const isActive = seller.status === "active" || seller.status === "verified";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails du vendeur" size="md">
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src={seller.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(seller.name) + "&background=random"}
          alt={seller.name}
          className="w-20 h-20 rounded-full object-cover mb-3"
        />
        <h4 className="text-lg font-bold">{seller.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="primary" className="normal-case tracking-normal">Vendeur</Badge>
          <Badge
            variant={isActive ? "success" : "error"}
            className="normal-case tracking-normal"
          >
            {isActive ? "Actif" : "Suspendu"}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <DetailRow label="Email" value={seller.email || "Non renseigné"} />
        <DetailRow label="Téléphone" value={seller.telephone || "Non renseigné"} />
        <DetailRow label="Localisation" value={seller.localisation || "Non renseignée"} />
        <DetailRow label="Plats" value={String(seller.dishes || 0)} />
        <DetailRow label="Ventes" value={String(seller.orders || 0)} />
        <DetailRow label="Revenus" value={seller.revenue || "0 FCFA"} />
        <DetailRow label="Note" value={seller.rating ? `${seller.rating}/5` : "Non noté"} />
      </div>
    </Modal>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border-warm last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium text-sm text-right">{value}</span>
    </div>
  );
}
