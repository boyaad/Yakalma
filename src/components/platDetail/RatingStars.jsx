import { Star } from "lucide-react";

export function RatingStars({ rating, size = "sm", showEmpty = true }) {
  const iconClassName = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const isFilled = index < Math.round(rating);

        if (!showEmpty && !isFilled) {
          return null;
        }

        return (
          <Star
            key={index}
            className={`${iconClassName} ${
              isFilled
                ? "fill-warning text-warning"
                : "text-muted-foreground"
            }`}
          />
        );
      })}
    </div>
  );
}
