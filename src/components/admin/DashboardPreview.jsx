import { Star } from "lucide-react";
import Button from "../ui/Button";

export function DashboardPreview({ title, actionLabel, onAction, children }) {
  return (
    <div className="bg-white rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function UserPreviewRow({ user }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm truncate">{user.name}</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {user.type}
          </span>
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {user.email}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-bold text-sm text-primary">{user.spent}</div>
        <div className="text-xs text-muted-foreground">{user.orders} cmd</div>
      </div>
    </div>
  );
}

export function SellerPreviewRow({ seller }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <img
        src={seller.avatar}
        alt={seller.name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate mb-1">{seller.name}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{seller.rating}</span>
          </div>
          <span>•</span>
          <span>{seller.orders} cmd</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-bold text-sm text-primary">{seller.revenue}</div>
      </div>
    </div>
  );
}
