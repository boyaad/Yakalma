import CardPlat from "../ui/CardPlat";
import { getStatusInfo } from "./adminStatus";

export function DishAdminCard({ dish }) {
  const statusInfo = getStatusInfo(dish.status);

  return (
    <div>
      <CardPlat
        id={dish.id}
        image={dish.image}
        title={dish.name}
        chefName={dish.chef}
        rating={dish.rating || 0}
        reviewsCount={dish.orders}
        price={dish.price}
        currency="€"
        badgeText={statusInfo.text}
        badgeVariant={statusInfo.variant}
      />
    </div>
  );
}
