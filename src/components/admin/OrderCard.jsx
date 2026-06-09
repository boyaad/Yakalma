import { ChefHat, Eye, Users, UtensilsCrossed } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { getStatusInfo } from "./adminStatus";

export function OrderCard({ order }) {
  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="bg-white rounded-xl p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-bold text-base mb-1">{order.id}</div>
          <div className="text-xs text-muted-foreground">{order.date}</div>
        </div>
        <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
      </div>

      <div className="space-y-2 mb-4">
        <InfoRow icon={Users} value={order.customer} strong />
        <InfoRow icon={ChefHat} value={order.seller} />
        <InfoRow icon={UtensilsCrossed} value={order.dish} />
      </div>

      <div className="flex items-center justify-between pt-3">
        <div className="text-2xl font-bold text-primary">{order.total}€</div>
        <Button variant="secondary" size="sm">
          <Eye className="w-3.5 h-3.5" />
          Détails
        </Button>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, value, strong = false }) {
  return (
    <div className="flex items-center gap-2 text-sm p-2 bg-muted/30 rounded-lg">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <span className={`${strong ? "font-medium" : ""} truncate`}>{value}</span>
    </div>
  );
}
