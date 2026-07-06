import React from "react";
import { ArrowUp } from "lucide-react";
import Badge from "./Badge";
import { useCountUp } from "../../hooks/useCountUp";

/**
 * Reusable CardStat component matching Yakalma Design System
 * 
 * @param {Object} props
 * @param {string} props.label - Stat label
 * @param {string|number} props.value - Stat value
 * @param {React.ElementType} props.icon - Lucide icon component
 * @param {string} props.change - Change text (e.g. "+12.5%")
 * @param {string} props.badgeText - Badge text (alternative to change)
 * @param {string} props.trend - 'up' | 'down' | 'neutral'
 * @param {string} props.iconColor - Tailwind text color class
 * @param {string} props.iconBg - Tailwind bg color class
 * @param {string} props.layout - 'vertical' (default) | 'horizontal'
 * @param {string} props.className - Additional classes for wrapper
 */
function CardStat({
  label,
  value,
  icon: Icon,
  change,
  badgeText,
  trend = "up",
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  layout = "vertical",
  className = "",
}) {
  const animatedValue = useCountUp(value);

  // Disposition horizontale (utilisée pour QuickStatCard par exemple)
  if (layout === "horizontal") {
    return (
      <div className={`min-w-0 rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/70 rounded-lg flex items-center justify-center shrink-0">
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <div className="break-words text-xl font-bold font-poppins sm:text-2xl">{animatedValue}</div>
            <div className="text-xs opacity-80 font-poppins">{label}</div>
          </div>
        </div>
      </div>
    );
  }

  // Disposition verticale (utilisée par défaut pour les Dashboards)
  return (
    <div className={`min-w-0 bg-white rounded-xl p-3 border border-border-warm hover:shadow-md transition-all sm:p-4 ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
          {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
        </div>
        {change && (
          <Badge
            variant={trend === "up" ? "primary" : "warning"}
            className="flex items-center gap-1 px-2 py-0.5 normal-case tracking-normal"
          >
            <ArrowUp className={`w-3 h-3 ${trend !== "up" ? "rotate-180" : ""}`} />
            {change}
          </Badge>
        )}
        {!change && badgeText && (
          <Badge variant="primary" className="normal-case px-2.5 py-1">
            {badgeText}
          </Badge>
        )}
      </div>
      <div className="break-words text-xl font-bold mb-1 font-poppins sm:text-2xl">{animatedValue}</div>
      <div className="text-xs font-medium text-muted-foreground font-poppins">
        {label}
      </div>
    </div>
  );
}

export default CardStat;
