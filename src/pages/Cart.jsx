import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";
import { EmptyCart } from "../components/cart/EmptyCart";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const DELIVERY_FEE = 500;

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, loading, updateQuantity, removeItem } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + (cartItems.length > 0 ? DELIVERY_FEE : 0);

  // État de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Utilisateur non connecté
  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center py-16 bg-white rounded-2xl">
          <h2 className="mb-2">Connectez-vous pour voir votre panier</h2>
          <p className="text-muted-foreground mb-6">
            Vous devez être connecté pour gérer votre panier.
          </p>
          <Link
            to="/login"
            className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/plats"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Continuer mes achats
        </Link>

        <h1 className="mb-8">Mon panier ({cartItems.length} articles)</h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className="lg:col-span-1">
              <CartSummary
                subtotal={subtotal}
                deliveryFee={DELIVERY_FEE}
                total={total}
                onCheckout={() => navigate("/checkout")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
