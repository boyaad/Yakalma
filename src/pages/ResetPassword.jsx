import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChefHat, CheckCircle, Lock, ShieldAlert } from "lucide-react";

import { LoginIllustration } from "../components/auth/Loginillustration";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { updatePassword } from "../services/authService";
import { supabase } from "../services/supabase";

const recoveryStorageKey = "yakalma-password-recovery";

function hasRecoveryParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const hashParams = new URLSearchParams(hash);

  return (
    searchParams.has("code") ||
    searchParams.get("type") === "recovery" ||
    hashParams.get("type") === "recovery" ||
    hashParams.has("access_token") ||
    hashParams.has("refresh_token")
  );
}

function validatePassword(password) {
  if (!password) return "Le nouveau mot de passe est requis";
  if (password.length < 8) return "Au moins 8 caractères requis";
  return "";
}

function validateConfirmPassword(confirmPassword, password) {
  if (!confirmPassword) return "Confirmez votre nouveau mot de passe";
  if (confirmPassword !== password) return "Les mots de passe ne correspondent pas";
  return "";
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function waitForRecoverySession() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      return session;
    }

    await wait(250);
  }

  return null;
}

export default function ResetPassword() {
  const [status, setStatus] = useState("checking");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const recoveryFromUrl = hasRecoveryParams();

    if (recoveryFromUrl) {
      window.sessionStorage.setItem(recoveryStorageKey, "true");
    }

    const canCheckRecovery =
      recoveryFromUrl ||
      window.sessionStorage.getItem(recoveryStorageKey) === "true";

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        window.sessionStorage.setItem(recoveryStorageKey, "true");
      }

      if (isMounted && (event === "PASSWORD_RECOVERY" || canCheckRecovery) && session) {
        setStatus("ready");
      }
    });

    async function verifyRecoveryAccess() {
      if (!canCheckRecovery) {
        window.sessionStorage.removeItem(recoveryStorageKey);
        setStatus("invalid");
        return;
      }

      const session = await waitForRecoverySession();

      if (!isMounted) return;

      if (!session) {
        window.sessionStorage.removeItem(recoveryStorageKey);
      }

      setStatus(session ? "ready" : "invalid");
    }

    verifyRecoveryAccess();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    if (field === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(formData.password),
        confirmPassword: touched.confirmPassword
          ? validateConfirmPassword(formData.confirmPassword, formData.password)
          : prev.confirmPassword,
      }));
    }

    if (field === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(
          formData.confirmPassword,
          formData.password,
        ),
      }));
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      if (field === "password") {
        setErrors((prev) => ({
          ...prev,
          password: validatePassword(value),
          confirmPassword: touched.confirmPassword
            ? validateConfirmPassword(formData.confirmPassword, value)
            : prev.confirmPassword,
          form: "",
        }));
      }

      if (field === "confirmPassword") {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(value, formData.password),
          form: "",
        }));
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password,
    );

    if (passwordError || confirmPasswordError) {
      setTouched({
        password: true,
        confirmPassword: true,
      });
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    const { error } = await updatePassword(formData.password);

    if (error) {
      setErrors({
        form:
          error.message ||
          "Impossible de mettre à jour le mot de passe pour le moment.",
      });
      setIsLoading(false);
      return;
    }

    window.sessionStorage.removeItem(recoveryStorageKey);
    await supabase.auth.signOut();
    setStatus("success");
    setIsLoading(false);
  };

  const renderContent = () => {
    if (status === "checking") {
      return (
        <Card className="p-8 rounded-2xl text-center animate-fade-in">
          <div className="mx-auto mb-5 h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin-custom" />
          <h1 className="text-2xl sm:text-3xl mb-3">Vérification du lien</h1>
          <p className="text-muted-foreground">
            Nous préparons la réinitialisation de votre mot de passe.
          </p>
        </Card>
      );
    }

    if (status === "invalid") {
      return (
        <Card className="p-8 rounded-2xl text-center animate-slide-up">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-error">
            <ShieldAlert className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl mb-4">
            Lien invalide ou expiré
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Demandez un nouveau lien de réinitialisation depuis la page dédiée.
          </p>
          <Button to="/forgot-password" variant="primary" className="w-full">
            Demander un nouveau lien
          </Button>
        </Card>
      );
    }

    if (status === "success") {
      return (
        <Card className="p-8 rounded-2xl text-center animate-slide-up">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success"
            aria-hidden="true"
          >
            <CheckCircle className="h-8 w-8" />
          </div>
          <div className="text-3xl text-success mb-4" aria-hidden="true">
            ✓
          </div>
          <h1 className="text-2xl sm:text-3xl mb-4">
            Votre mot de passe a été modifié avec succès.
          </h1>
          <Button to="/login" variant="primary" className="w-full">
            Se connecter
          </Button>
        </Card>
      );
    }

    return (
      <>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl mb-3">
            Réinitialiser le mot de passe
          </h1>
          <p className="text-muted-foreground text-lg">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="new-password"
            label="Nouveau mot de passe"
            type="password"
            value={formData.password}
            touched={touched.password}
            error={errors.password}
            disabled={isLoading}
            onChange={(event) => handleChange("password", event.target.value)}
            onBlur={() => handleBlur("password")}
            icon={<Lock className="w-5 h-5" />}
            showStrength
          />

          <Input
            id="confirm-new-password"
            label="Confirmer le mot de passe"
            type="password"
            value={formData.confirmPassword}
            touched={touched.confirmPassword}
            error={errors.confirmPassword}
            disabled={isLoading}
            onChange={(event) =>
              handleChange("confirmPassword", event.target.value)
            }
            onBlur={() => handleBlur("confirmPassword")}
            icon={<Lock className="w-5 h-5" />}
          />

          {errors.form && (
            <div
              className="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error animate-fade-in"
              role="alert"
            >
              {errors.form}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-6"
            disabled={isLoading}
            isLoading={isLoading}
          >
            <span>Mettre à jour le mot de passe</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Button>
        </form>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LoginIllustration />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 lg:hidden">
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-primary font-semibold text-2xl">Yakalma</span>
          </Link>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
