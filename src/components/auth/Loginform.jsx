import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { FormField } from "./FormField";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "L'email est requis";
  if (!emailRegex.test(email)) return "Email invalide";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Le mot de passe est requis";
  if (password.length < 6) return "Au moins 6 caractères requis";
  return "";
};

export function LoginForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const error =
      field === "email"
        ? validateEmail(formData.email)
        : validatePassword(formData.password);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const error =
        field === "email" ? validateEmail(value) : validatePassword(value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      return;
    }
    onSubmit(formData);
  };

  const isEmailValid = formData.email && !errors.email && touched.email;
  const isPasswordValid =
    formData.password && !errors.password && touched.password;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField
        id="email"
        label="Adresse email"
        type="email"
        value={formData.email}
        placeholder="votre@email.com"
        touched={touched.email}
        error={errors.email}
        onChange={(val) => handleChange("email", val)}
        onBlur={() => handleBlur("email")}
        icon={<Mail className="w-5 h-5" />}
      />

      <FormField
        id="password"
        label="Mot de passe"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        placeholder="••••••••"
        touched={touched.password}
        error={errors.password}
        onChange={(val) => handleChange("password", val)}
        onBlur={() => handleBlur("password")}
        icon={<Lock className="w-5 h-5" />}
        rightSlot={
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
        }
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) =>
              setFormData({ ...formData, rememberMe: e.target.checked })
            }
            className="w-5 h-5 rounded-md border-2 border-border text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
          />
          <span className="text-sm font-medium group-hover:text-primary transition-colors">
            Se souvenir de moi
          </span>
        </label>
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isEmailValid || !isPasswordValid}
        className="group w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Connexion en cours...</span>
          </>
        ) : (
          <>
            <span>Se connecter</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
