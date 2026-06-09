import { CheckCircle, XCircle } from "lucide-react";

/**
 * FormField — champ de saisie avec icône gauche, indicateur de validation,
 * et message d'erreur.
 *
 * Props:
 *   id          string
 *   label       string
 *   type        string  (default "text")
 *   value       string
 *   placeholder string
 *   touched     boolean
 *   error       string
 *   onChange    (value: string) => void
 *   onBlur      () => void
 *   icon        ReactNode  — icône affichée à gauche
 *   rightSlot   ReactNode  — élément optionnel à droite (ex: bouton œil)
 */
export function FormField({
  id,
  label,
  type = "text",
  value,
  placeholder,
  touched,
  error,
  onChange,
  onBlur,
  icon,
  rightSlot,
}) {
  const borderClass = touched
    ? error
      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
      : "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
    : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <div>
      <label htmlFor={id} className="block mb-2 font-medium">
        {label}
      </label>
      <div className="relative">
        {/* Left icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-3.5 bg-white border-2 rounded-xl transition-all focus:outline-none ${borderClass}`}
        />

        {/* Right slot: custom button OR validation icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightSlot
            ? rightSlot
            : touched &&
              (error ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ))}
        </div>
      </div>

      {touched && error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
