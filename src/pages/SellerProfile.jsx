import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Mail,
  MapPin,
  Package,
  Phone,
  Star,
  UtensilsCrossed,
  User
} from "lucide-react";

import { DashboardHeader } from "../components/seller/DashboardHeader";
import { SellerSidebar } from "../components/seller/SellerSidebar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useSeller } from "../context/SellerInfoContext";
import { signOut } from "../services/authService";
import { toast } from "react-toastify";
import { supabase } from "../services/supabase";

const seller = {
  name: "Fatima K.",
  role: "Chef vendeur",
  email: "fatima.k@email.com",
  phone: "+33 6 98 76 54 32",
  address: "12 Rue Oberkampf, 75011 Paris",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  speciality: "Cuisine marocaine maison",
  bio: "Je prépare des plats familiaux marocains avec des recettes transmises depuis plusieurs générations.",
  rating: 4.9,
  dishesCount: 12,
  ordersCount: 87,
};

const menuItems = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    path: "/seller/dashboard",
  },
  {
    id: "dishes",
    label: "Mes plats",
    icon: UtensilsCrossed,
    path: "/seller/dishes",
  },
  { id: "orders", label: "Commandes", icon: Package, path: "/seller/orders" },
  { id: "profile", label: "Profil vendeur", icon: User, path: "/seller/profile" },
];

function SellerStat({ icon: Icon, label, value }) {
  return (
    <article className="rounded-xl border border-border-warm bg-white p-4">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </article>
  );
}

export default function SellerProfile() {
  const { user, profile } = useAuth();
  const { plats, commandes } = useSeller();

  const activePlatsCount = plats ? plats.filter((p) => p.disponibilite).length : 0;
  const totalOrdersCount = commandes ? commandes.length : 0;
  const allReviews = plats ? plats.flatMap((plat) => plat.avis || []) : [];
  const averageRating = allReviews.length
    ? (allReviews.reduce((sum, review) => sum + Number(review.note || 0), 0) / allReviews.length).toFixed(1)
    : "5.0";

  const [formData, setFormData] = useState({
    nom_complet: profile?.nom_complet || "",
    email: user?.email || "",
    telephone: profile?.telephone || "",
    localisation: profile?.localisation || "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle profile update logic here
    try {
      const profileChanged =
        formData.nom_complet !== profile.nom_complet ||
        formData.telephone !== profile.telephone ||
        formData.localisation !== profile.localisation;

      const emailChanged =
        formData.email !== user.email;

      if (!profileChanged && !emailChanged) {
        toast.info("Aucune modification détectée.");
        return;
      }

      // Mise à jour du profil
      if (profileChanged) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            nom_complet: formData.nom_complet,
            telephone: formData.telephone,
            localisation: formData.localisation,
          })
          .eq("user_id", user.id);

        if (profileError) throw profileError;
      }

      // Mise à jour de l'email
      if (emailChanged) {
        const { error: emailError } =
          await supabase.auth.updateUser({
            email: formData.email,
            options: {
              emailRedirectTo:
                "http://localhost:5173/seller/dashboard",
            },
          });

        if (emailError) throw emailError;

        toast.info("Consultez votre mail et cliquez sur le lien de confirmation !");
      }

      if (profileChanged && !emailChanged) {
        toast.success("Profil mis à jour avec succès !");
      }

      if (!profileChanged && emailChanged) {
        toast.success("Demande de changement d'email envoyée !");
      }

      if (profileChanged && emailChanged) {
        toast.success(
          "Profil mis à jour et demande de changement d'email envoyée !"
        );
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil: " + error.message);
    }
  };

  const handleLogout = () => {
    const { error } = signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background-warm">
      <SellerSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection="profile"
        menuItems={menuItems}
        onLogout={handleLogout}
      />

      <main className="flex-1 lg:ml-64 xl:ml-72">
        <DashboardHeader
          activeSection="profile"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="mx-auto max-w-400 p-4 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <section className="rounded-2xl border border-border-warm bg-white p-6">
              <div className="text-center">
                <img
                  src={profile?.avatar || seller.avatar}
                  alt={profile?.nom_complet || seller.name}
                  className="mx-auto mb-5 h-28 w-28 rounded-full object-cover ring-4 ring-primary/20"
                />
                <h1 className="text-2xl font-semibold text-foreground">
                  {profile?.nom_complet || seller.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {profile?.role || seller.role}
                </p>
              </div>
            </section>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SellerStat icon={Star} label="Note moyenne" value={averageRating} />
                <SellerStat
                  icon={UtensilsCrossed}
                  label="Plats actifs"
                  value={activePlatsCount}
                />
                <SellerStat
                  icon={Package}
                  label="Commandes"
                  value={totalOrdersCount}
                />
              </div>

              <form onSubmit={handleSubmit} className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold">
                    Informations vendeur
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ces informations sont séparées du profil client.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Input
                    id="seller-name"
                    label="Nom"
                    value={formData.nom_complet}
                    icon={<User className="h-5 w-5" />}
                    onChange={(e) => setFormData({ ...formData, nom_complet: e.target.value })}
                  />
                  <Input
                    id="seller-email"
                    label="Email"
                    value={formData.email}
                    icon={<Mail className="h-5 w-5" />}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input
                    id="seller-phone"
                    label="Téléphone"
                    value={formData.telephone}
                    icon={<Phone className="h-5 w-5" />}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                  <Input
                    id="seller-address"
                    label="Adresse de cuisine"
                    value={formData.localisation}
                    icon={<MapPin className="h-5 w-5" />}
                    onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="mt-6 px-6 py-3"
                >
                  Enregistrer les modifications
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
