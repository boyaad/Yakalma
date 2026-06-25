import { Star, Quote, UserCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getLatestReviews } from "../../services/reviewService";

const MAX_CHARS = 120;

/* ── Skeleton card pendant le chargement ─────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col h-full animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded mb-4" />
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="flex-grow space-y-2 mb-6">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-2 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

/* ── Card individuelle ───────────────────────────────────────────── */
function TestimonialCard({ testimonial }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = testimonial.text?.length > MAX_CHARS;
  const displayText =
    !isLong || expanded
      ? testimonial.text
      : testimonial.text.slice(0, MAX_CHARS).trimEnd() + "…";

  /* initiales si pas d'avatar */
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <Quote className="w-10 h-10 text-primary/20 mb-4 flex-shrink-0" />

      {/* Étoiles */}
      <div className="flex gap-1 mb-4 flex-shrink-0">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating
                ? "text-warning fill-warning"
                : "text-gray-200 fill-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Texte — zone qui pousse le footer vers le bas */}
      <div className="flex-grow mb-6">
        <p className="text-muted-foreground leading-relaxed">
          "{displayText}"
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs font-medium text-primary hover:underline focus:outline-none"
          >
            {expanded ? "Voir moins" : "Voir plus"}
          </button>
        )}
      </div>

      {/* Footer auteur */}
      <div className="flex items-center gap-3 pt-4 border-t border-border flex-shrink-0">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-semibold text-sm">{initials}</span>
          </div>
        )}
        <div>
          <p className="font-medium">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.date}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Section principale ──────────────────────────────────────────── */
export function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLatestReviews(3)
      .then(setTestimonials)
      .catch((err) => {
        console.error("Erreur chargement avis:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

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

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {/* Chargement */}
          {loading &&
            [...Array(3)].map((_, i) => (
              <div key={i} className="w-full md:w-[calc(33.333%-1.5rem)] max-w-[380px]">
                <SkeletonCard />
              </div>
            ))}

          {/* Erreur */}
          {!loading && error && (
            <p className="w-full text-center text-muted-foreground">
              Impossible de charger les avis pour le moment.
            </p>
          )}

          {/* Aucun avis */}
          {!loading && !error && testimonials.length === 0 && (
            <p className="w-full text-center text-muted-foreground">
              Aucun avis pour le moment. Soyez le premier à partager votre expérience !
            </p>
          )}

          {/* Vrais avis */}
          {!loading &&
            !error &&
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full md:w-[calc(33.333%-1.5rem)] max-w-[380px]">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
