import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";
import { EmptyCart } from "../components/cart/EmptyCart";

const initialCartItems = [
  {
    id: 1,
    name: "Couscous Royal",
    chef: "Fatima K.",
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80",
    price: 15,
    quantity: 2,
  },
  {
    id: 2,
    name: "Tajine Poulet Citron",
    chef: "Rachid M.",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80",
    price: 12,
    quantity: 1,
  },
  {
    id: 3,
    name: "Baklava Maison",
    chef: "Karim S.",
    image:
      "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=400&q=80",
    price: 8,
    quantity: 2,
  },
];

const DELIVERY_FEE = 3.5;

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + DELIVERY_FEE;

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
