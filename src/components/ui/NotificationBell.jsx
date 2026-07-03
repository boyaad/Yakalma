import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, X, ShoppingBag, ChefHat, Package, XCircle } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

// Icônes par type de notification
const TYPE_CONFIG = {
  nouvelle_commande: {
    icon: ShoppingBag,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  commande_acceptee: {
    icon: Check,
    color: "text-success",
    bg: "bg-success/10",
  },
  commande_en_cours: {
    icon: ChefHat,
    color: "text-info",
    bg: "bg-info/10",
  },
  commande_prete: {
    icon: Package,
    color: "text-success",
    bg: "bg-success/10",
  },
  commande_livree: {
    icon: CheckCheck,
    color: "text-success",
    bg: "bg-success/10",
  },
  commande_annulee: {
    icon: XCircle,
    color: "text-error",
    bg: "bg-error/10",
  },
};

function formatTimeAgo(dateStr) {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 60) return "À l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [animateBell, setAnimateBell] = useState(false);
  const dropdownRef = useRef(null);
  const prevCountRef = useRef(unreadCount);

  // Animation de la cloche quand un nouveau message arrive
  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setAnimateBell(true);
      const timer = setTimeout(() => setAnimateBell(false), 1000);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  // Fermer le dropdown en cliquant en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = async (notif) => {
    if (!notif.lue) {
      await markAsRead(notif.id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl text-foreground hover:text-primary hover:bg-background-warm transition-all ${
          animateBell ? "notification-bell-shake" : ""
        }`}
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />

        {/* Badge count */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-error text-white text-[11px] font-bold px-1.5 notification-badge-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[calc(100vw-32px)] sm:w-[380px] max-w-[380px] max-h-[480px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-border-warm/60 z-50 notification-dropdown-enter overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-warm/50 bg-background-warm/30">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-accent font-medium px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors"
                  title="Tout marquer comme lu"
                >
                  Tout lire
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background-warm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="overflow-y-auto max-h-[380px] notification-scroll">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-10 h-10 mx-auto text-border-warm mb-3" />
                <p className="text-sm text-muted-foreground font-medium">
                  Aucune notification
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Vous serez notifié ici en temps réel
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.nouvelle_commande;
                const Icon = config.icon;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-border-warm/30 cursor-pointer transition-all hover:bg-background-warm/50 ${
                      !notif.lue ? "bg-primary/[0.03]" : ""
                    }`}
                  >
                    {/* Icône type */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${config.bg}`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${config.color}`} />
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm leading-snug ${
                            !notif.lue ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                          }`}
                        >
                          {notif.titre}
                        </p>

                        {/* Indicateur non lu */}
                        {!notif.lue && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] text-muted-foreground/70 font-medium">
                          {formatTimeAgo(notif.created_at)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notif.id);
                          }}
                          className="p-1 rounded-md text-muted-foreground/40 hover:text-error hover:bg-error/5 transition-colors opacity-0 group-hover:opacity-100"
                          style={{ opacity: 1 }}
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
