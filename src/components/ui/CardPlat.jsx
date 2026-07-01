import React from "react";
import { LuStar, LuArrowRight, LuHeart } from "react-icons/lu";
import Badge from "./Badge";

/**
 * Reusable CardPlat (Dish Card) component matching Yakalma Design System
 *
 * @param {Object} props
 * @param {string} props.id - Dish identifier
 * @param {string} props.image - URL of the dish image
 * @param {string} props.title - Title/name of the dish
 * @param {string} props.chefName - Name of the preparing chef
 * @param {number} props.rating - Average rating (e.g. 4.8)
 * @param {number} props.reviewsCount - Number of ratings
 * @param {number|string} props.price - Price of the dish
 * @param {string} props.currency - Currency symbol (e.g. 'FCFA')
 * @param {string} props.badgeText - optional badge text ('Nouveau', 'Populaire', etc.)
 * @param {string} props.badgeVariant - variant for badge ('nouveau', 'populaire', etc.)
 * @param {function} props.onOrder - callback function for ordering
 * @param {boolean} props.isFavorite - whether the dish is currently favorited
 * @param {function} props.onToggleFavorite - callback function to toggle favorite
 */
function CardPlat({
  id,
  image,
  title,
  chefName,
  rating = 5.0,
  reviewsCount = 0,
  price,
  currency = "FCFA",
  badgeText,
  badgeVariant = "nouveau",
  onOrder,
  isFavorite = false,
  onToggleFavorite,
}) {
  const handleOrder = (e) => {
    e.stopPropagation();
    if (onOrder) onOrder(id);
  };

  return (
    <div
      onClick={() => onOrder?.(id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOrder?.(id);
        }
      }}
      role="button"
      tabIndex={0}
      className="min-w-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {badgeText && (
          <div className="absolute top-4 left-4">
            <Badge variant={badgeVariant}>{badgeText}</Badge>
          </div>
        )}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(id);
            }}
            className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border ${
              isFavorite
                ? "bg-primary text-white border-primary"
                : "bg-white/85 backdrop-blur-sm text-foreground border-transparent hover:bg-white hover:scale-105"
            }`}
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <LuHeart className={`w-4.5 h-4.5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 p-4 flex flex-col justify-between flex-grow sm:p-5">
        <div>
          {/* Title */}
          <h4 className="font-poppins font-semibold text-lg text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h4>

          {/* Chef info */}
          <p className="font-poppins text-sm text-muted-foreground mb-3">
            <span className="font-medium text-foreground/80">{chefName}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-4">
            <LuStar className="text-warning fill-warning" size={16} />
            <span className="font-poppins font-semibold text-sm text-foreground">
              {rating.toFixed(1)}
            </span>
            <span className="font-poppins text-xs text-muted-foreground">
              ({reviewsCount}+ avis)
            </span>
          </div>
        </div>

        {/* Footer info (Price & CTA) */}
        <div className="flex items-center justify-between gap-3 pt-4 mt-auto">
          <div className="min-w-0">
            <span className="break-words font-poppins font-bold text-xl text-primary sm:text-2xl">
              {price}
            </span>
            <span className="font-poppins text-sm text-primary font-bold ml-0.5">
              {currency}
            </span>
          </div>

          <button
            onClick={handleOrder}
            className="w-10 h-10 rounded-full bg-primary hover:bg-accent flex items-center justify-center text-white transition-all duration-300 shadow-[0_2px_8px_rgba(160,67,10,0.2)] hover:shadow-[0_4px_12px_rgba(160,67,10,0.3)] hover:-translate-y-[1px] active:scale-95 cursor-pointer shrink-0"
            aria-label="Commander"
          >
            <LuArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardPlat;
