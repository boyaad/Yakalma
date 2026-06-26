import { useEffect } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import { useUserInfo } from "../context/UserInfoContext";
import { useSeller } from "../context/SellerInfoContext";
import { toast } from "react-toastify";

const statusLabels = {
  en_attente: "En attente",
  en_cours: "En préparation",
  pret: "Prêt",
  livre: "Livré",
  annulee: "Annulé",
  pending: "En attente",
  preparing: "En préparation",
  ready: "Prêt",
  delivered: "Livré",
  cancelled: "Annulé",
};

export function useOrderNotifications() {
  const { user, profile } = useAuth();
  const { refreshCommandes: refreshClientCommandes } = useUserInfo() || {};
  
  // Access seller context safely inside the hook
  let sellerContext = null;
  try {
    sellerContext = useSeller();
  } catch (e) {
    console.error("Seller context error in hook:", e);
  }
  const refreshSellerCommandes = sellerContext?.refreshCommandes;

  useEffect(() => {
    if (!user || !profile) return;

    let channel = null;

    if (profile.role === "acheteur") {
      // Client/Buyer subscription: Listen to updates on their own orders
      channel = supabase
        .channel(`client-notifications-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "commandes",
            filter: `utilisateur_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Client order update notification:", payload);
            
            // Refresh client order list in context
            if (refreshClientCommandes) {
              refreshClientCommandes();
            }

            const oldStatus = payload.old?.order_status;
            const newStatus = payload.new?.order_status;

            // Only notify if status changed or if oldStatus is not available
            if (!oldStatus || oldStatus !== newStatus) {
              const label = statusLabels[newStatus] || newStatus;
              const orderIdShort = payload.new.id ? payload.new.id.slice(0, 8) : "";
              
              if (newStatus === "annulee" || newStatus === "cancelled") {
                toast.error(`Votre commande #${orderIdShort} a été annulée.`, {
                  position: "bottom-right",
                  autoClose: 5000,
                });
              } else if (newStatus === "pret" || newStatus === "ready" || newStatus === "livre" || newStatus === "delivered") {
                toast.success(`Le statut de votre commande #${orderIdShort} est maintenant : ${label}`, {
                  position: "bottom-right",
                  autoClose: 5000,
                });
              } else {
                toast.info(`Le statut de votre commande #${orderIdShort} est maintenant : ${label}`, {
                  position: "bottom-right",
                  autoClose: 5000,
                });
              }
            }
          }
        )
        .subscribe();
    } else if (profile.role === "vendeur") {
      // Seller/Vendor subscription: Listen to all events on orders they manage
      channel = supabase
        .channel(`seller-notifications-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to INSERT, UPDATE, DELETE to keep local UI sync'd and trigger alerts
            schema: "public",
            table: "commandes",
            filter: `vendeur_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Seller order notification:", payload);
            
            // Refresh seller order list in context
            if (refreshSellerCommandes) {
              refreshSellerCommandes();
            }

            const eventType = payload.eventType;

            if (eventType === "INSERT") {
              toast.success("Nouvelle commande reçue ! 🍳 Accédez à votre tableau de bord.", {
                position: "bottom-right",
                autoClose: 6000,
                icon: "🛒",
              });
            } else if (eventType === "UPDATE") {
              const oldStatus = payload.old?.order_status;
              const newStatus = payload.new?.order_status;

              // If client cancelled the order
              if (newStatus === "annulee" || newStatus === "cancelled") {
                if (!oldStatus || oldStatus !== newStatus) {
                  const orderIdShort = payload.new.id ? payload.new.id.slice(0, 8) : "";
                  toast.warning(`La commande #${orderIdShort} a été annulée par le client.`, {
                    position: "bottom-right",
                    autoClose: 6000,
                  });
                }
              }
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, profile, refreshClientCommandes, refreshSellerCommandes]);
}
