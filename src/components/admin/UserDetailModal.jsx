import Modal from "../ui/Modal";
import Badge from "../ui/Badge";

function formatDate(value) {
  if (!value) return "Date inconnue";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function UserDetailModal({ user, isOpen, onClose }) {
  if (!user) return null;

  const roleLabel = (role) => {
    if (role === "vendeur") return "Chef";
    if (role === "admin") return "Admin";
    return "Client";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails de l'utilisateur" size="md">
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src={user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.nom_complet || "U") + "&background=random"}
          alt={user.nom_complet}
          className="w-20 h-20 rounded-full object-cover mb-3"
        />
        <h4 className="text-lg font-bold">{user.nom_complet}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Badge
            variant={user.role === "vendeur" ? "primary" : "muted"}
            className="normal-case tracking-normal"
          >
            {roleLabel(user.role)}
          </Badge>
          <Badge
            variant={user.status === "active" ? "success" : "error"}
            className="normal-case tracking-normal"
          >
            {user.status === "active" ? "Actif" : "Suspendu"}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <DetailRow label="Téléphone" value={user.telephone || "Non renseigné"} />
        <DetailRow label="Localisation" value={user.localisation || "Non renseignée"} />
        <DetailRow label="Membre depuis" value={user.created_at ? formatDate(user.created_at) : "Date inconnue"} />
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
