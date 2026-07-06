import { Search, X } from "lucide-react";

export function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="mb-6">
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un plat ou un chef..."
          className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm font-poppins"
          aria-label="Rechercher un plat ou un chef"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Effacer la recherche"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
