import { createContext, useContext, useEffect, useState } from "react";
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

    useEffect(() => {
        const fetchCommandes = async () => {
            try {
                setCommandesLoading(true);
                const { data, error } = await supabase
                .from("commandes")
                .select("*")
                .eq("utilisateur_id", user.id);

                if (error) throw error;

                setCommandes(data);
            } catch (error) {
                toast.error("Erreur lors de la récupération de vos commandes:", error);
            } finally {
                setCommandesLoading(false);
            }
        };

        if (user) {
            fetchCommandes();
        }
    }, [user]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setFavoritesLoading(true);
                const { data, error } = await supabase
                .from("favoris")
                .select("*")
                .eq("utilisateur_id", user.id);

                if (error) throw error;

                const favoritePlatIds = data.map(fav => fav.plat_id);
                const { data: platsData, error: platsError } = await supabase
                    .from("plats")
                    .select("*")
                    .in("id", favoritePlatIds);

                if (platsError) throw platsError;

                setFavorites(platsData);
            } catch (error) {
                toast.error("Erreur lors de la récupération de vos favoris:", error);
            } finally {
                setFavoritesLoading(false);
            }
        };

        if (user) {
            fetchFavorites();
        }
    }, [user]);

    useEffect(() => {
        const fetchAddresses = async () => {
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
        };

        if (user) {
            fetchAddresses();
        }
    }, [user]);

    return (
        <UserInfoContext.Provider value={{ 
            commandes, 
            favorites, 
            addresses, 
            commandesLoading, 
            favoritesLoading, 
            addressesLoading 
        }}>
            {children}
        </UserInfoContext.Provider>
    );
}

export const useUserInfo = () => {
    const context = useContext(UserInfoContext);
    return context;
};