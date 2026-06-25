import { ChefHat, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { getTopChefs } from "../../services/profileService";

/* ── Skeleton card pendant le chargement ─────────────────────────── */
function SkeletonChefCard() {
  return (
    <div className="bg-[#FFF8F2] rounded-2xl p-6 flex flex-col h-full animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="space-y-1">
          <div className="h-6 bg-gray-200 rounded w-10" />
          <div className="h-3 bg-gray-200 rounded w-8" />
        </div>
        <div className="space-y-1">
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

/* ── Card individuelle chef ──────────────────────────────────────── */
function ChefCard({ chef }) {
  const initials = chef.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-[#FFF8F2] rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col h-full">
      {/* En-tête : avatar + infos */}
      <div className="flex items-start gap-4 mb-4 shrink-0">
        {chef.avatar ? (
          <img
            src={chef.avatar}
            alt={chef.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0">
            <span className="text-primary font-semibold text-lg">{initials}</span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{chef.name}</h3>
          {chef.specialty && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {chef.specialty}
            </p>
          )}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span className="text-sm font-medium">{chef.rating}</span>
          </div>
        </div>
      </div>

      {/* Stats : plats + commandes */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border shrink-0 mt-auto">
        <div>
          <p className="text-2xl font-semibold text-primary">{chef.dishes}</p>
          <p className="text-xs text-muted-foreground">Plats</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-primary">
            {chef.orders.toLocaleString("fr-FR")}
          </p>
          <p className="text-xs text-muted-foreground">Commandes</p>
        </div>
      </div>
    </div>
  );
}

/* ── Section principale ──────────────────────────────────────────── */
export function TopChefs() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTopChefs(3)
      .then(setChefs)
      .catch((err) => {
        console.error("Erreur chargement top chefs:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <ChefHat className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wide">
              Nos talents
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl mb-4">Chefs les mieux notés</h2>
          <p className="text-lg text-muted-foreground">
            Découvrez nos chefs passionnés et leurs spécialités
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {/* Chargement */}
          {loading &&
            [...Array(3)].map((_, i) => (
              <div key={i} className="w-full md:w-[calc(33.333%-1.5rem)] max-w-95">
                <SkeletonChefCard />
              </div>
            ))}

          {/* Erreur */}
          {!loading && error && (
            <p className="w-full text-center text-muted-foreground">
              Impossible de charger les chefs pour le moment.
            </p>
          )}

          {/* Aucun chef */}
          {!loading && !error && chefs.length === 0 && (
            <p className="w-full text-center text-muted-foreground">
              Aucun chef disponible pour le moment.
            </p>
          )}

          {/* Vrais chefs */}
          {!loading &&
            !error &&
            chefs.map((chef) => (
              <div key={chef.id} className="w-full md:w-[calc(33.333%-1.5rem)] max-w-95">
                <ChefCard chef={chef} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
