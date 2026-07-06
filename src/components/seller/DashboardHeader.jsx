import { Link } from "react-router-dom";
import { Menu, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

export function DashboardHeader({
  activeSection,
  sidebarOpen,
  setSidebarOpen,
}) {
  const { user, profile } = useAuth();
  const getSectionTitle = () => {
    if (activeSection === "dashboard") return "Tableau de bord";
    if (activeSection === "dishes") return "Mes plats";
    if (activeSection === "orders") return "Commandes";
    if (activeSection === "profile") return "Profil vendeur";
    return "Dashboard";
  };

  return (
    <header className="bg-white border-b border-border-warm sticky top-0 z-40 shadow-sm">
      <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Menu Burger - Mobile Only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 text-foreground hover:bg-muted active:bg-primary active:text-white rounded-lg transition-colors flex-shrink-0"
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Title and Subtitle */}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold truncate">
                {getSectionTitle()}
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm lg:text-base truncate">
                Bienvenue {profile?.nom_complet} !
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Action Button */}
            {activeSection === "dishes" && (
              <Button
                to="/seller/add-dish"
                variant="primary"
                className="!px-2.5 sm:!px-5 lg:!px-6 !py-1.5 sm:!py-2.5 lg:!py-3 !text-xs sm:!text-sm lg:!text-base !rounded-lg sm:!rounded-xl"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Ajouter un plat</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
            )}

            {/* User Profile */}
            <Link
              to="/seller/profile"
              className="flex items-center gap-1.5 sm:gap-3 px-1 sm:px-3 py-1 sm:py-2 hover:bg-muted rounded-lg sm:rounded-xl transition-all group"
            >
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {profile?.nom_complet || "Kaniel Outis"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Chef vendeur
                  </div>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-primary rounded-full flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                  <img
                    src={profile?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"}
                    alt={profile?.nom_complet || "Kaniel Outis"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
