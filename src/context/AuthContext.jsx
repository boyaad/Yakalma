import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../services/supabase";

/* eslint-disable react-refresh/only-export-components */

const AuthContext =
  createContext();

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);
  const [
    profile,
    setProfile,
  ] = useState(null); // profile remains null until the user session is loaded and the profile is fetched
  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      setUser(
        session?.user ?? null,
      );
      setLoading(false);
    }

    getSession();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(
            session?.user ??
              null,
          );
        },
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const {
          data,
          error,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq(
            "user_id",
            user.id,
          )
          .single();

        if (error) {
          console.error(
            "Erreur lors de la récupération du profil :",
            error,
          );
          setProfile(null);
          return;
        }
        setProfile(data);
      } else {
        setProfile(null);
      }
    }

    fetchProfile();
  }, [user]);

  useEffect(() => {
    console.log(
      "Données du profil dans le AuthContext :",
      profile,
    );
  }, [profile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(
    AuthContext,
  );
}
