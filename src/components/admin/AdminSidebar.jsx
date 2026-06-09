import { LogOut, X } from "lucide-react";
import logo from "../../assets/logo.png";

function AdminSidebarContent({
  activeSection,
  compact = false,
  menuItems,
  onLogout,
  onSelectSection,
}) {
  return (
    <>
      <nav
        className={
          compact
            ? "flex-1 px-4 py-2 space-y-2"
            : "flex-1 p-4 space-y-1.5"
        }
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectSection(item.id)}
            className={`w-full flex items-center justify-start gap-3 rounded-xl transition-all font-medium ${
              compact ? "h-12 px-4 text-base" : "px-4 py-3.5"
            } ${
              activeSection === item.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div
        className={`mt-auto shrink-0 bg-white ${
          compact ? "px-4 pt-4 pb-4 space-y-2" : "px-4 pt-8 pb-6 space-y-3"
        }`}
      >
        <div
          className={`flex items-center gap-3 bg-muted/50 rounded-xl ${
            compact ? "px-4 py-2.5" : "px-4 py-3"
          }`}
        >
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">Admin</div>
            <div className="text-xs text-muted-foreground truncate">
              Administrateur
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full h-12 flex items-center justify-start gap-3 px-4 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all font-semibold whitespace-nowrap"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span>Déconnexion</span>
        </button>
      </div>
    </>
  );
}

export function AdminSidebar({
  activeSection,
  menuItems,
  onLogout,
  onSelectSection,
  sidebarOpen,
  setSidebarOpen,
}) {
  const handleMobileSelect = (section) => {
    onSelectSection(section);
    setSidebarOpen(false);
  };

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-white fixed h-full overflow-hidden">
        <div className="p-6">
          <img src={logo} alt="Yakalma" className="h-14 w-auto object-contain" />
        </div>
        <AdminSidebarContent
          activeSection={activeSection}
          menuItems={menuItems}
          onLogout={onLogout}
          onSelectSection={onSelectSection}
        />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 sm:w-72 bg-white flex flex-col shadow-2xl overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <img
                src={logo}
                alt="Yakalma"
                className="h-10 w-auto object-contain"
              />
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AdminSidebarContent
              activeSection={activeSection}
              compact
              menuItems={menuItems}
              onLogout={onLogout}
              onSelectSection={handleMobileSelect}
            />
          </aside>
        </div>
      )}
    </>
  );
}
