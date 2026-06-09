import React from "react";

/**
 * Reusable Loader/Spinner component matching Yakalma Design System
 * 
 * @param {Object} props
 * @param {boolean} props.fullScreen - if true, covers the screen
 * @param {string} props.text - custom message text
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 */
function Loader({ fullScreen = false, text = "Chargement...", size = "md" }) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`border-border-warm border-t-primary rounded-full animate-spin-custom ${currentSize}`}
        role="status"
        aria-label="Chargement"
      />
      {text && (
        <span className="text-muted-foreground font-poppins font-medium text-sm">
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background-warm/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
        {spinner}
      </div>
    );
  }

  return <div className="p-6 flex items-center justify-center">{spinner}</div>;
}

export default Loader;
