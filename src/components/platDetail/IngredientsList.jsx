export function IngredientsList({ ingredients, allergens }) {
  return (
    <section>
      <h2 className="mb-3 font-poppins text-xl font-semibold text-foreground">
        Ingrédients
      </h2>

      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient) => (
          <span
            key={ingredient}
            className="rounded-full border border-border-warm bg-white px-3 py-1 text-sm text-foreground"
          >
            {ingredient}
          </span>
        ))}
      </div>

      {allergens.length > 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          Allergènes: {allergens.join(", ")}
        </p>
      )}
    </section>
  );
}
