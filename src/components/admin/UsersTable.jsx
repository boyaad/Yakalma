import { Eye, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import Badge from "../ui/Badge";

export default function UsersTable({ users, onView, onToggleStatus, actionLoading }) {
  const roleLabel = (role) => {
    if (role === "vendeur") return "Chef";
    if (role === "admin") return "Admin";
    return "Client";
  };

  return (
    <div className="bg-white rounded-xl border border-border-warm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-warm bg-muted/30">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Utilisateur</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Rôle</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Statut</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-warm">
            {users.map((user) => (
              <tr key={user.user_id || user.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.nom_complet || "U") + "&background=random"}
                      alt={user.nom_complet}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="font-semibold truncate max-w-[200px]">{user.nom_complet}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={user.role === "vendeur" ? "primary" : "muted"}
                    className="normal-case tracking-normal text-xs"
                  >
                    {roleLabel(user.role)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={user.status === "active" ? "success" : "error"}
                    className="normal-case tracking-normal text-xs"
                  >
                    {user.status === "active" ? "Actif" : "Suspendu"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(user)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(user)}
                      disabled={actionLoading}
                      className={`p-2 rounded-lg transition-colors ${
                        user.status === "active"
                          ? "text-error hover:bg-error/5 hover:text-error"
                          : "text-success hover:bg-success/5 hover:text-success"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={user.status === "active" ? "Désactiver" : "Activer"}
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : user.status === "active" ? (
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
      {users.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">Aucun utilisateur trouvé.</div>
      )}
    </div>
  );
}
