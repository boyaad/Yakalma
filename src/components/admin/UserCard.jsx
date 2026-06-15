import { Ban, CheckCircle, Eye } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { getStatusInfo } from "./adminStatus";

export function UserCard({ user }) {
  const statusInfo = getStatusInfo(user.status);

  return (
    <div className="bg-white rounded-xl p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3 mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-base mb-1 truncate">{user.name}</div>
          <div className="text-xs text-muted-foreground truncate mb-2">
            {user.email}
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-2 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-primary">{user.orders}</div>
          <div className="text-xs text-muted-foreground">Commandes</div>
        </div>
        <div className="text-center p-2 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-primary">{user.spent}</div>
          <div className="text-xs text-muted-foreground">Dépensé</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1 px-3">
          <Eye className="w-3.5 h-3.5" />
          Voir
        </Button>
        {user.status === "active" ? (
          <Button variant="danger" size="sm" className="flex-1 px-3">
            <Ban className="w-3.5 h-3.5" />
            Suspendre
          </Button>
        ) : (
          <Button variant="primary" size="sm" className="flex-1 px-3">
            <CheckCircle className="w-3.5 h-3.5" />
            Activer
          </Button>
        )}
      </div>
    </div>
  );
}
