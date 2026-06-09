import React, { useEffect } from "react";
import { LuX } from "react-icons/lu";

/**
 * Reusable Modal component matching Yakalma Design System
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - open state
 * @param {function} props.onClose - function to close modal
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 */
function Modal({ isOpen, onClose, title, children, size = "md" }) {
  // Disable body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`bg-white w-full ${currentSize} rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative z-10 animate-slide-up transform transition-all text-left flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h3 className="font-poppins font-bold text-xl text-foreground">
              {title}
            </h3>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-primary hover:bg-background-warm p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="font-poppins text-foreground/80 text-sm leading-relaxed mb-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
