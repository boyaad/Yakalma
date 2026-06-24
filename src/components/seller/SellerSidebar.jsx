import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  LogOut,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";

export function SellerSidebar({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  menuItems,
  onLogout,
}) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-white border-r border-border-warm fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-border-warm">
          <img
            src={logo}
            alt="Yakalma"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
                activeSection === item.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-foreground hover:bg-muted/70 active:bg-primary active:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border-warm space-y-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted/70 active:bg-primary active:text-white transition-all font-medium"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <aside className="absolute left-0 top-0 bottom-0 w-64 sm:w-72 bg-white flex flex-col shadow-2xl">
            {/* Logo */}
            <div className="p-4 sm:p-6 border-b border-border-warm flex items-center justify-between">
              <img
                src={logo}
                alt="Yakalma"
                className="h-12 w-auto object-contain"
              />
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 sm:p-4 space-y-1.5">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl transition-all font-medium text-sm ${
                    activeSection === item.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-foreground hover:bg-muted/70 active:bg-primary active:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Info & Logout */}
            <div className="p-3 sm:p-4 border-t border-border-warm space-y-2 sm:space-y-3">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-foreground hover:bg-muted/70 active:bg-primary active:text-white transition-all font-medium text-sm"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Déconnexion</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
