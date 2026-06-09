import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Marie Dubois",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    text: "Les plats sont délicieux et authentiques ! Je commande au moins 2 fois par semaine. L'application est facile à utiliser.",
    date: "Il y a 2 jours",
  },
  {
    id: 2,
    name: "Ahmed Benali",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 5,
    text: "Enfin une plateforme qui met en avant les vrais chefs ! La qualité est au rendez-vous à chaque commande.",
    date: "Il y a 1 semaine",
  },
  {
    id: 3,
    name: "Sophie Martin",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    text: "Service impeccable, livraison rapide et plats savoureux. Je recommande vivement Yakalma !",
    date: "Il y a 2 semaines",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-lg text-muted-foreground">
            Rejoignez des milliers de gourmets satisfaits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-10 h-10 text-primary/20 mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-500 fill-amber-500"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
