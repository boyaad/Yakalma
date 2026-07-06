import { Link } from "react-router-dom";
import { Home, Menu, ShoppingBag } from "lucide-react";

const sectionTitles = {
  overview: "Mon espace client",
  profile: "Mes informations",
  orders: "Mes commandes",
  favorites: "Mes favoris",
  addresses: "Mes adresses",
  settings: "Paramètres",
};

export function ProfileHeader({ activeSection, setSidebarOpen, user }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-warm bg-white shadow-sm">
      <div className="px-3 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="shrink-0 rounded-lg p-2 text-foreground transition-colors hover:bg-background-warm lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold sm:text-2xl lg:text-3xl">
                {sectionTitles[activeSection]}
              </h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm lg:text-base">
                Bienvenue {user.firstName}, suivez vos commandes et vos favoris.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/plats"
              className="hidden h-11 items-center gap-2 rounded-xl bg-primary px-4 font-semibold text-white transition-colors hover:bg-accent sm:inline-flex"
            >
              <ShoppingBag className="h-4 w-4" />
              Commander
            </Link>

            <Link to={"/"} className="size-12 flex justify-center items-center rounded-full hover:bg-background-warm transition-colors" aria-label="Retourner à la page d'accueil">
              <Home color="black" size={24} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
