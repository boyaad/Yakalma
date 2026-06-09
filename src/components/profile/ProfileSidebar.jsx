import { Package, Settings, User } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profil", icon: User },
  { id: "orders", label: "Commandes", icon: Package },
  { id: "settings", label: "Paramètres", icon: Settings },
];

export function ProfileSidebar({ user, activeTab, onTabChange }) {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 border border-border-warm">
      <div className="text-center mb-8">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover mx-auto mb-5 ring-4 ring-primary"
        />
        <h2 className="text-xl font-medium mb-1">{user.name}</h2>
        <p className="text-sm text-[#7b5f50]">
          Membre depuis {user.memberSince}
        </p>
      </div>

      <nav className="space-y-2" aria-label="Navigation du profil">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-foreground hover:bg-background-warm"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </section>
  );
}
