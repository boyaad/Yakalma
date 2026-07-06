import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

/* eslint-disable react-refresh/only-export-components */
export const SellerInfoContext = createContext();

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "À l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
}

export default function SellerInfoProvider({ children }) {
  const { user, profile } = useAuth();
  const isSeller = profile?.role === "vendeur";
  const [plats, setPlats] = useState([]);
  const [platsLoading, setPlatsLoading] = useState(true);
  const [commandes, setCommandes] = useState([]);
  const [commandesLoading, setCommandesLoading] = useState(true);

  // Charger les plats du vendeur
  const fetchPlats = useCallback(async (background = false) => {
    if (!user) return;
    try {
      if (!background) setPlatsLoading(true);
      const { data, error } = await supabase
        .from("plats")
        .select(`
          *,
          avis (
            note
          )
        `)
        .eq("vendeur_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPlats(data);
    } catch (error) {
      console.error("Erreur fetchPlats:", error);
      toast.error("Impossible de charger vos plats.");
    } finally {
      if (!background) setPlatsLoading(false);
    }
  }, [user]);

  // Charger les commandes du vendeur
  const fetchCommandes = useCallback(async (background = false) => {
    if (!user) return;
    try {
      if (!background) setCommandesLoading(true);
      const { data, error } = await supabase
        .from("commandes")
        .select(`
          *,
          ligne_commandes (
            id,
            plat_id,
            quantite,
            sous_total,
            plats (
              titre,
              prix
            )
          )
        `)
        .eq("vendeur_id", user.id)
        .order("date_creation", { ascending: false });

      if (error) throw error;
      
      console.log("[SellerInfoContext] fetchCommandes success, count:", data?.length);

      // Récupérer les noms des clients correspondants
      const customerIds = data.map((o) => o.utilisateur_id).filter(Boolean);
      let customerMap = {};

      if (customerIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("user_id, nom_complet")
          .in("user_id", customerIds);

        if (!profilesError && profiles) {
          profiles.forEach((p) => {
            customerMap[p.user_id] = p.nom_complet;
          });
        }
      }

      // Formater pour le composant UI
      const formatted = data.map((order) => {
        const totalItems = order.ligne_commandes?.reduce((sum, line) => sum + line.quantite, 0) || 0;
        const dishSummary = order.ligne_commandes
          ?.map((line) => `${line.plats?.titre || "Plat"} (x${line.quantite})`)
          .join(", ") || "Aucun plat";

        return {
          ...order,
          customer: customerMap[order.utilisateur_id] || "Client inconnu",
          dish: dishSummary,
          quantity: totalItems,
          time: formatTimeAgo(new Date(order.date_creation)),
          status: order.order_status,
        };
      });

      setCommandes(formatted);
    } catch (error) {
      console.error("Erreur fetchCommandes:", error);
      toast.error("Impossible de charger les commandes reçues.");
    } finally {
      if (!background) setCommandesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && isSeller) {
      fetchPlats();
      fetchCommandes();
    }
  }, [user, isSeller, fetchPlats, fetchCommandes]);

  // Écoute en temps réel des commandes et des plats (vendeur uniquement)
  useEffect(() => {
    if (!user || !isSeller) return;

    const channel = supabase
      .channel(`vendeur-data-realtime-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "commandes",
        },
        (payload) => {
          const isMyOrder = payload.new?.vendeur_id === user.id || payload.old?.vendeur_id === user.id;
          if (!isMyOrder) return;

          console.log("[SellerInfoContext] Realtime commandes event received:", payload.eventType, payload);

          if (payload.eventType === "UPDATE") {
             const updatedOrder = payload.new;
             setCommandes((prev) => {
                 if (!prev) return prev;
                 return prev.map(order => {
                     if (order.id === updatedOrder.id) {
                         return { ...order, ...updatedOrder, status: updatedOrder.order_status };
                     }
                     return order;
                 });
             });

             // Toast si le client a annulé la commande
             const oldStatus = payload.old?.order_status;
             const newStatus = updatedOrder.order_status;
             if ((newStatus === "annulee" || newStatus === "cancelled") && oldStatus !== newStatus) {
               const orderIdShort = updatedOrder.id ? updatedOrder.id.slice(0, 8) : "";
               toast.warning(`La commande #${orderIdShort} a été annulée par le client.`, {
                 position: "bottom-right",
                 autoClose: 6000,
               });
             }
          } else {
             // INSERT ou DELETE : fetch complet avec un léger délai pour ligne_commandes
             console.log("[SellerInfoContext] INSERT/DELETE event. Triggering fetchCommandes.");
             setTimeout(() => fetchCommandes(true), 500);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "plats",
        },
        (payload) => {
          const isMyPlat = payload.new?.vendeur_id === user.id || payload.old?.vendeur_id === user.id;
          if (!isMyPlat) return;

          console.log("[SellerInfoContext] Realtime plats event received:", payload.eventType);
          fetchPlats(true);
        },
      )
      .subscribe((status, err) => {
        console.log(`[SellerInfoContext] Realtime subscription status:`, status);
        if (err) console.error("[SellerInfoContext] Realtime subscription error:", err);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isSeller, fetchCommandes, fetchPlats]);

  return (
    <SellerInfoContext.Provider
      value={{
        plats,
        platsLoading,
        commandes,
        commandesLoading,
        refreshPlats: fetchPlats,
        refreshCommandes: fetchCommandes,
      }}
    >
      {children}
    </SellerInfoContext.Provider>
  );
}

export function useSeller() {
  const context = useContext(SellerInfoContext);
  if (!context) {
    throw new Error("useSeller doit être utilisé dans un SellerInfoProvider");
  }
  return context;
}