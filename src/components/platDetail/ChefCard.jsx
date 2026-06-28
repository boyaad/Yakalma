import { ChefHat, Star } from "lucide-react";

export function ChefCard({ chef }) {
  const initials = chef.name
    ? chef.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CH";

  return (
    <section className="flex items-center gap-4 rounded-xl bg-[#f3e6dc] p-4">
      {chef.avatar ? (
        <img
          src={chef.avatar}
          alt={chef.name}
          className="h-12 w-12 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 font-poppins">
          <span className="text-primary font-semibold text-sm">{initials}</span>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="font-poppins text-base font-semibold text-foreground">
          {chef.name}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {chef.rating} ({chef.reviewsCount || 0} avis)
          </span>
          <span aria-hidden="true">•</span>
          <span className="inline-flex items-center gap-1">
            <ChefHat className="h-3.5 w-3.5" />
            {chef.dishesCount} plats
          </span>
        </div>
      </div>
    </section>
  );
}
