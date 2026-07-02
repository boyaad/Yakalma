import { ArrowRight, MapPin, Package, Star } from "lucide-react";
import CardStat from "../ui/CardStat";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

const statusLabels = {
  en_attente: {
    text: "En attente",
    color: "bg-warning/15 text-warning",
    variant: "pending",
  },
  en_cours: {
    text: "En préparation",
    color: "bg-info/15 text-info",
    variant: "pending",
  },
  pret: {
    text: "Prêt",
    color: "bg-success/15 text-success",
    variant: "success",
  },
  livre: {
    text: "Livré",
    color: "bg-success/15 text-success",
    variant: "success",
  },
  annulee: {
    text: "Annulé",
    color: "bg-error/15 text-error",
    variant: "danger",
  },

  pending: {
    text: "En attente",
    color: "bg-warning/15 text-warning",
    variant: "pending",
  },
  preparing: {
    text: "En préparation",
    color: "bg-info/15 text-info",
    variant: "pending",
  },
  ready: {
    text: "Prêt",
    color: "bg-success/15 text-success",
    variant: "success",
  },
  delivered: {
    text: "Livré",
    color: "bg-success/15 text-success",
    variant: "success",
  },
  cancelled: {
    text: "Annulé",
    color: "bg-error/15 text-error",
    variant: "danger",
  },
};

export function ProfileOverview({
  addresses,
  favoriteDishes,
  onSectionChange,
  orders,
  stats,
}) {
  const lastOrder = orders && orders.length > 0 ? orders[0] : null;
  const mainAddress =
    addresses && addresses.length > 0
      ? addresses.find((a) => a.isDefault) || addresses[0]
      : null;
  const favoriteDish =
    favoriteDishes && favoriteDishes.length > 0 ? favoriteDishes[0] : null;

  return (
    <div className="space-y-6 font-poppins">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
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
        {/* Dernière Commande */}
        <section className="rounded-2xl border border-border-warm bg-white p-4 shadow-sm flex flex-col justify-between sm:p-6 lg:col-span-2">
          <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Dernière commande
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
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

            {lastOrder ? (
              <article className="rounded-xl bg-background-warm p-5 border border-border-warm/50">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm sm:text-base">
                        Commande #{lastOrder.id.slice(0, 8)}...
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {lastOrder.date} • {lastOrder.items} articles
                      </p>
                      <p className="mt-2 text-xs sm:text-sm text-foreground/80 leading-relaxed font-medium">
                        {lastOrder.summary}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      statusLabels[lastOrder.order_status]?.variant || "pending"
                    }
                    className="normal-case tracking-normal px-2.5 py-1 font-semibold text-xs sm:text-sm rounded-lg"
                  >
                    {statusLabels[lastOrder.order_status]?.text || "En attente"}
                  </Badge>
                </div>
              </article>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border-warm rounded-xl">
                Aucune commande passée pour le moment.
              </div>
            )}
          </div>

          {!lastOrder && (
            <div className="mt-4 flex justify-center">
              <Link
                to="/plats"
                className="inline-flex px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent text-sm font-semibold transition-colors"
              >
                Commander maintenant
              </Link>
            </div>
          )}
        </section>

        {/* Adresse Favorite */}
        <section className="rounded-2xl border border-border-warm bg-white p-4 shadow-sm flex flex-col justify-between sm:p-6">
          <div>
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-foreground">
                Adresse favorite
              </h2>
              <MapPin className="h-5 w-5 text-primary" />
            </div>

            {mainAddress ? (
              <div className="p-4 bg-background-warm rounded-xl border border-border-warm/50">
                <p className="font-bold text-foreground text-sm sm:text-base">
                  {mainAddress.label}
                </p>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {mainAddress.localisation}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border-warm rounded-xl">
                Aucune adresse enregistrée.
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="link"
            onClick={() => onSectionChange("addresses")}
            className="mt-5 inline-flex items-center gap-2 p-0 h-auto font-semibold text-sm self-start text-primary hover:text-accent"
          >
            Gérer mes adresses
            <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      </div>

      {/* Plat Favori */}
      <section className="rounded-2xl border border-border-warm bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Plat favori du moment
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Votre prochain panier peut commencer ici.
            </p>
          </div>
          <Star className="h-5 w-5 fill-warning text-warning" />
        </div>

        {favoriteDish ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src={favoriteDish.image}
              alt={favoriteDish.name}
              className="h-32 w-full rounded-xl object-cover sm:w-44 border border-border-warm"
            />
            <div className="flex-1">
              <p className="text-lg font-bold text-foreground">
                {favoriteDish.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Par {favoriteDish.chef || "Chef inconnu"}
              </p>
              <div className="mt-4 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                <span className="text-2xl font-bold text-primary">
                  {Number(favoriteDish.price).toFixed(0)} FCFA
                </span>
                <Button
                  to={`/plats/${favoriteDish.id}`}
                  variant="primary"
                  className="w-full px-5 py-2.5 rounded-lg font-semibold min-[420px]:w-auto"
                >
                  Voir le plat
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border-warm rounded-xl">
            Vous n'avez pas encore de plats favoris. Cliquez sur le cœur ❤️ sur
            la fiche d'un plat pour l'ajouter.
          </div>
        )}
      </section>
    </div>
  );
}
