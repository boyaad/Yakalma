import { Star, SlidersHorizontal, ChevronDown } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

export function FiltersBar({
  showFilters,
  setShowFilters,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  maxDistance,
  setMaxDistance,
  sortBy,
  setSortBy,
  resetFilters,
  currency = " FCFA",
}) {
  const hasActiveFilters =
    priceRange[0] > 0 ||
    priceRange[1] < 10000 ||
    selectedRating > 0 ||
    maxDistance < 10;

  return (
    <>
      {/* Sort and Filter Toggle Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white hover:bg-muted px-4 py-2.5 justify-center"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-medium">Filtres avancés</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-primary rounded-full"></span>
          )}
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            Trier par:
          </span>
          <div className="relative flex-1 sm:flex-initial">
            <Input
              as="select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto appearance-none pr-10 py-2.5 cursor-pointer font-medium"
            >
              <option value="popular">Les plus populaires</option>
              <option value="rating">Mieux notés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="distance">Plus proche</option>
            </Input>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="mb-6 bg-white rounded-2xl p-6 border border-border shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Filtres avancés</h3>
            <Button
              type="button"
              variant="link"
              onClick={resetFilters}
              className="p-0 h-auto text-sm font-medium"
            >
              Réinitialiser
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Prix: {priceRange[0]}{currency} - {priceRange[1]}{currency}
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full accent-primary"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Note minimum
              </label>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-all ${
                      selectedRating === rating
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-white border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-sm font-medium">
                        {rating === 0 ? "Tous" : rating}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Distance max: {maxDistance} km
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
