import { ArrowUp } from "lucide-react";

export function StatCard({ stat }) {
  return (
    <div className="bg-white rounded-xl p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}
        >
          <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
          <ArrowUp className="w-3 h-3" />
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
