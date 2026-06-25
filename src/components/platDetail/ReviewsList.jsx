import { useState } from "react";
import { Star, MessageSquarePlus, Send, Loader2 } from "lucide-react";
import { RatingStars } from "./RatingStars";

function ReviewForm({ onSubmit, submitting }) {
  const [note, setNote] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [commentaire, setCommentaire] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (note === 0 || submitting) return;

    // Attendre le résultat de la soumission avant de réinitialiser
    const success = await onSubmit(note, commentaire);

    if (success) {
      setNote(0);
      setHoveredStar(0);
      setCommentaire("");
    }
    // En cas d'erreur, le formulaire garde les valeurs saisies
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Sélecteur d'étoiles interactif */}
      <div>
        <label className="mb-2 block font-poppins text-sm font-medium text-foreground">
          Votre note
        </label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= (hoveredStar || note);

            return (
              <button
                key={index}
                type="button"
                disabled={submitting}
                onClick={() => setNote(starValue)}
                onMouseEnter={() => setHoveredStar(starValue)}
                onMouseLeave={() => setHoveredStar(0)}
                className="rounded-sm p-0.5 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:pointer-events-none"
                aria-label={`${starValue} étoile${starValue > 1 ? "s" : ""}`}
              >
                <Star
                  className={`h-7 w-7 transition-colors ${
                    isFilled
                      ? "fill-warning text-warning"
                      : "text-muted-foreground/40 hover:text-warning/60"
                  }`}
                />
              </button>
            );
          })}
          {note > 0 && (
            <span className="ml-2 text-sm font-medium text-foreground">
              {note}/5
            </span>
          )}
        </div>
        {note === 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            Cliquez sur les étoiles pour noter
          </p>
        )}
      </div>

      {/* Textarea commentaire */}
      <div>
        <label
          htmlFor="review-comment"
          className="mb-2 block font-poppins text-sm font-medium text-foreground"
        >
          Votre commentaire{" "}
          <span className="font-normal text-muted-foreground">
            (optionnel)
          </span>
        </label>
        <textarea
          id="review-comment"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Partagez votre expérience avec ce plat..."
          rows={3}
          maxLength={500}
          disabled={submitting}
          className="w-full resize-none rounded-xl border border-border-warm bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {commentaire.length}/500
        </p>
      </div>

      {/* Bouton soumettre */}
      <button
        type="submit"
        disabled={note === 0 || submitting}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-poppins text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Publication...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Publier mon avis
          </>
        )}
      </button>
    </form>
  );
}

export function ReviewsList({
  reviews,
  totalReviews,
  averageRating = 0,
  reviewsLoading = false,
  isLoggedIn = false,
  onSubmitReview,
  submittingReview = false,
}) {
  const [showForm, setShowForm] = useState(false);

  // Wrapper async : attend le résultat, ferme le formulaire uniquement si succès
  const handleFormSubmit = async (note, commentaire) => {
    const success = await onSubmitReview(note, commentaire);
    if (success) {
      setShowForm(false);
    }
    return success;
  };

  return (
    <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
      {/* En-tête avec note moyenne et bouton "Laisser un avis" */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-poppins text-2xl font-semibold text-foreground">
            Avis clients ({totalReviews})
          </h2>
          {totalReviews > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-1.5">
              <Star className="h-5 w-5 fill-warning text-warning" />
              <span className="font-poppins text-lg font-bold text-foreground">
                {averageRating}
              </span>
              <span className="text-sm text-muted-foreground">/5</span>
            </div>
          )}
        </div>

        {isLoggedIn && (
          <button
            onClick={() => setShowForm((prev) => !prev)}
            disabled={submittingReview}
            className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 font-poppins text-sm font-medium text-primary transition-all hover:bg-primary/10 hover:border-primary/40 disabled:opacity-50 disabled:pointer-events-none"
          >
            <MessageSquarePlus className="h-4 w-4" />
            {showForm ? "Annuler" : "Laisser un avis"}
          </button>
        )}
      </div>

      {/* Formulaire d'avis (conditionnel) */}
      {isLoggedIn && showForm && (
        <div className="mb-8 rounded-xl border border-border-warm bg-background-warm/50 p-5">
          <h3 className="mb-4 font-poppins text-lg font-semibold text-foreground">
            Partagez votre avis
          </h3>
          <ReviewForm
            onSubmit={handleFormSubmit}
            submitting={submittingReview}
          />
        </div>
      )}

      {/* Liste des avis */}
      {reviewsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Chargement des avis...
          </span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center">
          <MessageSquarePlus className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="font-poppins text-lg font-medium text-muted-foreground">
            Aucun avis pour le moment
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Soyez le premier à partager votre expérience !
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border-warm">
          {reviews.map((review) => (
            <article key={review.id} className="py-6 first:pt-0 last:pb-0">
              <div className="mb-2 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-poppins text-sm font-bold text-primary">
                      {review.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <h3 className="font-poppins font-semibold text-foreground">
                    {review.author}
                  </h3>
                </div>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {review.date}
                </span>
              </div>

              <RatingStars rating={review.rating} />

              {review.comment && (
                <p className="mt-2 leading-7 text-muted-foreground">
                  {review.comment}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
