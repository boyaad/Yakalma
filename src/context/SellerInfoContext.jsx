import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

/* eslint-disable react-refresh/only-export-components */
const SellerInfoContext = createContext();

export default function SellerInfoProvider({
  children
}) {
    const { user } = useAuth();
    const [plats, setPlats] = useState(null);
    const [platsLoading, setPlatsLoading] = useState(true);

    // const [categories, setCategories] = useState(null);
    // const [categoriesLoading, setCategoriesLoading] = useState(true);

    // const [commandes, setCommandes] = useState(null);
    // const [commandesLoading, setCommandesLoading] = useState(false);

    useEffect(() => {
        const fetchPlats = async () => {
            try {
                const { data, error } = await supabase.from("plats").select("*")
                    .eq("vendeur_id", user?.id)
                    .order("created_at", { ascending: false });

                if (error) throw error;

                setPlats(data);
            } catch (error) {
                toast.error("Erreur :", error);
                console.error(error)
            } finally {
                setPlatsLoading(false)
            }
        };

        if(user) {
            fetchPlats()
        }
    }, [user]);


    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             const { data, error } = await supabase.from("categories")
    //                 .select("*")
    //                 .eq("vendeur_id", user?.id)
    //                 .order("created_at", { ascending: false })

    //             if(error) throw error;

    //             setCategories(data)
    //         } catch (error) {
    //             toast.error("Erreur : ", error)
    //             console.error(error)
    //         } finally {
    //             setCategoriesLoading(false)
    //         }
    //     }

    //     if(user) {
    //         fetchCategories()
    //     }
    // }, [user])

    // useEffect(() => {
    //     const fetchCommandes = async () => {
    //         try {
    //             setCommandesLoading(true)
    //             const { data, error } = await supabase.from("commandes")
    //                 .select("*")
    //                 .eq("vendeur_id", user.id)
    //                 .order("created_at", { ascending: false })

    //             if(error) throw error;

    //             setCommandes(data)
    //         } catch (error) {
    //             toast.error("Erreur : ", error.message)
    //         } finally {
    //             setCommandesLoading(false)
    //         }
    //     }

    //     fetchCommandes()
    // }, [user.id])

  return (
    <SellerInfoContext.Provider
      value={{ plats, platsLoading }}
    >
      {children}
    </SellerInfoContext.Provider>
  );
}

export function useSeller() {
    const context = useContext(SellerInfoContext)
    return context;
}