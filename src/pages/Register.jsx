import {
  ArrowRight,
  ChefHat,
  Lock,
  Mail
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { LeftPanel } from "../components/auth/Leftpanel";
import { TermsCheckbox } from "../components/auth/Termscheckbox";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { signUp } from "../services/authService";

function validateEmail(email) {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email)
    return "L'email est requis";
  if (!emailRegex.test(email))
    return "Email invalide";
  return "";
}

function validatePassword(password) {
  if (!password)
    return "Le mot de passe est requis";
  if (password.length < 8)
    return "Au moins 8 caractères requis";
  if (
    !/(?=.*[a-z])/.test(
      password,
    )
  )
    return "Doit contenir une minuscule";
  if (
    !/(?=.*[A-Z])/.test(
      password,
    )
  )
    return "Doit contenir une majuscule";
  if (
    !/(?=.*\d)/.test(password)
  )
    return "Doit contenir un chiffre";
  return "";
}

function validateConfirmPassword(confirmPassword, password) {
  if (!confirmPassword)
    return "Confirmez votre mot de passe";
  if (
    confirmPassword !==
    password
  )
    return "Les mots de passe ne correspondent pas";
  return "";
}


export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const handleBlur = (
    field,
  ) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    switch (field) {
      case "email":
        setErrors((prev) => ({
          ...prev,
          email:
            validateEmail(
              formData.email,
            ),
        }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          password:
            validatePassword(
              formData.password,
            ),
        }));
        if (
          touched.confirmPassword
        ) {
          setErrors(
            (prev) => ({
              ...prev,
              confirmPassword:
                validateConfirmPassword(
                  formData.confirmPassword,
                  formData.password,
                ),
            }),
          );
        }
        break;
      case "confirmPassword":
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            validateConfirmPassword(
              formData.confirmPassword,
              formData.password,
            ),
        }));
        break;
    }
  };

  const handleChange = (
    field,
    value,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      switch (field) {
        case "email":
          setErrors(
            (prev) => ({
              ...prev,
              email:
                validateEmail(
                  value,
                ),
            }),
          );
          break;
        case "password":
          setErrors(
            (prev) => ({
              ...prev,
              password:
                validatePassword(
                  value,
                ),
            }),
          );
          if (
            touched.confirmPassword
          ) {
            setErrors(
              (prev) => ({
                ...prev,
                confirmPassword:
                  validateConfirmPassword(
                    formData.confirmPassword,
                    value,
                  ),
              }),
            );
          }
          break;
        case "confirmPassword":
          setErrors(
            (prev) => ({
              ...prev,
              confirmPassword:
                validateConfirmPassword(
                  value,
                  formData.password,
                ),
            }),
          );
          break;
      }
    }
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    const emailError =
      validateEmail(
        formData.email,
      );
    const passwordError =
      validatePassword(
        formData.password,
      );
    const confirmPasswordError =
      validateConfirmPassword(
        formData.confirmPassword,
        formData.password,
      );

    if (
      !formData.acceptTerms
    ) {
      setErrors((prev) => ({
        ...prev,
        acceptTerms:
          "Vous devez accepter les conditions",
      }));
      return;
    }

    if (
      emailError ||
      passwordError ||
      confirmPasswordError
    ) {
      setErrors({
        email: emailError,
        password:
          passwordError,
        confirmPassword:
          confirmPasswordError,
      });
      setTouched({
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      // Créer le compte utilisateur avec Supabase Auth
      const { error } =
        await signUp(
          formData.email,
          formData.password,
        );

      if (error) {
        toast.error(
          "Erreur : " +
            (error.message ||
              String(error)),
        );
        return;
      }

      toast.success(
        "Compte créé avec succès ! Veuillez vérifier votre email pour confirmer votre compte."
      );
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
      });
    } catch (error) {
      toast.error("Erreur : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LeftPanel
        accountType={
          formData.accountType
        }
      />

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 lg:hidden"
          >
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-primary font-semibold text-2xl">
              Yakalma
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl mb-3">
              Créer un compte
            </h1>
            <p className="text-muted-foreground text-lg">
              Rejoignez-nous
              en quelques
              secondes
            </p>
          </div>

          <form
            method="POST"
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >
            <Input
              id="email"
              label="Adresse email"
              type="email"
              value={
                formData.email
              }
              onChange={(e) =>
                handleChange(
                  "email",
                  e.target
                    .value,
                )
              }
              onBlur={() =>
                handleBlur(
                  "email",
                )
              }
              placeholder="votre@email.com"
              touched={
                touched.email
              }
              error={
                errors.email
              }
              icon={
                <Mail className="w-5 h-5" />
              }
            />

            <Input
              id="password"
              label="Mot de passe"
              type="password"
              value={
                formData.password
              }
              onChange={(e) =>
                handleChange(
                  "password",
                  e.target
                    .value,
                )
              }
              onBlur={() =>
                handleBlur(
                  "password",
                )
              }
              touched={
                touched.password
              }
              error={
                errors.password
              }
              icon={
                <Lock className="w-5 h-5" />
              }
              showStrength
            />

            <Input
              id="confirmPassword"
              label="Confirmer le mot de passe"
              type="password"
              value={
                formData.confirmPassword
              }
              onChange={(e) =>
                handleChange(
                  "confirmPassword",
                  e.target
                    .value,
                )
              }
              onBlur={() =>
                handleBlur(
                  "confirmPassword",
                )
              }
              touched={
                touched.confirmPassword
              }
              error={
                errors.confirmPassword
              }
              icon={
                <Lock className="w-5 h-5" />
              }
            />

            <TermsCheckbox
              checked={
                formData.acceptTerms
              }
              onChange={(
                e,
              ) => {
                setFormData(
                  (prev) => ({
                    ...prev,
                    acceptTerms:
                      e.target
                        .checked,
                  }),
                );
                setErrors(
                  (prev) => ({
                    ...prev,
                    acceptTerms:
                      "",
                  }),
                );
              }}
              error={
                errors.acceptTerms
              }
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-6"
              isLoading={
                isLoading
              }
            >
              <span>
                Créer mon
                compte
              </span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Vous avez déjà
              un compte ?{" "}
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