import React, { useEffect, useRef, useCallback } from "react";
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

let modalCounter = 0;

function Modal({ isOpen, onClose, title, children, size = "md" }) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);
  const modalIdRef = useRef(`modal-title-${++modalCounter}`);

  // ─── Focus trap ───────────────────────────────────────────────────────────
  const trapFocus = useCallback((e) => {
    if (e.key !== "Tab" || !dialogRef.current) return;

    const focusableSelectors = [
      'a[href]', 'button:not([disabled])', 'textarea:not([disabled])',
      'input:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])',
    ];
    const focusableElements = dialogRef.current.querySelectorAll(focusableSelectors.join(", "));
    if (focusableElements.length === 0) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  // Disable body scrolling, listen for Escape, trap focus, restore focus on close
  useEffect(() => {
    if (!isOpen) return;

    // Store the element that had focus before the modal opened
    previousFocusRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
        return;
      }
      trapFocus(e);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Auto-focus the dialog (or its first focusable child) on mount
    requestAnimationFrame(() => {
      if (dialogRef.current) {
        const firstFocusable = dialogRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          dialogRef.current.focus();
        }
      }
    });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      // Restore focus to the element that triggered the modal
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose, trapFocus]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const titleId = modalIdRef.current;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        ref={dialogRef}
        className={`bg-white w-full ${currentSize} rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative z-10 animate-slide-up transform transition-all text-left flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h3 id={titleId} className="font-poppins font-bold text-xl text-foreground">
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
