import { Menu } from "lucide-react";
import { adminSections } from "../../data/adminDashboardData";

export function AdminHeader({ activeSection, setSidebarOpen }) {
  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm">
      <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold truncate">
              {adminSections[activeSection]}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base truncate">
              Administration Yakalma
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
