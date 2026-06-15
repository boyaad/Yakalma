import { XCircle } from "lucide-react";

export function TermsCheckbox({ checked, onChange, error }) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="mt-1 w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
        />
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          J'accepte les{" "}
          <a href="#" className="text-primary hover:underline">
            conditions d'utilisation
          </a>{" "}
          et la{" "}
          <a href="#" className="text-primary hover:underline">
            politique de confidentialité
          </a>
        </span>
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
