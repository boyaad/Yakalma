import { CheckCircle, Eye, Star } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { getStatusInfo } from "./adminStatus";

export function SellerAdminCard({ seller }) {
  const statusInfo = getStatusInfo(seller.status);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-3 mb-5">
        <img
          src={seller.avatar}
          alt={seller.name}
          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
        />

        <div className="min-w-0">
          <h3 className="text-base font-bold leading-tight truncate">
            {seller.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-sm">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="font-semibold">{seller.rating}</span>
            <span className="text-muted-foreground">({seller.orders})</span>
          </div>
          <div className="mt-2">
            <Badge
              variant={statusInfo.variant}
              className="normal-case tracking-normal"
            >
              {statusInfo.text}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <SellerStat value={seller.dishes} label="Plats" />
        <SellerStat value={seller.orders} label="Ventes" />
        <SellerStat value={seller.revenue} label="Revenus" />
      </div>

      <div className="flex gap-2">
        <Button
          variant="white"
          size="sm"
          className="flex-1 h-10 px-3 bg-[#f2e5d9] text-foreground shadow-none hover:bg-[#ead8c9] hover:translate-y-0"
        >
          <Eye className="w-3.5 h-3.5" />
          Voir
        </Button>
        <Button variant="primary" size="sm" className="flex-1 h-10 px-3">
          {seller.status === "pending" && (
            <CheckCircle className="w-3.5 h-3.5" />
          )}
          {seller.status === "pending" ? "Valider" : "Gérer"}
        </Button>
      </div>
    </div>
  );
}

function SellerStat({ value, label }) {
  return (
    <div className="rounded-xl bg-[#fbf6f2] px-2 py-3 text-center">
      <div className="text-base font-bold text-primary leading-tight">
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
