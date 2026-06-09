import { useState } from "react";
import { Plus, X, Info, XCircle } from "lucide-react";

/**
 * IngredientManager
 *
 * Props:
 *  value    : string[]
 *  onChange : (ingredients: string[]) => void
 *  error    : string
 */
export function IngredientManager({ value = [], onChange, error }) {
  const [newIngredient, setNewIngredient] = useState("");

  function handleAdd() {
    const trimmed = newIngredient.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setNewIngredient("");
  }

  function handleRemove(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Ingrédients</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ex: Poulet, Légumes, Épices..."
          className="flex-1 px-4 py-3.5 bg-white rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-6 py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-accent transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {value.map((ingredient, index) => (
            <span
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium"
            >
              {ingredient}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-xl">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Ajoutez au moins un ingrédient pour mieux décrire votre plat
          </p>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
