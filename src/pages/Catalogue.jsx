import { useState, useEffect } from "react";
import { getPlats } from "../services/platService";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(10);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function chargerPlats() {
      const { data, error } = await getPlats();
      console.log("DATA =", data);
      console.log("ERROR =", error);
      const platsTransformes = data.map((plat) => ({
        id: plat.id,
        name: plat.titre,
        price: plat.prix,
        image: plat.image_url,
        category: plat.categorie_id,
        chef: plat.profiles?.nom_complet || "Vendeur inconnu",
        quartier: plat.profiles?.localisation || "",
        rating: 0,
        reviews: 0,
        distance: 0,
        badge: null,
      }));
      setDishes(platsTransformes);
      setLoading(false);
    }
    chargerPlats();
  }, []);
  const handleOrder = (dishId) => {
    navigate(`/plats/${dishId}`);
  };

  const resetFilters = () => {
    setPriceRange([0, 50]);
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
                currency="€"
                badgeText={dish.badge}
                badgeVariant={
                  dish.badge?.toLowerCase() === "populaire"
                    ? "populaire"
                    : "nouveau"
                }
                onOrder={handleOrder}
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
