import { ArrowRight } from "lucide-react";

export function SubmitButton({
  isLoading,
  label = "Créer mon compte",
  loadingLabel = "Création en cours...",
}) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="group w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6"
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}
