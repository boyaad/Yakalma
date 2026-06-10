import { UtensilsCrossed } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";

export function OrderCard({ order, statusInfo }) {
  return (
    <Card>
      <Card.Header
        title={order.id}
        subtitle={order.time}
        action={
          <Badge
            variant={order.status}
            className="normal-case tracking-normal px-2.5 py-1 font-medium"
          >
            {statusInfo.text}
          </Badge>
        }
      />

      <Card.Content>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-semibold text-xs">
              {order.customer.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{order.customer}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm p-2 bg-muted/30 rounded-lg">
          <UtensilsCrossed className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{order.dish}</div>
            <div className="text-xs text-muted-foreground">
              Quantité: {order.quantity}
            </div>
          </div>
        </div>
      </Card.Content>

      <Card.Footer>
        <div className="text-2xl font-bold text-primary">{order.total}€</div>
        <Button variant="ghost" className="bg-muted/70 hover:bg-muted active:bg-primary active:text-white px-4 py-2">
          Gérer
        </Button>
      </Card.Footer>
    </Card>
  );
}
