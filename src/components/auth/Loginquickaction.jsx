import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";

export function LoginQuickActions() {
  return (
    <>
      {/* Sign Up Link */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link
            to="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Inscrivez-vous gratuitement
          </Link>
        </p>
      </div>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">Ou</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/plats"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-border rounded-xl hover:bg-muted transition-colors"
        >
          <span className="text-sm font-medium">Continuer sans compte</span>
        </Link>
        <Link
          to="/register?role=chef"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-primary text-primary rounded-xl hover:bg-primary/5 transition-colors"
        >
          <ChefHat className="w-4 h-4" />
          <span className="text-sm font-medium">Devenir chef</span>
        </Link>
      </div>
    </>
  );
}
