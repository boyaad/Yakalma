import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

/**
 * Reusable Input component matching Yakalma Design System
 * 
 * @param {Object} props
 * @param {string} props.label - Label for the input
 * @param {string} props.error - Error message if invalid
 * @param {string} props.helperText - Helper message below input
 * @param {string} props.type - Input type: 'text' | 'email' | 'tel' | 'password' | 'number'
 * @param {boolean} props.disabled - standard disabled state
 * @param {string} props.className - additional custom input classes
 * @param {string} props.containerClassName - additional custom container classes
 */
function Input({
  label,
  error,
  helperText,
  type = "text",
  disabled = false,
  className = "",
  containerClassName = "",
  id,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Determine actual type to render
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  // Class definitions
  const baseInputClasses = "w-full bg-white border border-border-warm rounded-lg px-4 py-3 text-base text-foreground transition-all duration-300 font-poppins placeholder-muted-foreground/50 outline-none";
  const focusClasses = "focus:border-primary focus:shadow-[0_0_0_3px_rgba(160,67,10,0.1)]";
  const errorClasses = error ? "border-error bg-red-50 focus:border-error focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]" : "";
  const disabledClasses = disabled ? "bg-gray-100 text-muted-foreground/60 cursor-not-allowed" : "";

  return (
    <div className={`flex flex-col gap-1 w-full text-left ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground/80 font-poppins cursor-pointer"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          id={inputId}
          type={actualType}
          disabled={disabled}
          className={`${baseInputClasses} ${focusClasses} ${errorClasses} ${disabledClasses} ${
            isPassword ? "pr-12" : ""
          } ${className}`}
          {...props}
        />

        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer select-none"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
          </button>
        )}
      </div>

      {error ? (
        <span className="text-xs text-error font-medium font-poppins mt-0.5 animate-fade-in">
          {error}
        </span>
      ) : helperText ? (
        <span className="text-xs text-muted-foreground font-poppins mt-0.5">
          {helperText}
        </span>
      ) : null}
    </div>
  );
}

export default Input;
