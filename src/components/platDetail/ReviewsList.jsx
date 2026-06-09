import { RatingStars } from "./RatingStars";

export function ReviewsList({ reviews, totalReviews }) {
  return (
    <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
      <h2 className="mb-6 font-poppins text-2xl font-semibold text-foreground">
        Avis clients ({totalReviews})
      </h2>

      <div className="divide-y divide-border-warm">
        {reviews.map((review) => (
          <article key={review.id} className="py-6 first:pt-0 last:pb-0">
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className="font-poppins font-semibold text-foreground">
                {review.author}
              </h3>
              <span className="shrink-0 text-sm text-muted-foreground">
                {review.date}
              </span>
            </div>

            <RatingStars rating={review.rating} />

            <p className="mt-2 leading-7 text-muted-foreground">
              {review.comment}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
