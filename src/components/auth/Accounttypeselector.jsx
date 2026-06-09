import { ShoppingBag, ChefHat } from "lucide-react";

export function AccountTypeSelector({ accountType, onChange }) {
  return (
    <div className="mb-6">
      <label className="block mb-3 font-medium">Je suis</label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("customer")}
          className={`group p-4 border-2 rounded-xl transition-all ${
            accountType === "customer"
              ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
              : "bg-white border-border hover:border-primary/30"
          }`}
        >
          <ShoppingBag
            className={`w-6 h-6 mx-auto mb-2 ${
              accountType === "customer"
                ? "text-primary-foreground"
                : "text-primary"
            }`}
          />
          <div className="font-semibold">Client</div>
          <div className="text-xs opacity-80 mt-1">Commander des plats</div>
        </button>

        <button
          type="button"
          onClick={() => onChange("seller")}
          className={`group p-4 border-2 rounded-xl transition-all ${
            accountType === "seller"
              ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
              : "bg-white border-border hover:border-primary/30"
          }`}
        >
          <ChefHat
            className={`w-6 h-6 mx-auto mb-2 ${
              accountType === "seller"
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
