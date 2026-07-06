import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../services/supabase";
import {
  getCart,
  addToCart as addToCartService,
  updateQuantity as updateQuantityService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
} from "../services/cartService";
import { toast } from "react-toastify";

/* eslint-disable react-refresh/only-export-components */
const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger le panier depuis Supabase quand l'utilisateur se connecte
  const fetchCart = useCallback(async (background = false) => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      if (!background) setLoading(true);
      const data = await getCart(user.id);

      // Transformer les données pour un format plus simple à utiliser dans l'UI
      const items = data.map((item) => ({
        id: item.plat_id,
        panierId: item.id,
        name: item.plats?.titre ?? "Plat inconnu",
        chef: item.plats?.profiles?.nom_complet ?? "Chef inconnu",
        image: item.plats?.image_url ?? "",
        price: item.plats?.prix ?? 0,
        quantity: item.quantite,
        vendeurId: item.plats?.vendeur_id ?? null,
      }));

      setCartItems(items);
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      toast.error("Impossible de charger votre panier.");
    } finally {
      if (!background) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Écouter les changements en temps réel sur panier_articles
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`panier-realtime-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "panier_articles",
        },
        (payload) => {
          const isMyCart = payload.new?.utilisateur_id === user.id || payload.old?.utilisateur_id === user.id;
          if (!isMyCart) return;

          console.log("[CartContext] Realtime panier event received");
          // Recharger le panier complet en arrière-plan
          fetchCart(true);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchCart]);

  // Ajouter un plat au panier
  const addToCart = async (platId, quantite = 1) => {
    if (!user) {
      toast.warning("Connectez-vous pour ajouter des articles au panier.");
      return;
    }

    try {
      await addToCartService(user.id, platId, quantite);
      await fetchCart();
      toast.success("Article ajouté au panier !");
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      toast.error("Impossible d'ajouter l'article au panier.");
    }
  };

  // Modifier la quantité d'un article (delta : +1 ou -1)
  const updateQuantity = async (platId, delta) => {
    if (!user) return;

    const item = cartItems.find((i) => i.id === platId);
    if (!item) return;

    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) {
      return removeItem(platId);
    }

    try {
      await updateQuantityService(user.id, platId, newQuantity);
      // Mettre à jour l'état local immédiatement pour une UX fluide
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === platId ? { ...i, quantity: newQuantity } : i,
        ),
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité:", error);
      toast.error("Impossible de modifier la quantité.");
      await fetchCart(); // Resynchroniser en cas d'erreur
    }
  };

  // Supprimer un article du panier
  const removeItem = async (platId) => {
    if (!user) return;

    try {
      await removeFromCartService(user.id, platId);
      // Retirer immédiatement de l'état local
      setCartItems((prev) => prev.filter((i) => i.id !== platId));
      toast.info("Article retiré du panier.");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
      toast.error("Impossible de retirer l'article.");
      await fetchCart();
    }
  };

  // Vider tout le panier
  const emptyCart = async () => {
    if (!user) return;

    try {
      await clearCartService(user.id);
      setCartItems([]);
    } catch (error) {
      console.error("Erreur lors du vidage du panier:", error);
      toast.error("Impossible de vider le panier.");
      await fetchCart();
    }
  };

  // Nombre total d'articles
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        cartCount,
        addToCart,
        updateQuantity,
        removeItem,
        emptyCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return context;
};
