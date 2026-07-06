import { Star } from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

export function DashboardPreview({ title, actionLabel, onAction, children }) {
  return (
    <div className="min-w-0 rounded-xl bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
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
    <div className="flex min-w-0 flex-col gap-3 rounded-lg bg-muted/30 p-3 min-[420px]:flex-row min-[420px]:items-center">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-sm truncate">{user.name}</span>
          <Badge
            variant="primary"
            className="px-2 py-0.5 normal-case tracking-normal"
          >
            {user.type}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {user.email}
        </div>
      </div>
      <div className="shrink-0 text-left min-[420px]:text-right">
        <div className="break-words font-bold text-sm text-primary">{user.spent}</div>
        <div className="text-xs text-muted-foreground">{user.orders} cmd</div>
      </div>
    </div>
  );
}

export function SellerPreviewRow({ seller }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg bg-muted/30 p-3 min-[420px]:flex-row min-[420px]:items-center">
      <img
        src={seller.avatar}
        alt={seller.name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate mb-1">{seller.name}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-warning fill-warning" />
            <span>{seller.rating}</span>
          </div>
          <span>•</span>
          <span>{seller.orders} cmd</span>
        </div>
      </div>
      <div className="shrink-0 text-left min-[420px]:text-right">
        <div className="break-words font-bold text-sm text-primary">{seller.revenue}</div>
      </div>
    </div>
  );
}
