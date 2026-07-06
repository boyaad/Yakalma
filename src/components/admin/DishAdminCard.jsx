import { ArrowUpRight } from "lucide-react";
import Badge from "../ui/Badge";
import { getStatusInfo } from "./adminStatus";

export function DishAdminCard({ dish }) {
  const statusInfo = getStatusInfo(dish.status);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-border-warm hover:shadow-md transition-all group">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={dish.image || "https://placehold.co/400x300?text=Plat"}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <Badge variant={statusInfo.variant} className="text-[10px] px-2 py-0.5">
            {statusInfo.text}
          </Badge>
        </div>
      </div>
      <div className="p-3 space-y-1">
        <h4 className="font-semibold text-sm leading-tight truncate">{dish.name}</h4>
        <p className="text-xs text-muted-foreground truncate">{dish.chef}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-sm text-primary">{dish.price} FCFA</span>
          <a
            href={`/plats/${dish.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-primary hover:bg-accent flex items-center justify-center text-white transition-all"
            title="Voir le plat"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
