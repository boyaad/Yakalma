import React from "react";

/**
 * Reusable Badge component matching Yakalma Design System
 *
 * @param {Object} props
 * @param {string} props.variant - 'disponible' | 'indisponible' | 'nouveau' | 'populaire'
 *                                 | 'success' | 'warning' | 'error' | 'primary' | 'muted'
 *                                 | 'pending' | 'preparing' | 'ready' | 'active' | 'inactive'
 * @param {React.ReactNode} props.children - text inside badge
 * @param {string} props.className - additional custom classes
 */
function Badge({ variant = "disponible", children, className = "" }) {
  const baseClasses =
    "px-3 py-1 rounded-full font-poppins font-semibold text-xs inline-flex items-center justify-center select-none uppercase tracking-wider";

  const variantClasses = {
    // Disponibilité
    disponible: "bg-success/10 text-success",
    success: "bg-success/10 text-success",
    active: "bg-success/10 text-success",

    // Inactif / grisé
    indisponible: "bg-muted-foreground/10 text-muted-foreground",
    muted: "bg-muted-foreground/10 text-muted-foreground",
    inactive: "bg-muted-foreground/10 text-muted-foreground",

    // Marque / primaire
    nouveau: "bg-primary/10 text-primary",
    primary: "bg-primary/10 text-primary",
    ready: "bg-primary/10 text-primary",

    // Warning / en attente / en préparation
    populaire: "bg-warning/10 text-warning",
    warning: "bg-warning/10 text-warning",
    pending: "bg-warning/10 text-warning",
    preparing: "bg-warning/10 text-warning",

    // Erreur / danger
    error: "bg-error/10 text-error",
    danger: "bg-error/10 text-error",
  };

  const currentVariant =
    variantClasses[variant?.toLowerCase()] || variantClasses.disponible;

  return (
    <span className={`${baseClasses} ${currentVariant} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
