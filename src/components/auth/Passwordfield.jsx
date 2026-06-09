import { useState } from "react";
import { Lock, Eye, EyeOff, XCircle } from "lucide-react";


function getPasswordStrength(password) {
  if (!password) return { strength: 0, label: "", color: "" };

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/(?=.*[a-z])/.test(password)) strength++;
  if (/(?=.*[A-Z])/.test(password)) strength++;
  if (/(?=.*\d)/.test(password)) strength++;
  if (/(?=.*[@$!%*?&])/.test(password)) strength++;

  if (strength <= 2)
    return { strength: 33, label: "Faible", color: "bg-red-500" };
  if (strength <= 3)
    return { strength: 66, label: "Moyen", color: "bg-amber-500" };
  return { strength: 100, label: "Fort", color: "bg-green-500" };
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  onBlur,
  touched,
  error,
  showStrength = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = getPasswordStrength(value);

  const toggleButton = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {showPassword ? (
        <EyeOff className="w-5 h-5" />
      ) : (
        <Eye className="w-5 h-5" />
      )}
    </button>
  );

  return (
    <div>
      <label htmlFor={id} className="block mb-2 font-medium">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="••••••••"
          className={`w-full pl-12 pr-12 py-3.5 bg-white border-2 rounded-xl transition-all focus:outline-none ${
            touched
              ? error
                ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
              : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
          }`}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {toggleButton}
        </div>
      </div>

      {showStrength && value && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">
              Force du mot de passe
            </span>
            <span
              className={`text-xs font-medium ${
                passwordStrength.strength === 33
                  ? "text-red-500"
                  : passwordStrength.strength === 66
                    ? "text-amber-500"
                    : "text-green-500"
              }`}
            >
              {passwordStrength.label}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${passwordStrength.color}`}
              style={{ width: `${passwordStrength.strength}%` }}
            ></div>
          </div>
        </div>
      )}

      {touched && error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
