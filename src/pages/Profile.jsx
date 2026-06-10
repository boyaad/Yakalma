import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Home,
  MapPin,
  Package,
  Settings,
  ShoppingBag,
  Star,
  User,
} from "lucide-react";

import { AddressBook } from "../components/profile/AddressBook";
import { FavoriteDishes } from "../components/profile/FavoriteDishes";
import { OrderHistory } from "../components/profile/OrderHistory";
import { ProfileForm } from "../components/profile/ProfileForm";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileOverview } from "../components/profile/ProfileOverview";
import { ProfileSettings } from "../components/profile/ProfileSettings";
import { ProfileSidebar } from "../components/profile/ProfileSidebar";
import { allDishes } from "../data/Dishes";

const user = {
  firstName: "Marie",
  name: "Marie Dubois",
  email: "marie.dubois@email.com",
  phone: "+33 6 12 34 56 78",
  address: "45 Rue de la République, 75011 Paris",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  memberSince: "Janvier 2024",
};

const orders = [
  {
    id: "CMD-001",
    date: "28 Mai 2026",
    status: "delivered",
    total: 42,
    items: 3,
    summary: "Couscous Royal, Baklava Maison et Salade Orientale",
  },
  {
    id: "CMD-002",
    date: "25 Mai 2026",
    status: "delivered",
    total: 28,
    items: 2,
    summary: "Tajine Poulet Citron et Harira Traditionnelle",
  },
  {
    id: "CMD-003",
    date: "20 Mai 2026",
    status: "pending",
    total: 35,
    items: 2,
    summary: "Pastilla au Poulet et Mezze Libanais",
  },
];

const addresses = [
  {
    id: 1,
    label: "Maison",
    address: "45 Rue de la République, 75011 Paris",
    isDefault: true,
  },
  {
    id: 2,
    label: "Bureau",
    address: "18 Avenue Parmentier, 75011 Paris",
    isDefault: false,
  },
];

const menuItems = [
  { id: "overview", label: "Aperçu", icon: Home },
  { id: "profile", label: "Profil", icon: User },
  { id: "orders", label: "Commandes", icon: Package },
  { id: "favorites", label: "Favoris", icon: Heart },
  { id: "addresses", label: "Adresses", icon: MapPin },
  { id: "settings", label: "Paramètres", icon: Settings },
];

export default function Profile() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const favoriteDishes = allDishes.slice(0, 3);

  const stats = [
    {
      label: "Commandes",
      value: orders.length,
      icon: ShoppingBag,
      badge: "+1",
    },
    {
      label: "Favoris",
      value: favoriteDishes.length,
      icon: Heart,
    },
    {
      label: "Note donnée",
      value: "4.8",
      icon: Star,
    },
    {
      label: "Adresses",
      value: addresses.length,
      icon: MapPin,
    },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background-warm">
      <ProfileSidebar
        activeSection={activeSection}
        menuItems={menuItems}
        onLogout={handleLogout}
        onSelectSection={setActiveSection}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        user={user}
      />

      <main className="flex-1 lg:ml-64 xl:ml-72">
        <ProfileHeader
          activeSection={activeSection}
          setSidebarOpen={setSidebarOpen}
          user={user}
        />

        <div className="mx-auto max-w-[1600px] p-4 sm:p-6">
          {activeSection === "overview" && (
            <ProfileOverview
              addresses={addresses}
              favoriteDishes={favoriteDishes}
              onSectionChange={setActiveSection}
              orders={orders}
              stats={stats}
            />
          )}

          {activeSection === "profile" && <ProfileForm user={user} />}
          {activeSection === "orders" && <OrderHistory orders={orders} />}
          {activeSection === "favorites" && (
            <FavoriteDishes dishes={favoriteDishes} />
          )}
          {activeSection === "addresses" && (
            <AddressBook addresses={addresses} />
          )}
          {activeSection === "settings" && <ProfileSettings />}
        </div>
      </main>
    </div>
  );
}
