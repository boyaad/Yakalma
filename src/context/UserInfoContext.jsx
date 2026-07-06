import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";

/* eslint-disable react-refresh/only-export-components */
const UserInfoContext = createContext();

export function UserInfoProvider({ children }) {
    const { user } = useAuth();
    const [commandes, setCommandes] = useState(null);
    const [favorites, setFavorites] = useState(null);
    const [addresses, setAddresses] = useState(null);
    const [commandesLoading, setCommandesLoading] = useState(true);
    const [favoritesLoading, setFavoritesLoading] = useState(true);
    const [addressesLoading, setAddressesLoading] = useState(true);

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
                    quantite,
                    plats (
                        titre
                    )
                )
            `)
            .eq("utilisateur_id", user.id)
            .order("date_creation", { ascending: false });

            if (error) throw error;

            // Transformer les données pour le composant UI
            const formattedCommandes = data.map((order) => {
                const totalItems = order.ligne_commandes?.reduce((sum, line) => sum + line.quantite, 0) || 0;
                const itemsSummary = order.ligne_commandes
                    ?.map((line) => `${line.plats?.titre || "Plat"} (x${line.quantite})`)
                    .join(", ") || "Aucun plat";
                
                // Formater la date en français
                const dateObj = new Date(order.date_creation);
                const formattedDate = dateObj.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                });

                return {
                    ...order,
                    date: formattedDate,
                    items: totalItems,
                    summary: itemsSummary,
                    // S'assurer que status pointe sur order_status pour la rétrocompatibilité
                    status: order.order_status, 
                };
            });

            setCommandes(formattedCommandes);
        } catch (error) {
            toast.error("Erreur lors de la récupération de vos commandes:", error);
        } finally {
            if (!background) setCommandesLoading(false);
        }
    }, [user]);

    const fetchFavorites = useCallback(async (background = false) => {
        if (!user) return;
        try {
            if (!background) setFavoritesLoading(true);
            const { data, error } = await supabase
            .from("favoris")
            .select("*")
            .eq("utilisateur_id", user.id);

            if (error) throw error;

            if (data.length === 0) {
                setFavorites([]);
                return;
            }

            const favoritePlatIds = data.map(fav => fav.plat_id);
            const { data: platsData, error: platsError } = await supabase
                .from("plats")
                .select(`
                    *,
                    profiles (
                        nom_complet,
                        localisation
                    ),
                    avis (
                        note
                    )
                `)
                .in("id", favoritePlatIds);

            if (platsError) throw platsError;

            const transformedFavorites = platsData.map(plat => {
                const totalReviews = plat.avis ? plat.avis.length : 0;
                const averageRating = totalReviews > 0
                    ? parseFloat((plat.avis.reduce((sum, a) => sum + a.note, 0) / totalReviews).toFixed(1))
                    : 0;

                return {
                    id: plat.id,
                    name: plat.titre,
                    chef: plat.profiles?.nom_complet || "Vendeur inconnu",
                    image: plat.image_url,
                    price: Number(plat.prix),
                    rating: averageRating,
                    reviews: totalReviews,
                    distance: "0.0 km"
                };
            });

            setFavorites(transformedFavorites);
        } catch (error) {
            toast.error("Erreur lors de la récupération de vos favoris:", error);
        } finally {
            if (!background) setFavoritesLoading(false);
        }
    }, [user]);

    const fetchAddresses = useCallback(async (background = false) => {
        if (!user) return;
        try {
            if (!background) setAddressesLoading(true);
            const { data, error } = await supabase
            .from("adresses")
            .select("*")
            .eq("utilisateur_id", user.id);

            if (error) throw error;
            setAddresses(data);
        } catch (error) {
            toast.error("Erreur lors de la récupération de vos adresses:", error);
        } finally {
            if (!background) setAddressesLoading(false);
        }
    }, [user]);

    const addAddress = useCallback(async ({ label, localisation, isDefault = false }) => {
        if (!user) return;
        const { error } = await supabase
            .from("adresses")
            .insert([{ utilisateur_id: user.id, label, localisation, isDefault }]);
        if (error) throw error;
        // The realtime subscription handles the state update immediately
    }, [user]);

    const updateAddress = useCallback(async (id, { label, localisation, isDefault }) => {
        if (!user) return;
        const { error } = await supabase
            .from("adresses")
            .update({ label, localisation, isDefault })
            .eq("id", id)
            .eq("utilisateur_id", user.id);
        if (error) throw error;
    }, [user]);

    const deleteAddress = useCallback(async (id) => {
        if (!user) return;
        const { error } = await supabase
            .from("adresses")
            .delete()
            .eq("id", id)
            .eq("utilisateur_id", user.id);
        if (error) throw error;
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchCommandes();
            fetchFavorites();
            fetchAddresses();
        }
    }, [user, fetchCommandes, fetchFavorites, fetchAddresses]);

    // Polling de secours toutes les 10 secondes (si l'onglet est actif)
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            if (document.visibilityState === "visible") {
                fetchCommandes(true);
                fetchFavorites(true);
                fetchAddresses(true);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [user, fetchCommandes, fetchFavorites, fetchAddresses]);

    // Écouter les changements en temps réel sur les commandes, favoris, et adresses de l'utilisateur
    useEffect(() => {
        if (!user) return;

        const userChannel = supabase
            .channel(`user-data-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "commandes",
                },
                (payload) => {
                    const isMyOrder = payload.new?.utilisateur_id === user.id || payload.old?.utilisateur_id === user.id;
                    if (!isMyOrder) return;

                    console.log("[UserInfoContext] Realtime commandes event received:", payload.eventType);

                    // Mise à jour instantanée du state local en cas d'UPDATE
                    if (payload.eventType === "UPDATE") {
                        const updatedOrder = payload.new;
                        setCommandes((prev) => {
                            if (!prev) return prev;
                            return prev.map((order) => {
                                if (order.id === updatedOrder.id) {
                                    return {
                                        ...order,
                                        ...updatedOrder,
                                        status: updatedOrder.order_status, // Garder le statut synchrone
                                    };
                                }
                                return order;
                            });
                        });
                    } else {
                        // Pour INSERT et DELETE, on fetch en arrière-plan avec un léger délai 
                        // pour laisser le temps à ligne_commandes de s'insérer
                        setTimeout(() => fetchCommandes(true), 500);
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "favoris",
                },
                (payload) => {
                    const isMyFavoris = payload.new?.utilisateur_id === user.id || payload.old?.utilisateur_id === user.id;
                    if (!isMyFavoris) return;

                    console.log("[UserInfoContext] Realtime favoris event received");
                    fetchFavorites(true);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "adresses",
                },
                (payload) => {
                    const isMyAddress = payload.new?.utilisateur_id === user.id || payload.old?.utilisateur_id === user.id;
                    if (!isMyAddress) return;

                    console.log("[UserInfoContext] Realtime adresses event received:", payload.eventType);

                    // Mise à jour optimiste directe
                    if (payload.eventType === "INSERT") {
                        setAddresses((prev) => {
                            if (!prev) return [payload.new];
                            if (prev.some((a) => a.id === payload.new.id)) return prev;
                            return [...prev, payload.new];
                        });
                    } else if (payload.eventType === "UPDATE") {
                        setAddresses((prev) => {
                            if (!prev) return prev;
                            return prev.map((a) => (a.id === payload.new.id ? payload.new : a));
                        });
                    } else if (payload.eventType === "DELETE") {
                        setAddresses((prev) => {
                            if (!prev) return prev;
                            return prev.filter((a) => a.id !== payload.old.id);
                        });
                    }
                }
            )
            .subscribe((status, err) => {
                console.log(`[UserInfoContext] Realtime user data subscription status:`, status);
                if (err) console.error("Realtime user data subscription error:", err);
            });

        return () => {
            supabase.removeChannel(userChannel);
        };
    }, [user, fetchCommandes, fetchFavorites]);

    return (
        <UserInfoContext.Provider value={{ 
            commandes, 
            favorites, 
            addresses, 
            commandesLoading, 
            favoritesLoading, 
            addressesLoading,
            refreshCommandes: fetchCommandes,
            refreshFavorites: fetchFavorites,
            refreshAddresses: fetchAddresses,
            addAddress,
            updateAddress,
            deleteAddress,
        }}>
            {children}
        </UserInfoContext.Provider>
    );
}

export const useUserInfo = () => {
    const context = useContext(UserInfoContext);
    return context;
};