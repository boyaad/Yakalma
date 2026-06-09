import { CheckCircle, XCircle } from "lucide-react";

export function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  touched,
  error,
  icon: Icon,
  rightElement,
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
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full pl-12 ${rightElement ? "pr-12" : "pr-4"} py-3.5 bg-white border-2 rounded-xl transition-all focus:outline-none ${borderClass}`}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
        {!rightElement && touched && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {error ? (
              <XCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
        )}
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
