import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, MapPin, Plus, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useUserInfo } from "../context/UserInfoContext";
import { checkoutCartToOrder } from "../services/orderService";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { formatFcfa } from "../utils/currency";
import { toast } from "react-toastify";

const DELIVERY_FEE = 500;

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, loading: cartLoading, emptyCart } = useCart();
  const { addresses: savedAddresses, addressesLoading, refreshCommandes } = useUserInfo();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  // États du formulaire de nouvelle adresse
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddressLoc, setNewAddressLoc] = useState("");

  // États du formulaire de paiement
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // États des erreurs de validation
  const [errors, setErrors] = useState({});

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + DELIVERY_FEE;

  // Initialisation de l'adresse par défaut
  React.useEffect(() => {
    if (savedAddresses && savedAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [savedAddresses, selectedAddressId]);

  if (cartLoading || addressesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center py-16 bg-white rounded-2xl shadow-sm">
          <h2 className="mb-2">Connexion requise</h2>
          <p className="text-muted-foreground mb-6">
            Vous devez être connecté pour passer une commande.
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center py-16 bg-white rounded-2xl shadow-sm">
          <h2 className="mb-2">Votre panier est vide</h2>
          <p className="text-muted-foreground mb-6">
            Veuillez ajouter des plats à votre panier avant de commander.
          </p>
          <Link
            to="/plats"
            className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors"
          >
            Voir les plats
          </Link>
        </div>
      </div>
    );
  }

  // Formatage des inputs de carte
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let matches = value.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || "";
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation adresse
    if (showNewAddressForm) {
      if (!newAddressLabel.trim()) newErrors.newAddressLabel = "Le nom de l'adresse est requis (ex: Maison)";
      if (!newAddressLoc.trim()) newErrors.newAddressLoc = "L'adresse de livraison est requise";
    } else if (!selectedAddressId && (!savedAddresses || savedAddresses.length === 0)) {
      newErrors.address = "Veuillez renseigner une adresse de livraison";
    }

    // Validation paiement
    if (!cardName.trim()) newErrors.cardName = "Le nom du titulaire est requis";
    if (cardNumber.replace(/\s/g, "").length !== 16) newErrors.cardNumber = "Numéro de carte invalide (16 chiffres requis)";
    if (!cardExpiry.includes("/") || cardExpiry.replace("/", "").length !== 4) {
      newErrors.cardExpiry = "Date d'expiration invalide (MM/AA requis)";
    }
    if (cardCvv.length !== 3) newErrors.cardCvv = "CVV invalide (3 chiffres requis)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayAndOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Veuillez remplir correctement les champs requis.");
      return;
    }

    setCheckoutLoading(true);

    try {
      let label = "";
      let localisation = "";

      if (showNewAddressForm) {
        label = newAddressLabel.trim();
        localisation = newAddressLoc.trim();
      } else {
        const selectedAddr = savedAddresses.find(a => a.id === selectedAddressId);
        if (selectedAddr) {
          label = selectedAddr.label;
          localisation = selectedAddr.localisation;
        }
      }

      // Yakalma commande : on utilise l'id du premier plat vendeur_id par défaut s'il n'est pas passé
      const firstItemVendeurId = cartItems[0]?.vendeurId;

      await checkoutCartToOrder(
        user.id,
        total,
        firstItemVendeurId,
        label,
        localisation
      );

      // Rafraîchir le panier contextuel localement
      await emptyCart();

      // Rafraîchir l'historique des commandes dans le context utilisateur
      if (refreshCommandes) {
        await refreshCommandes();
      }

      toast.success("Votre commande a été validée avec succès !");
      
      // Attendre un peu puis rediriger
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la validation de la commande:", error);
      toast.error(error.message || "Une erreur est survenue lors de la commande.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-warm px-3 py-6 font-poppins sm:px-6 sm:py-8 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/panier"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au panier
        </Link>

        <h1 className="mb-6 text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl">Validation de la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaires d'Adresse et de Paiement */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section 1 : Adresse de Livraison */}
            <div className="bg-white rounded-2xl p-4 border border-border-warm shadow-sm sm:p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <MapPin className="text-primary w-5 h-5" />
                1. Adresse de livraison
              </h2>

              {/* Choix des adresses enregistrées */}
              {savedAddresses && savedAddresses.length > 0 && !showNewAddressForm && (
                <div className="space-y-3 mb-4">
                  {savedAddresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedAddressId === addr.id
                          ? "border-primary bg-primary/5"
                          : "border-border-warm hover:bg-background-warm/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                              Par défaut
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{addr.localisation}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Bouton pour basculer formulaire d'adresse */}
              {!showNewAddressForm ? (
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className="flex items-center gap-2 text-primary hover:text-accent font-semibold text-sm transition-colors mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Utiliser une nouvelle adresse
                </button>
              ) : (
                <div className="space-y-4 border-t border-border-warm pt-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold text-foreground">Nouvelle adresse de livraison</h3>
                    {savedAddresses && savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        Sélectionner une adresse enregistrée
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nom de l'adresse (ex: Maison, Bureau)"
                      placeholder="Maison"
                      value={newAddressLabel}
                      onChange={(e) => setNewAddressLabel(e.target.value)}
                      error={errors.newAddressLabel}
                    />
                    <Input
                      label="Adresse complète"
                      placeholder="123 Rue Principale, Dakar"
                      value={newAddressLoc}
                      onChange={(e) => setNewAddressLoc(e.target.value)}
                      error={errors.newAddressLoc}
                    />
                  </div>
                </div>
              )}
              {errors.address && (
                <p className="text-error text-sm font-medium mt-2">{errors.address}</p>
              )}
            </div>

            {/* Section 2 : Mode de paiement */}
            <div className="bg-white rounded-2xl p-4 border border-border-warm shadow-sm sm:p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <CreditCard className="text-primary w-5 h-5" />
                2. Paiement par carte (Simulé)
              </h2>

              <form onSubmit={handlePayAndOrder} className="space-y-4">
                <Input
                  label="Nom complet sur la carte"
                  placeholder="Marie Dubois"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  error={errors.cardName}
                />

                <Input
                  label="Numéro de carte"
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  error={errors.cardNumber}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Date d'expiration"
                    placeholder="MM/AA"
                    maxLength="5"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    error={errors.cardExpiry}
                  />
                  <Input
                    label="CVV"
                    placeholder="123"
                    maxLength="3"
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                    error={errors.cardCvv}
                  />
                </div>

                <div className="border-t border-border-warm pt-6 mt-6 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={checkoutLoading}
                    className="w-full px-5 py-3.5 text-base font-semibold md:w-auto md:px-8 md:text-lg"
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      `Payer et commander (${formatFcfa(total)})`
                    )}
                  </Button>
                </div>
              </form>
            </div>

          </div>

          {/* Résumé de commande */}
          <div className="lg:col-span-1">
            <aside className="bg-white rounded-2xl p-4 border border-border-warm shadow-sm lg:sticky lg:top-24 space-y-6 sm:p-6">
              <h3 className="text-lg font-bold text-foreground">Résumé des plats</h3>

              <div className="space-y-4 divide-y divide-border-warm max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pt-4 first:pt-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground truncate">Chef: {item.chef}</p>
                      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">Qté: {item.quantity}</span>
                        <span className="font-semibold text-primary text-sm">{formatFcfa(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border-warm pt-4 space-y-2">
                <div className="flex justify-between gap-3 text-sm text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{formatFcfa(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-3 text-sm text-muted-foreground">
                  <span>Frais de livraison</span>
                  <span>{formatFcfa(DELIVERY_FEE)}</span>
                </div>
                <div className="flex justify-between gap-3 font-bold text-foreground text-lg border-t border-border-warm pt-3 mt-2">
                  <span>Total</span>
                  <span className="text-primary">{formatFcfa(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
