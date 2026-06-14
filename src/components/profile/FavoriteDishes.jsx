import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useUserInfo } from "../../context/UserInfoContext";

export function FavoriteDishes() {
  const { favorites, favoritesLoading: loading } = useUserInfo();

  return (
    <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Mes favoris</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Les plats que vous gardez sous la main pour commander plus vite.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {
          loading ? (
            <p className="col-span-full text-center text-muted-foreground">
              Chargement des plats favoris...
            </p>
          ) : favorites.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-4 rounded-lg border border-border-warm bg-background-warm p-6">
              <p className="col-span-full text-center text-muted-foreground">
                Vous n'avez pas encore ajouté de plats à vos favoris.
              </p>
              <div className="col-span-full flex justify-center">
                <Link
                  to="/plats"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
                >
                  Explorer le catalogue
                </Link>
              </div>
            </div>
          ) :
          favorites.map((dish) => (
            <article
              key={dish.id}
              className="overflow-hidden rounded-xl border border-border-warm bg-white transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-4/3 bg-background-warm">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm">
                  <Heart className="h-5 w-5 fill-current" />
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-foreground">{dish.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Par {dish.chef}
                </p>

                <div className="mt-3 flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="text-sm font-semibold">{dish.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({dish.reviews} avis)
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-xl font-bold text-primary">
                    {dish.price}€
                  </span>
                  <Link
                    to={`/plats/${dish.id}`}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
                  >
                    Commander
                  </Link>
                </div>
              </div>
            </article>
          ))
        }
      </div>
    </section>
  );
}