export function DishMetaCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#f3e6dc] p-4">
      <Icon className="h-5 w-5 shrink-0 text-primary" />

      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-poppins font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
