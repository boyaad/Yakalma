import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { ChefHat } from "lucide-react";
import { toast } from "react-toastify";
import { LoginForm } from "../components/auth/Loginform";
import { LoginIllustration } from "../components/auth/Loginillustration";
import { LoginQuickActions } from "../components/auth/Loginquickaction";
import { signIn } from "../services/authService";
import { supabase } from "../services/supabase";

export default function Login() {
  const navigate =
    useNavigate();
  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const handleSubmit = async (
    formData,
  ) => {
    setIsLoading(true);

    try {
      const {
        data: userData,
        error: userError,
      } = await signIn(
        formData.email,
        formData.password,
      );
      if (userError)
        throw userError;

      const { data, error } =
        await supabase
          .from("profiles")
          .select("*")
          .eq(
            "user_id",
            userData.user.id,
          )
          .maybeSingle();
      if (error) throw error;

      if (!data) {
        throw new Error(
          "Profil introuvable",
        );
      }

      if (data.role === "acheteur") {
        navigate("/");
        toast.success("Connexion réussie !");
      } else if (data.role === "vendeur") {
        navigate("/seller/dashboard");
        toast.success("Connexion réussie !");
      } else if (data.role === "admin") {
        navigate("/dashboard");
        toast.success("Connexion admin réussie !");
      }
    } catch (error) {
      toast.error(
        "Erreur de la connexion :",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LoginIllustration />

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo (mobile only) */}
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
              Connexion
            </h1>
            <p className="text-muted-foreground text-lg">
              Connectez-vous
              pour savourer
              vos plats
              préférés
            </p>
          </div>

          <LoginForm
            onSubmit={
              handleSubmit
            }
            isLoading={
              isLoading
            }
          />

          <LoginQuickActions />
        </div>
      </div>
    </div>
  );
}
