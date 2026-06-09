export function ProfileStatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <article className="rounded-xl border border-border-warm bg-white p-4 transition-all hover:shadow-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {stat.badge && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {stat.badge}
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{stat.label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
    </article>
  );
}
