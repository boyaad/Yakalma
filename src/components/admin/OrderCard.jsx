import { ChefHat, Eye, Users, UtensilsCrossed } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { getStatusInfo } from "./adminStatus";

export function OrderCard({ order }) {
  const statusInfo = getStatusInfo(order.status);

  return (
    <Card>
      <Card.Header
        title={order.id}
        subtitle={order.date}
        action={<Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>}
      />

      <Card.Content>
        <InfoRow icon={Users} value={order.customer} strong />
        <InfoRow icon={ChefHat} value={order.seller} />
        <InfoRow icon={UtensilsCrossed} value={order.dish} />
      </Card.Content>

      <Card.Footer>
        <div className="text-2xl font-bold text-primary">{order.total} FCFA</div>
        <Button variant="secondary" size="sm">
          <Eye className="w-3.5 h-3.5" />
          Détails
        </Button>
      </Card.Footer>
    </Card>
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
