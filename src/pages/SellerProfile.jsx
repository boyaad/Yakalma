import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChefHat,
  LayoutDashboard,
  Mail,
  MapPin,
  Package,
  Phone,
  Star,
  UtensilsCrossed,
  User,
} from "lucide-react";

import { DashboardHeader } from "../components/seller/DashboardHeader";
import { SellerSidebar } from "../components/seller/SellerSidebar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

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
    path: "/SellerDashboard",
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
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

        <div className="mx-auto max-w-[1600px] p-4 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <section className="rounded-2xl border border-border-warm bg-white p-6">
              <div className="text-center">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="mx-auto mb-5 h-28 w-28 rounded-full object-cover ring-4 ring-primary/20"
                />
                <h1 className="text-2xl font-semibold text-foreground">
                  {seller.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {seller.role}
                </p>
                <p className="mt-4 rounded-xl bg-background-warm px-4 py-3 text-sm font-medium text-primary">
                  {seller.speciality}
                </p>
              </div>
            </section>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SellerStat icon={Star} label="Note moyenne" value={seller.rating} />
                <SellerStat
                  icon={UtensilsCrossed}
                  label="Plats actifs"
                  value={seller.dishesCount}
                />
                <SellerStat
                  icon={Package}
                  label="Commandes"
                  value={seller.ordersCount}
                />
              </div>

              <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
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
                    defaultValue={seller.name}
                    icon={<User className="h-5 w-5" />}
                    readOnly
                  />
                  <Input
                    id="seller-email"
                    label="Email"
                    type="email"
                    defaultValue={seller.email}
                    icon={<Mail className="h-5 w-5" />}
                    readOnly
                  />
                  <Input
                    id="seller-phone"
                    label="Téléphone"
                    type="tel"
                    defaultValue={seller.phone}
                    icon={<Phone className="h-5 w-5" />}
                    readOnly
                  />
                  <Input
                    id="seller-speciality"
                    label="Spécialité"
                    defaultValue={seller.speciality}
                    icon={<ChefHat className="h-5 w-5" />}
                    readOnly
                  />
                </div>

                <div className="mt-5">
                  <Input
                    id="seller-address"
                    label="Adresse de cuisine"
                    defaultValue={seller.address}
                    icon={<MapPin className="h-5 w-5" />}
                    readOnly
                  />
                </div>

                <div className="mt-5">
                  <Input
                    id="seller-bio"
                    label="Présentation"
                    as="textarea"
                    rows={4}
                    defaultValue={seller.bio}
                  />
                </div>

                <Button
                  type="button"
                  variant="primary"
                  className="mt-6 px-6 py-3"
                >
                  Enregistrer les modifications
                </Button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
