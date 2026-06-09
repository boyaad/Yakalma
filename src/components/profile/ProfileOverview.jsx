import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Package, Star } from "lucide-react";
import { ProfileStatCard } from "./ProfileStatCard";

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
          <ProfileStatCard key={stat.label} stat={stat} />
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
            <button
              type="button"
              onClick={() => onSectionChange("orders")}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Voir tout
            </button>
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
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                Livré
              </span>
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
          <button
            type="button"
            onClick={() => onSectionChange("addresses")}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Gérer mes adresses
            <ArrowRight className="h-4 w-4" />
          </button>
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
              <Link
                to={`/plats/${favoriteDish.id}`}
                className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-accent"
              >
                Voir le plat
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
