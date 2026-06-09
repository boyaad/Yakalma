import { ChefHat, Star } from "lucide-react";

const topChefs = [
  {
    id: 1,
    name: "Fatima K.",
    specialty: "Cuisine marocaine",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    rating: 4.9,
    dishes: 24,
    orders: 1240,
  },
  {
    id: 2,
    name: "Rachid M.",
    specialty: "Tajines traditionnels",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    rating: 4.8,
    dishes: 18,
    orders: 980,
  },
  {
    id: 3,
    name: "Samira B.",
    specialty: "Pâtisserie orientale",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    rating: 5.0,
    dishes: 31,
    orders: 1520,
  },
];

export function TopChefs() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {topChefs.map((chef) => (
            <div
              key={chef.id}
              className="bg-[#FFF8F2]  rounded-2xl p-6 border[rgba(160, 67, 10, 0.15);] hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={chef.avatar}
                  alt={chef.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{chef.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {chef.specialty}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium">{chef.rating}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-semibold text-primary">
                    {chef.dishes}
                  </p>
                  <p className="text-xs text-muted-foreground">Plats</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-primary">
                    {chef.orders}
                  </p>
                  <p className="text-xs text-muted-foreground">Commandes</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
