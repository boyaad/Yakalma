import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChefHat, Mail, MailCheck } from "lucide-react";

import { LoginIllustration } from "../components/auth/Loginillustration";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { requestPasswordReset } from "../services/authService";

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) return "L'email est requis";
  if (!emailRegex.test(email)) return "Email invalide";
  return "";
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleChange = (value) => {
    setEmail(value);

    if (touched) {
      setError(validateEmail(value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setTouched(true);
      setError(emailError);
      return;
    }

    setIsLoading(true);
    setError("");

    const redirectTo = `${window.location.origin}/reset-password`;
    const { error: resetError } = await requestPasswordReset(email, redirectTo);

    if (resetError) {
      setError(resetError.message || "Impossible d'envoyer le lien pour le moment.");
      setIsLoading(false);
      return;
    }

    setIsSent(true);
    setIsLoading(false);
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

          {isSent ? (
            <Card className="p-8 rounded-2xl text-center animate-slide-up">
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <MailCheck className="h-8 w-8" />
              </div>
              <div className="text-3xl mb-4" aria-hidden="true">
                📧
              </div>
              <h1 className="text-2xl sm:text-3xl mb-4">
                Nous venons de vous envoyer un lien de réinitialisation.
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Pensez également à vérifier vos courriers indésirables.
              </p>
              <Button to="/login" variant="primary" className="w-full">
                Retour à la connexion
              </Button>
            </Card>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-8"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Retour à la connexion
              </Link>

              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl mb-3">
                  Mot de passe oublié ?
                </h1>
                <p className="text-muted-foreground text-lg">
                  Saisissez votre adresse e-mail. Nous vous enverrons un lien
                  pour réinitialiser votre mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  id="forgot-email"
                  label="Email"
                  type="email"
                  value={email}
                  placeholder="votre@email.com"
                  touched={touched}
                  error={error}
                  disabled={isLoading}
                  onChange={(event) => handleChange(event.target.value)}
                  onBlur={handleBlur}
                  icon={<Mail className="w-5 h-5" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-6"
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  <span>Envoyer le lien</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
