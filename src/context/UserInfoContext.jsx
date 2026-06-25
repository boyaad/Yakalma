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

    const fetchCommandes = useCallback(async () => {
        if (!user) return;
        try {
            setCommandesLoading(true);
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
            setCommandesLoading(false);
        }
    }, [user]);

    const fetchFavorites = useCallback(async () => {
        if (!user) return;
        try {
            setFavoritesLoading(true);
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
            setFavoritesLoading(false);
        }
    }, [user]);

    const fetchAddresses = useCallback(async () => {
        if (!user) return;
        try {
            setAddressesLoading(true);
            const { data, error } = await supabase
            .from("adresses")
            .select("*")
            .eq("utilisateur_id", user.id);

            if (error) throw error;
            setAddresses(data);
        } catch (error) {
            toast.error("Erreur lors de la récupération de vos adresses:", error);
        } finally {
            setAddressesLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchCommandes();
            fetchFavorites();
            fetchAddresses();
        }
    }, [user, fetchCommandes, fetchFavorites, fetchAddresses]);

    // Écouter les changements en temps réel sur les commandes, favoris, et adresses de l'utilisateur
    useEffect(() => {
        if (!user) return;

        const commandesChannel = supabase
            .channel(`user-commandes-realtime-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "commandes",
                    filter: `utilisateur_id=eq.${user.id}`,
                },
                () => {
                    fetchCommandes();
                }
            )
            .subscribe();

        const favorisChannel = supabase
            .channel(`user-favoris-realtime-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "favoris",
                    filter: `utilisateur_id=eq.${user.id}`,
                },
                () => {
                    fetchFavorites();
                }
            )
            .subscribe();

        const adressesChannel = supabase
            .channel(`user-adresses-realtime-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "adresses",
                    filter: `utilisateur_id=eq.${user.id}`,
                },
                () => {
                    fetchAddresses();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(commandesChannel);
            supabase.removeChannel(favorisChannel);
            supabase.removeChannel(adressesChannel);
        };
    }, [user, fetchCommandes, fetchFavorites, fetchAddresses]);

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
            refreshAddresses: fetchAddresses
        }}>
            {children}
        </UserInfoContext.Provider>
    );
}

export const useUserInfo = () => {
    const context = useContext(UserInfoContext);
    return context;
};