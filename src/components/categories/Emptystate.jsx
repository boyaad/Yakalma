import { Search } from "lucide-react";

export function EmptyState({ resetFilters }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-border">
      <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="mb-2">Aucun résultat trouvé</h3>
      <p className="text-muted-foreground mb-6">
        Essayez de modifier vos filtres ou votre recherche
      </p>
      <button
        onClick={resetFilters}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-accent transition-colors"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}
