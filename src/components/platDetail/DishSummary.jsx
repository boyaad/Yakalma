import { Clock, MapPin, Star, Users } from "lucide-react";
import { ChefCard } from "./ChefCard";
import { DishMetaCard } from "./DishMetaCard";
import { IngredientsList } from "./IngredientsList";
import { PurchasePanel } from "./PurchasePanel";

export function DishSummary({
  dish,
  isFavorite,
  onAddToCart,
  onDecrease,
  onIncrease,
  onToggleFavorite,
  quantity,
}) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="mb-2 font-poppins text-3xl font-semibold text-foreground">
          {dish.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <span className="inline-flex items-center gap-1 text-foreground">
            <Star className="h-5 w-5 fill-warning text-warning" />
            {dish.rating} ({dish.reviews} avis)
          </span>

          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {dish.distance}
          </span>
        </div>
      </header>

      <ChefCard chef={dish.chef} />

      <p className="text-base leading-7 text-muted-foreground">
        {dish.description}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DishMetaCard icon={Clock} label="Préparation" value={dish.prepTime} />
        <DishMetaCard icon={Users} label="Portions" value={dish.servings} />
      </div>

      <IngredientsList
        ingredients={dish.ingredients}
        allergens={dish.allergens}
      />

      <PurchasePanel
        isFavorite={isFavorite}
        onAddToCart={onAddToCart}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
        onToggleFavorite={onToggleFavorite}
        price={dish.price}
        quantity={quantity}
      />
    </div>
  );
}
