const DEFAULT_ALLERGENS = [
  "Gluten",
  "Fruits à coque",
  "Lait",
  "Œufs",
  "Soja",
  "Poisson",
  "Crustacés",
  "Arachides",
];

/**
 * AllergenSelector
 *
 * Props:
 *  value    : string[]          — selected allergens
 *  onChange : (allergens: string[]) => void
 *  options  : string[]          — override default list (optional)
 */
export function AllergenSelector({
  value = [],
  onChange,
  options = DEFAULT_ALLERGENS,
}) {
  function toggle(allergen, checked) {
    if (checked) {
      onChange([...value, allergen]);
    } else {
      onChange(value.filter((a) => a !== allergen));
    }
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold mb-6">Allergènes (optionnel)</h2>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {options.map((allergen) => {
          const isSelected = value.includes(allergen);
          return (
            <label
              key={allergen}
              className={[
                "flex min-w-0 items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
                isSelected
                  ? "bg-primary/5"
                  : "hover:bg-muted/50",
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => toggle(allergen, e.target.checked)}
                className="w-5 h-5 rounded text-primary focus:ring-2 focus:ring-primary/20"
              />
              <span className="min-w-0 break-words text-sm font-medium">{allergen}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
