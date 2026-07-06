import React from "react";
import { Link } from "react-router-dom";

/**
 * Reusable Button component matching Yakalma Design System
 *
 * @param {Object} props
 * @param {string} props.variant - 'primary' | 'secondary' | 'danger' | 'white' | 'outlineWhite' | 'ghost' | 'link'
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.isLoading - show loading spinner
 * @param {boolean} props.disabled - standard disabled state
 * @param {React.ReactNode} props.children - button contents
 * @param {string} props.className - additional custom classes
 */
function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  children,
  className = "",
  type = "button",
  onClick,
  to,
  href,
  ...props
}) {
  // Base classes for Poppins, font weight, flex centering, transitions
  const baseClasses = "max-w-full font-poppins font-semibold rounded-xl inline-flex items-center justify-center gap-2 text-center whitespace-normal transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer select-none active:scale-[0.98]";

  // Size variations
  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
  };

  // Variant variations
  const variantClasses = {
    primary: "bg-primary text-white shadow-[0_2px_8px_rgba(160,67,10,0.2)] hover:bg-accent hover:shadow-[0_4px_12px_rgba(160,67,10,0.3)] hover:-translate-y-[1px] disabled:bg-border-warm disabled:text-muted-foreground/60 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed",
    secondary: "bg-transparent text-primary border-2 border-primary hover:bg-background-warm hover:border-accent hover:text-accent disabled:border-border-warm disabled:text-muted-foreground/60 disabled:bg-transparent disabled:cursor-not-allowed",
    danger: "bg-error text-white shadow-[0_2px_8px_rgba(220,38,38,0.2)] hover:bg-red-700 hover:shadow-[0_4px_12px_rgba(220,38,38,0.3)] disabled:bg-red-300 disabled:text-white/80 disabled:shadow-none disabled:cursor-not-allowed",
    white: "bg-white text-primary hover:bg-background-warm hover:text-accent shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:-translate-y-[1px] disabled:bg-gray-100 disabled:text-muted-foreground/60 disabled:cursor-not-allowed",
    outlineWhite: "bg-transparent text-white border-2 border-white hover:bg-white/10 hover:text-white hover:-translate-y-[1px] disabled:border-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed",
    ghost: "bg-transparent text-foreground hover:bg-muted/70 disabled:text-muted-foreground/60 disabled:cursor-not-allowed",
    link: "bg-transparent text-primary hover:underline p-0 shadow-none disabled:text-muted-foreground/60 disabled:cursor-not-allowed",
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const currentVariant = variantClasses[variant] || variantClasses.primary;
  
  const combinedClasses = `${baseClasses} ${currentSize} ${currentVariant} ${className}`;
  const isDisabled = disabled || isLoading;

  const content = isLoading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>Chargement...</span>
    </>
  ) : (
    children
  );

  if (to && !isDisabled) {
    return (
      <Link 
        to={to} 
        className={combinedClasses} 
        onClick={onClick}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {content}
      </Link>
    );
  }

  if (href && !isDisabled) {
    return (
      <a 
        href={href} 
        className={combinedClasses} 
        onClick={onClick}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}

export default Button;
