import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

/**
 * Reusable Input component matching Yakalma Design System
 *
 * @param {Object} props
 * @param {string}  props.as              - 'input' | 'textarea' | 'select' (default: 'input')
 * @param {string}  props.label           - Label for the input
 * @param {string}  props.error           - Error message if invalid
 * @param {string}  props.helperText      - Helper message below input
 * @param {string}  props.type            - Input type: 'text' | 'email' | 'tel' | 'password' | 'number'
 * @param {boolean} props.disabled        - standard disabled state
 * @param {string}  props.className       - additional custom input classes
 * @param {string}  props.containerClassName - additional custom container classes
 * @param {React.ReactNode} props.icon    - Optional icon element displayed on the left
 * @param {boolean} props.touched         - Whether the field has been interacted with (enables validation UI)
 * @param {boolean} props.showStrength    - Show password strength indicator (only for type="password")
 * @param {React.ReactNode} props.children - Options for <select> element
 */
function Input({
  as,
  label,
  error,
  helperText,
  type = "text",
  disabled = false,
  className = "",
  containerClassName = "",
  id,
  icon,
  touched = false,
  showStrength = false,
  children,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const ariaDescribedBy = [error ? errorId : null, helperText ? helperId : null].filter(Boolean).join(" ") || undefined;

  // Determine the element to render
  const isPassword = !as && type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  // ─── Password strength logic ─────────────────────────────────────────────
  function getPasswordStrength(password) {
    if (!password) return { strength: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[@$!%*?&])/.test(password)) score++;
    if (score <= 2) return { strength: 33, label: "Faible", color: "bg-error" };
    if (score <= 3) return { strength: 66, label: "Moyen", color: "bg-warning" };
    return { strength: 100, label: "Fort", color: "bg-success" };
  }

  const passwordStrength = getPasswordStrength(props.value || "");

  // ─── Class computation ────────────────────────────────────────────────────
  const hasLeftIcon = !!icon;

  // Border state: default → touched+valid → touched+error → error (server-side)
  let borderClass = "border-border-warm focus:border-primary focus:ring-4 focus:ring-primary/10";
  if (error) {
    borderClass =
      "border-error bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10";
  } else if (touched && !error) {
    borderClass =
      "border-success focus:border-success focus:ring-4 focus:ring-success/10";
  }

  const baseInputClasses = [
    "w-full bg-white border rounded-lg py-3 text-base text-foreground transition-all duration-300",
    "font-poppins placeholder-muted-foreground/50 outline-none",
    hasLeftIcon ? "pl-12 pr-4" : "px-4",
    isPassword ? "pr-12" : "",
    touched && !isPassword ? "pr-10" : "",
    borderClass,
    disabled ? "bg-gray-100 text-muted-foreground/60 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // ─── Render the field element ─────────────────────────────────────────────
  const Tag = as === "textarea" ? "textarea" : as === "select" ? "select" : "input";
  const extraTagProps =
    Tag === "textarea"
      ? { style: { resize: "none" }, ...props }
      : Tag === "input"
      ? { type: actualType, ...props }
      : props;

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
        {/* Left icon */}
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </span>
        )}

        {/* The actual field */}
        <Tag
          id={inputId}
          disabled={disabled}
          className={baseInputClasses}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          {...extraTagProps}
        >
          {Tag === "select" ? children : undefined}
        </Tag>

        {/* Password toggle */}
        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer select-none"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        {/* Touched validation icon (non-password fields) */}
        {!isPassword && touched && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {error ? (
              <XCircle className="w-5 h-5 text-error" />
            ) : (
              <CheckCircle className="w-5 h-5 text-success" />
            )}
          </span>
        )}
      </div>

      {/* Password strength bar */}
      {isPassword && showStrength && (props.value || "") && (
        <div className="mt-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-poppins">
              Force du mot de passe
            </span>
            <span
              className={`text-xs font-medium font-poppins ${
                passwordStrength.strength === 33
                  ? "text-error"
                  : passwordStrength.strength === 66
                  ? "text-warning"
                  : "text-success"
              }`}
            >
              {passwordStrength.label}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${passwordStrength.color}`}
              style={{ width: `${passwordStrength.strength}%` }}
            />
          </div>
        </div>
      )}

      {/* Error / helper text */}
      {error ? (
        <span id={errorId} className="text-xs text-error font-medium font-poppins mt-0.5 animate-fade-in" role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="text-xs text-muted-foreground font-poppins mt-0.5">
          {helperText}
        </span>
      ) : null}
    </div>
  );
}

export default Input;
