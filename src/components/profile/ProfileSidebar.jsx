import {
  LogOut,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";

function ProfileSidebarContent({
  activeSection,
  menuItems,
  onLogout,
  onSelectSection,
}) {
  const { profile } =
    useAuth();


  if (!profile) {
    return (
      <div className="px-4 py-5">
        <div className="rounded-2xl bg-background-warm p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Chargement du
            profil...
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="px-4 py-5">
        <div className="rounded-2xl bg-background-warm p-4 text-center">
          <img
            src={
              profile.avatar
            }
            alt={
              profile.nom_complet
            }
            className="mx-auto mb-4 h-20 w-20 rounded-full object-cover ring-4 ring-primary/20"
          />
          <h2 className="truncate text-lg font-semibold text-foreground">
            {
              profile.nom_complet
            }
          </h2>
          <p className="text-sm text-muted-foreground">
            Membre depuis{" "}
            {profile.created_at
              ? new Date(
                  profile.created_at,
                ).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-1.5">
        {menuItems.map(
          (item) => {
            const Icon =
              item.icon;
            const isActive =
              activeSection ===
              item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onSelectSection(
                    item.id,
                  )
                }
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-foreground hover:bg-background-warm"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>
                  {item.label}
                </span>
              </button>
            );
          },
        )}
      </nav>

      <div className="p-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-foreground transition-all hover:bg-background-warm hover:text-primary"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>
            Déconnexion
          </span>
        </button>
      </div>
    </>
  );
}

export function ProfileSidebar({
  activeSection,
  menuItems,
  onLogout,
  onSelectSection,
  setSidebarOpen,
  sidebarOpen,
  user,
}) {
  const handleMobileSelect = (
    section,
  ) => {
    onSelectSection(section);
    setSidebarOpen(false);
  };

  return (
    <>
      <aside className="fixed hidden h-full w-64 flex-col border-r border-border-warm bg-white lg:flex xl:w-72 overflow-y-auto">
        <div className="border-b border-border-warm p-6">
          <img
            src={logo}
            alt="Yakalma"
            className="h-12 w-auto object-contain"
          />
        </div>

        <ProfileSidebarContent
          activeSection={
            activeSection
          }
          menuItems={
            menuItems
          }
          onLogout={onLogout}
          onSelectSection={
            onSelectSection
          }
        />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() =>
              setSidebarOpen(
                false,
              )
            }
            aria-label="Fermer le menu"
          />

          <aside className="absolute bottom-0 left-0 top-0 flex w-64 flex-col bg-white shadow-2xl sm:w-72 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-warm p-4">
              <img
                src={logo}
                alt="Yakalma"
                className="h-10 w-auto object-contain"
              />
              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(
                    false,
                  )
                }
                className="rounded-lg p-2 transition-colors hover:bg-background-warm"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ProfileSidebarContent
              activeSection={
                activeSection
              }
              menuItems={
                menuItems
              }
              onLogout={
                onLogout
              }
              onSelectSection={
                handleMobileSelect
              }
              user={user}
            />
          </aside>
        </div>
      )}
    </>
  );
}
