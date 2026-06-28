import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Page précédente"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-white border border-border hover:bg-muted"
                }`}
                aria-label={`Aller à la page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            );
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className="px-2 text-muted-foreground select-none">
                ...
              </span>
            );
          }
          return null;
        })}
      </div>

      <button
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Page suivante"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
