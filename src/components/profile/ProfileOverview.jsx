import { ArrowRight, MapPin, Package, Star } from "lucide-react";
import CardStat from "../ui/CardStat";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export function ProfileOverview({
  addresses,
  favoriteDishes,
  onSectionChange,
  orders,
  stats,
}) {
  const lastOrder = orders[0];
  const mainAddress = addresses[0];
  const favoriteDish = favoriteDishes[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <CardStat 
            key={stat.label} 
            label={stat.label} 
            value={stat.value} 
            icon={stat.icon} 
            badgeText={stat.badge} 
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border-warm bg-white p-5 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Dernière commande</h2>
              <p className="text-sm text-muted-foreground">
                Retrouvez rapidement son état et ses détails.
              </p>
            </div>
            <Button
              type="button"
              variant="link"
              onClick={() => onSectionChange("orders")}
              className="p-0 h-auto font-semibold text-sm"
            >
              Voir tout
            </Button>
          </div>

          <article className="rounded-xl bg-background-warm p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{lastOrder.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {lastOrder.date} • {lastOrder.items} articles
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {lastOrder.summary}
                  </p>
                </div>
              </div>
              <Badge
                variant="success"
                className="normal-case tracking-normal px-3 py-1 font-medium text-sm"
              >
                Livré
              </Badge>
            </div>
          </article>
        </section>

        <section className="rounded-xl border border-border-warm bg-white p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Adresse favorite</h2>
            <MapPin className="h-5 w-5 text-primary" />
          </div>

          <p className="font-semibold text-foreground">{mainAddress.label}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {mainAddress.address}
          </p>
          <Button
            type="button"
            variant="link"
            onClick={() => onSectionChange("addresses")}
            className="mt-5 inline-flex items-center gap-2 p-0 h-auto font-semibold text-sm"
          >
            Gérer mes adresses
            <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      </div>

      <section className="rounded-xl border border-border-warm bg-white p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Plat favori du moment</h2>
            <p className="text-sm text-muted-foreground">
              Votre prochain panier peut commencer ici.
            </p>
          </div>
          <Star className="h-5 w-5 fill-warning text-warning" />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src={favoriteDish.image}
            alt={favoriteDish.name}
            className="h-32 w-full rounded-xl object-cover sm:w-44"
          />
          <div className="flex-1">
            <p className="text-lg font-semibold text-foreground">
              {favoriteDish.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Par {favoriteDish.chef} • {favoriteDish.rating} ({favoriteDish.reviews} avis)
            </p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-2xl font-bold text-primary">
                {favoriteDish.price}€
              </span>
              <Button
                to={`/plats/${favoriteDish.id}`}
                variant="primary"
                className="px-5 py-3"
              >
                Voir le plat
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
