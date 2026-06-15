import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

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
      <Input
        id="email"
        label="Adresse email"
        type="email"
        value={formData.email}
        placeholder="votre@email.com"
        touched={touched.email}
        error={errors.email}
        onChange={(e) => handleChange("email", e.target.value)}
        onBlur={() => handleBlur("email")}
        icon={<Mail className="w-5 h-5" />}
      />

      <Input
        id="password"
        label="Mot de passe"
        type="password"
        value={formData.password}
        placeholder="••••••••"
        touched={touched.password}
        error={errors.password}
        onChange={(e) => handleChange("password", e.target.value)}
        onBlur={() => handleBlur("password")}
        icon={<Lock className="w-5 h-5" />}
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
      <Button
        type="submit"
        variant="primary"
        className="w-full mt-6"
        disabled={isLoading || !isEmailValid || !isPasswordValid}
        isLoading={isLoading}
      >
        <span>Se connecter</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </form>
  );
}
