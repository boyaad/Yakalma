import { ShoppingBag, ChefHat } from "lucide-react";

export function AccountTypeSelector({ accountType, onChange }) {
  return (
    <div className="mb-6">
      <label className="block mb-3 font-medium">Je suis</label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("acheteur")}
          className={`group p-4 border-2 rounded-xl transition-all ${
            accountType === "acheteur"
              ? "bg-primary text-white border-primary shadow-lg scale-105"
              : "bg-white border-gray-100 hover:border-primary/30"
          }`}
        >
          <ShoppingBag
            className={`w-6 h-6 mx-auto mb-2 ${
              accountType === "acheteur"
                ? "text-primary-foreground"
                : "text-primary"
            }`}
          />
          <div className="font-semibold">Client</div>
          <div className="text-xs opacity-80 mt-1">Commander des plats</div>
        </button>

        <button
          type="button"
          onClick={() => onChange("vendeur")}
          className={`group p-4 border-2 rounded-xl transition-all ${
            accountType === "vendeur"
              ? "bg-primary text-white border-primary shadow-lg scale-105"
              : "bg-white border-gray-100 hover:border-primary/30"
          }`}
        >
          <ChefHat
            className={`w-6 h-6 mx-auto mb-2 ${
              accountType === "vendeur"
                ? "text-primary-foreground"
                : "text-primary"
            }`}
          />
          <div className="font-semibold">Chef</div>
          <div className="text-xs opacity-80 mt-1">Vendre mes plats</div>
        </button>
      </div>
    </div>
  );
}
