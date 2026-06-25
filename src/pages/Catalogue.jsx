import { useState, useEffect, useCallback } from "react";
import { getPlats } from "../services/platService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FALLBACK_PLATS } from "../data/plats";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import { useUserInfo } from "../context/UserInfoContext";
import { toast } from "react-toastify";

import { SearchBar } from "../components/categories/Searchbar";
import { CategoryTabs } from "../components/categories/Categorytabs";
import { FiltersBar } from "../components/categories/Filtersbar";
import { EmptyState } from "../components/categories/Emptystate";
import { Pagination } from "../components/categories/Pagination";
import CardPlat from "../components/ui/CardPlat";

const ITEMS_PER_PAGE = 9;

export default function Catalog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(10);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { favorites, refreshFavorites } = useUserInfo();

  const isDishFavorite = useCallback(
    (dishId) => {
      if (!favorites) return false;
      return favorites.some((fav) => fav.id === dishId);
    },
    [favorites],
  );

  const handleToggleFavorite = useCallback(
    async (dishId) => {
      if (!user) {
        toast.error("Vous devez être connecté pour ajouter un plat aux favoris.");
        return;
      }

      const isFav = isDishFavorite(dishId);

      try {
        if (isFav) {
          const { error } = await supabase
            .from("favoris")
            .delete()
            .eq("utilisateur_id", user.id)
            .eq("plat_id", dishId);
          if (error) throw error;
          toast.success("Retiré des favoris !");
        } else {
          const { error } = await supabase
            .from("favoris")
            .insert({
              utilisateur_id: user.id,
              plat_id: dishId,
            });
          if (error) throw error;
          toast.success("Ajouté aux favoris !");
        }
        if (refreshFavorites) refreshFavorites();
      } catch (err) {
        console.error("Erreur toggle favori:", err);
        toast.error("Impossible de modifier les favoris.");
      }
    },
    [user, isDishFavorite, refreshFavorites],
  );

  const chargerPlats = useCallback(async () => {
    try {
      const { data, error } = await getPlats();
      console.log("DATA =", data);
      console.log("ERROR =", error);

      let rawPlats = data;
      if (error || !data || data.length === 0) {
        console.warn("Utilisation des plats de secours (offline)");
        rawPlats = FALLBACK_PLATS;
      }

      const platsTransformes = rawPlats.map((plat) => {
        const totalReviews = plat.avis ? plat.avis.length : 0;
        const averageRating = totalReviews > 0
          ? parseFloat(
              (plat.avis.reduce((sum, a) => sum + a.note, 0) / totalReviews).toFixed(1)
            )
          : 0;

        return {
          id: plat.id,
          name: plat.titre,
          price: Number(plat.prix),
          image: plat.image_url,
          category: plat.categorie_id,
          chef: plat.profiles?.nom_complet || "Vendeur inconnu",
          quartier: plat.profiles?.localisation || "",
          rating: averageRating,
          reviews: totalReviews,
          distance: 0,
          badge: null,
        };
      });
      setDishes(platsTransformes);
    } catch (err) {
      console.error("Erreur de chargement, utilisation des données offline:", err);
      const platsTransformes = FALLBACK_PLATS.map((plat) => ({
        id: plat.id,
        name: plat.titre,
        price: Number(plat.prix),
        image: plat.image_url,
        category: plat.categorie_id,
        chef: plat.profiles?.nom_complet || "Vendeur inconnu",
        quartier: plat.profiles?.localisation || "",
        rating: plat.rating ?? 0,
        reviews: plat.reviews ?? 0,
        distance: 0,
        badge: null,
      }));
      setDishes(platsTransformes);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    chargerPlats();
  }, [chargerPlats]);

  useEffect(() => {
    const channel = supabase
      .channel("catalogue-avis-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "avis",
        },
        () => {
          chargerPlats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chargerPlats]);

  const handleOrder = (dishId) => {
    navigate(`/plats/${dishId}`);
  };

  const resetFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedRating(0);
    setMaxDistance(10);
    setSelectedCategory("all");
    setSearchQuery("");
  };

  // Filtrage
  let filteredDishes = dishes.filter((dish) => {
    const matchesCategory =
      selectedCategory === "all" || dish.category === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.chef.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice =
      dish.price >= priceRange[0] && dish.price <= priceRange[1];
    const matchesRating = dish.rating >= selectedRating;
    const matchesDistance = dish.distance <= maxDistance;
    return (
      matchesCategory &&
      matchesSearch &&
      matchesPrice &&
      matchesRating &&
      matchesDistance
    );
  });

  // Tri
  filteredDishes = [...filteredDishes].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "distance":
        return a.distance - b.distance;
      default:
        return b.reviews - a.reviews;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDishes = filteredDishes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement des plats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-9">
          <h1 className="mb-2">Catalogue des plats</h1>
          <p className="text-muted-foreground">
            Découvrez {filteredDishes.length} plats faits maison près de chez
            vous
          </p>
        </div>

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <CategoryTabs
          dishes={dishes}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setCurrentPage={setCurrentPage}
        />

        <FiltersBar
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          maxDistance={maxDistance}
          setMaxDistance={setMaxDistance}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resetFilters={resetFilters}
        />

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredDishes.length} résultat{filteredDishes.length > 1 ? "s" : ""}
          {searchQuery && ` pour "${searchQuery}"`}
        </div>

        {/* Dishes Grid or Empty State */}
        {paginatedDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedDishes.map((dish) => (
              <CardPlat
                key={dish.id}
                id={dish.id}
                image={dish.image}
                title={dish.name}
                chefName={dish.chef}
                rating={dish.rating}
                reviewsCount={dish.reviews}
                price={dish.price}
                currency=" FCFA"
                badgeText={dish.badge}
                badgeVariant={
                  dish.badge?.toLowerCase() === "populaire"
                    ? "populaire"
                    : "nouveau"
                }
                onOrder={handleOrder}
                isFavorite={isDishFavorite(dish.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <EmptyState resetFilters={resetFilters} />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
