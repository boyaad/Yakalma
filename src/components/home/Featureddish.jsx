import { Link } from "react-router-dom";
import { ArrowRight, Star, TrendingUp } from "lucide-react";

const featuredDishes = [
  {
    id: 1,
    name: "Couscous Royal",
    chef: "Fatima K.",
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=900&q=80",
    price: 15,
    rating: 4.8,
    reviews: 127,
    deliveryTime: "30-45 min",
    badge: "Populaire",
  },
  {
    id: 2,
    name: "Tajine Poulet Citron",
    chef: "Rachid M.",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=80",
    price: 12,
    rating: 4.9,
    reviews: 89,
    deliveryTime: "25-40 min",
    badge: "Nouveau",
  },
  {
    id: 3,
    name: "Pastilla au Poulet",
    chef: "Samira B.",
    image:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=900&q=80",
    price: 18,
    rating: 5.0,
    reviews: 64,
    deliveryTime: "35-50 min",
  },
  {
    id: 4,
    name: "Mezze Libanais",
    chef: "Ali R.",
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=900&q=80",
    price: 14,
    rating: 4.7,
    reviews: 52,
    deliveryTime: "20-35 min",
  },
];

function FeaturedDishCard({ dish }) {
  return (
    <Link
      to={`/plats/${dish.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(0,0,0,0.14)]"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={dish.image}
          alt={dish.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {dish.badge && (
          <span className="absolute left-5 top-5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm">
            {dish.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
          {dish.name}
        </h3>

        <p className="mb-4 text-base text-muted-foreground">Par {dish.chef}</p>

        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
          <span className="font-semibold text-foreground">{dish.rating}</span>
          <span>({dish.reviews})</span>
          <span aria-hidden="true">•</span>
          <span>{dish.deliveryTime}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <span className="text-xl font-bold text-primary">{dish.price}€</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-foreground transition-colors group-hover:bg-primary group-hover:text-white">
            <ArrowRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedDishes() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wide">
                Populaires
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl">Plats les plus commandés</h2>
          </div>

          <Link
            to="/plats"
            className="hidden sm:flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {featuredDishes.map((dish) => (
            <FeaturedDishCard key={dish.id} dish={dish} />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            to="/plats"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <span>Voir tous les plats</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
