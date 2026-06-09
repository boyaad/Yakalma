import {
  Star,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  ArrowUp,
} from "lucide-react";

export function StatCard({ stat }) {
  const iconColor = stat.trend === "up" ? "bg-primary/10" : "bg-red-100";
  const arrowColor = stat.trend === "up" ? "text-primary" : "text-red-600";
  const badgeBg = stat.trend === "up" ? "bg-primary/10" : "bg-orange-100";
  const badgeColor = stat.trend === "up" ? "text-primary" : "text-orange-700";

  return (
    <div className="bg-white rounded-xl p-4 border border-border-warm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}
        >
          <stat.icon className={`w-5 h-5 ${arrowColor}`} />
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${badgeBg} ${badgeColor}`}
        >
          <ArrowUp
            className={`w-3 h-3 ${stat.trend !== "up" && "rotate-180"}`}
          />
          {stat.change}
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{stat.value}</div>
      <div className="text-xs font-medium text-muted-foreground">
        {stat.label}
      </div>
    </div>
  );
}
