import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChefHat, Mail, User } from "lucide-react";

import { InputField } from "../components/auth/Inputfield";
import { PasswordField } from "../components/auth/Passwordfield";
import { TermsCheckbox } from "../components/auth/Termscheckbox";
import { SubmitButton } from "../components/auth/Submitbutton";
import { AccountTypeSelector } from "../components/auth/Accounttypeselector";
import { LeftPanel } from "../components/auth/Leftpanel";

function validateName(name) {
  if (!name) return "Le nom est requis";
  if (name.length < 2) return "Le nom doit contenir au moins 2 caractères";
  return "";
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "L'email est requis";
  if (!emailRegex.test(email)) return "Email invalide";
  return "";
}

function validatePassword(password) {
  if (!password) return "Le mot de passe est requis";
  if (password.length < 8) return "Au moins 8 caractères requis";
  if (!/(?=.*[a-z])/.test(password)) return "Doit contenir une minuscule";
  if (!/(?=.*[A-Z])/.test(password)) return "Doit contenir une majuscule";
  if (!/(?=.*\d)/.test(password)) return "Doit contenir un chiffre";
  return "";
}

function validateConfirmPassword(confirmPassword, password) {
  if (!confirmPassword) return "Confirmez votre mot de passe";
  if (confirmPassword !== password)
    return "Les mots de passe ne correspondent pas";
  return "";
}

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "customer",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    switch (field) {
      case "name":
        setErrors((prev) => ({ ...prev, name: validateName(formData.name) }));
        break;
      case "email":
        setErrors((prev) => ({
          ...prev,
          email: validateEmail(formData.email),
        }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          password: validatePassword(formData.password),
        }));
        if (touched.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(
              formData.confirmPassword,
              formData.password,
            ),
          }));
        }
        break;
      case "confirmPassword":
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(
            formData.confirmPassword,
            formData.password,
          ),
        }));
        break;
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      switch (field) {
        case "name":
          setErrors((prev) => ({ ...prev, name: validateName(value) }));
          break;
        case "email":
          setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
          break;
        case "password":
          setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
          if (touched.confirmPassword) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: validateConfirmPassword(
                formData.confirmPassword,
                value,
              ),
            }));
          }
          break;
        case "confirmPassword":
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(value, formData.password),
          }));
          break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password,
    );

    if (!formData.acceptTerms) {
      setErrors((prev) => ({
        ...prev,
        acceptTerms: "Vous devez accepter les conditions",
      }));
      return;
    }

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/catalog");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LeftPanel accountType={formData.accountType} />

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 lg:hidden"
          >
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-primary font-semibold text-2xl">Yakalma</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl mb-3">Créer un compte</h1>
            <p className="text-muted-foreground text-lg">
              Rejoignez-nous en quelques secondes
            </p>
          </div>

          <AccountTypeSelector
            accountType={formData.accountType}
            onChange={(type) =>
              setFormData((prev) => ({ ...prev, accountType: type }))
            }
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="name"
              label="Nom complet"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="Jean Dupont"
              touched={touched.name}
              error={errors.name}
              icon={User}
            />

            <InputField
              id="email"
              label="Adresse email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="votre@email.com"
              touched={touched.email}
              error={errors.email}
              icon={Mail}
            />

            <PasswordField
              id="password"
              label="Mot de passe"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              touched={touched.password}
              error={errors.password}
              showStrength
            />

            <PasswordField
              id="confirmPassword"
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              touched={touched.confirmPassword}
              error={errors.confirmPassword}
            />

            <TermsCheckbox
              checked={formData.acceptTerms}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  acceptTerms: e.target.checked,
                }));
                setErrors((prev) => ({ ...prev, acceptTerms: "" }));
              }}
              error={errors.acceptTerms}
            />

            <SubmitButton isLoading={isLoading} />
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
