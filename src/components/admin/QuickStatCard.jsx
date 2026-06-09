export function QuickStatCard({ item }) {
  return (
    <div className={`rounded-xl p-4 ${item.className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/70 rounded-lg flex items-center justify-center">
          <item.icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-bold">{item.value}</div>
          <div className="text-xs opacity-80">{item.label}</div>
        </div>
      </div>
    </div>
  );
}
