import React from "react";

/**
 * Reusable Badge component matching Yakalma Design System
 * 
 * @param {Object} props
 * @param {string} props.variant - 'disponible' | 'indisponible' | 'nouveau' | 'populaire' | 'success' | 'warning' | 'error'
 * @param {React.ReactNode} props.children - text inside badge
 * @param {string} props.className - additional custom classes
 */
function Badge({ variant = "disponible", children, className = "" }) {
  const baseClasses = "px-3 py-1 rounded-full font-poppins font-semibold text-xs inline-flex items-center justify-center select-none uppercase tracking-wider";

  const variantClasses = {
    disponible: "bg-[rgba(22,163,74,0.1)] text-success",
    success: "bg-[rgba(22,163,74,0.1)] text-success",
    
    indisponible: "bg-[rgba(156,163,175,0.1)] text-gray-500",
    muted: "bg-[rgba(156,163,175,0.1)] text-gray-500",
    
    nouveau: "bg-[rgba(160,67,10,0.1)] text-primary",
    primary: "bg-[rgba(160,67,10,0.1)] text-primary",
    
    populaire: "bg-[rgba(245,158,11,0.1)] text-warning",
    warning: "bg-[rgba(245,158,11,0.1)] text-warning",
    
    error: "bg-[rgba(220,38,38,0.1)] text-error",
  };

  const currentVariant = variantClasses[variant.toLowerCase()] || variantClasses.disponible;

  return (
    <span className={`${baseClasses} ${currentVariant} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
