import React from "react";
import { LuMapPin, LuStar, LuUtensils, LuShoppingBag } from "react-icons/lu";

/**
 * Reusable CardVendeur (Chef Card) component matching Yakalma Design System
 * 
 * @param {Object} props
 * @param {string} props.id - Chef/Vendeur identifier
 * @param {string} props.avatar - URL of the chef avatar image
 * @param {string} props.name - Name of the chef
 * @param {string} props.specialty - Chef specialty (e.g. 'Spécialités Sénégalaises')
 * @param {string} props.location - Location of the chef (e.g. 'Dakar, Plateau')
 * @param {number} props.rating - Chef rating (e.g. 4.9)
 * @param {number} props.reviewsCount - Number of ratings received
 * @param {number} props.platsCount - Number of dishes published
 * @param {number} props.ordersCount - Number of completed orders
 * @param {function} props.onClick - callback on card click
 */
function CardVendeur({
  id,
  avatar,
  name,
  specialty,
  location = "Dakar, Sénégal",
  rating = 5.0,
  reviewsCount = 0,
  platsCount = 0,
  ordersCount = 0,
  onClick,
}) {
  return (
    <div
      onClick={() => onClick && onClick(id)}
      className={`bg-white border border-border-warm rounded-2xl p-5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Top half: Avatar and Basic Info in Row */}
      <div className="flex items-center gap-4 mb-4 w-full">
        {/* Circular avatar container */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-primary/10 shadow-inner shrink-0 flex items-center justify-center">
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="text-left flex flex-col gap-0.5">
          {/* Name */}
          <h4 className="font-poppins font-bold text-base text-foreground line-clamp-1">
            {name}
          </h4>

          {/* Specialty */}
          {specialty && (
            <p className="font-poppins text-xs font-semibold text-primary uppercase tracking-wider">
              {specialty}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 text-warning">
            <LuStar size={14} className="fill-warning" />
            <span className="font-poppins font-bold text-xs text-foreground">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom half: Stats */}
      <div className="grid grid-cols-2 gap-4 w-full border-t border-border-warm/60 pt-4 mt-auto">
        <div className="flex flex-col items-start border-r border-border-warm/30 pr-4">
          <span className="font-poppins font-black text-xl text-foreground leading-none mb-1">
            {platsCount}
          </span>
          <span className="font-poppins text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
            Plats
          </span>
        </div>

        <div className="flex flex-col items-start pl-2">
          <span className="font-poppins font-black text-xl text-foreground leading-none mb-1">
            {ordersCount}
          </span>
          <span className="font-poppins text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
            Commandes
          </span>
        </div>
      </div>
    </div>
  );
}

export default CardVendeur;
