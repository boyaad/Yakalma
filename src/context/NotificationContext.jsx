import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../services/supabase";
import {
  getNotifications,
  getUnreadCount,
  markAsRead as markAsReadService,
  markAllAsRead as markAllAsReadService,
  deleteNotification as deleteNotificationService,
} from "../services/notificationService";
import { toast } from "react-toastify";

/* eslint-disable react-refresh/only-export-components */
const NotificationContext = createContext();

// Icônes emoji par type de notification
const NOTIFICATION_ICONS = {
  nouvelle_commande: "🛒",
  commande_acceptee: "✅",
  commande_en_cours: "👨‍🍳",
  commande_prete: "🍽️",
  commande_livree: "📦",
  commande_annulee: "❌",
};

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const hasInitialLoad = useRef(false);

  // Réinitialiser l'état lors de la déconnexion
  const resetState = useCallback(() => {
    hasInitialLoad.current = false;
    setNotifications([]);
    setUnreadCount(0);
    setLoading(false);
  }, []);

  // Charger les notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getNotifications(user.id);
      setNotifications(data || []);
      const count = await getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error("Erreur chargement notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Charger au montage
  useEffect(() => {
    if (user && !hasInitialLoad.current) {
      hasInitialLoad.current = true;
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  // Réinitialiser à la déconnexion — appel légitime de setState en réponse à un changement d'auth
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (user) return;
    resetState();
  }, [user, resetState]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Écoute en temps réel des nouvelles notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`notifications-realtime-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const isMyNotification = payload.new?.utilisateur_id === user.id;
          if (!isMyNotification) return;

          console.log("[NotificationContext] Realtime INSERT notification received:", payload.new);
          const newNotif = payload.new;

          // Ajouter en tête de liste sans doublon
          setNotifications((prev) => {
            if (prev.some((n) => n.id === newNotif.id)) return prev;
            setUnreadCount((c) => c + 1);
            return [newNotif, ...prev];
          });

          // Afficher un toast instantané pour tous les types de notifications
          const type = newNotif.type;
          const icon = NOTIFICATION_ICONS[type] || "🔔";
          const toastMessage = `${icon} ${newNotif.titre}\n${newNotif.message}`;
          const toastOptions = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "notification-toast",
          };

          if (type === "commande_annulee") {
            toast.error(toastMessage, toastOptions);
          } else if (
            type === "commande_acceptee" ||
            type === "commande_prete" ||
            type === "commande_livree"
          ) {
            toast.success(toastMessage, toastOptions);
          } else {
            toast.info(toastMessage, toastOptions);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const isMyNotification = payload.new?.utilisateur_id === user.id || payload.old?.utilisateur_id === user.id;
          if (!isMyNotification) return;

          console.log("[NotificationContext] Realtime UPDATE notification received:", payload.new);
          const updated = payload.new;
          setNotifications((prev) => {
            const next = prev.map((n) => (n.id === updated.id ? updated : n));
            const count = next.filter((n) => !n.lue).length;
            setUnreadCount(count);
            return next;
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const isMyNotification = payload.old?.utilisateur_id === user.id;
          if (!isMyNotification) return;

          console.log("[NotificationContext] Realtime DELETE notification received:", payload.old);
          const deletedId = payload.old.id;
          setNotifications((prev) => {
            const newList = prev.filter((n) => n.id !== deletedId);
            setUnreadCount(newList.filter((n) => !n.lue).length);
            return newList;
          });
        }
      )
      .subscribe((status, err) => {
        console.log(`[NotificationContext] Realtime notification channel status:`, status);
        if (err) {
          console.error("Realtime notification channel error:", err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await markAsReadService(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, lue: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Erreur markAsRead:", error);
    }
  }, []);

  // Marquer toutes comme lues
  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    try {
      await markAllAsReadService(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, lue: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Erreur markAllAsRead:", error);
    }
  }, [user]);

  // Supprimer une notification
  const removeNotification = useCallback(async (notificationId) => {
    try {
      await deleteNotificationService(notificationId);
      setNotifications((prev) => {
        const notif = prev.find((n) => n.id === notificationId);
        if (notif && !notif.lue) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n.id !== notificationId);
      });
    } catch (error) {
      console.error("Erreur deleteNotification:", error);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        removeNotification,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications doit être utilisé dans un NotificationProvider");
  }
  return context;
}
