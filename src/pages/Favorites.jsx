import { useUserInfo } from "../context/UserInfoContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";
import { EmptyFavorites } from "../components/favorites/EmptyFavorites";
import { FavoritesList } from "../components/favorites/FavoritesList";

export default function Favorites() {
  const { user } = useAuth();
  const { favorites, favoritesLoading, refreshFavorites } = useUserInfo();

  const handleRemoveFavorite = async (dishId) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("favoris")
        .delete()
        .eq("utilisateur_id", user.id)
        .eq("plat_id", dishId);
      if (error) throw error;
      toast.success("Retiré des favoris !");
      if (refreshFavorites) refreshFavorites();
    } catch (err) {
      console.error("Erreur suppression favori:", err);
      toast.error("Impossible de supprimer le favori.");
    }
  };

  if (favoritesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-warm">
        <p className="text-muted-foreground">Chargement de vos favoris...</p>
      </div>
    );
  }

  const realFavorites = favorites || [];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-background-warm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <h1 className="text-2xl font-bold">
            Mes favoris ({realFavorites.length})
          </h1>
        </div>

        {realFavorites.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <FavoritesList
            favorites={realFavorites}
            onRemove={handleRemoveFavorite}
          />
        )}
      </div>
    </div>
  );
}
