import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Flag,
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
import { UserReports } from "../components/profile/UserReports";
import { signOut } from "../services/authService";
import { useUserInfo } from "../context/UserInfoContext";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { id: "overview", label: "Aperçu", icon: Home },
  { id: "profile", label: "Profil", icon: User },
  { id: "orders", label: "Commandes", icon: Package },
  { id: "favorites", label: "Favoris", icon: Heart },
  { id: "addresses", label: "Adresses", icon: MapPin },
  { id: "reports", label: "Signalements", icon: Flag },
  { id: "settings", label: "Paramètres", icon: Settings },
];

export default function Profile() {
  const { user: authUser, profile } = useAuth();
  const { commandes, favorites, addresses: userInfoAddresses } = useUserInfo();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // Plats favoris réels
  const favoriteDishes = favorites || [];

  const userObj = {
    firstName: profile?.nom_complet?.split(" ")[0] || authUser?.email?.split("@")[0] || "Client",
    name: profile?.nom_complet || "Client connecté",
    email: authUser?.email || "",
    phone: profile?.telephone || "Non renseigné",
    address: profile?.localisation || "Non renseignée",
    avatar: profile?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    memberSince: profile?.created_at ? new Date(profile.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : "Récemment",
  };

  const stats = [
    {
      label: "Commandes",
      value: commandes?.length || 0,
      icon: ShoppingBag,
    },
    {
      label: "Favoris",
      value: favorites?.length || 0,
      icon: Heart,
    },
    {
      label: "Note donnée",
      value: "4.8",
      icon: Star,
    },
    {
      label: "Adresses",
      value: userInfoAddresses?.length || 0,
      icon: MapPin,
    },
  ];

  const handleLogout = () => {
    const { error } = signOut();
    if (!error) {
      navigate("/login");
    } else {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background-warm font-poppins">
      <ProfileSidebar
        activeSection={activeSection}
        menuItems={menuItems}
        onLogout={handleLogout}
        onSelectSection={setActiveSection}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        user={userObj}
      />

      <main className="flex-1 lg:ml-64 xl:ml-72">
        <ProfileHeader
          activeSection={activeSection}
          setSidebarOpen={setSidebarOpen}
          user={userObj}
        />

        <div className="mx-auto max-w-400 p-4 sm:p-6">
          {activeSection === "overview" && (
            <ProfileOverview
              addresses={userInfoAddresses || []}
              onSectionChange={setActiveSection}
              orders={commandes || []}
              stats={stats}
              favoriteDishes={favoriteDishes}
            />
          )}

          {activeSection === "profile" && <ProfileForm user={userObj} />}
          {activeSection === "orders" && <OrderHistory />}
          {activeSection === "favorites" && (
            <FavoriteDishes />
          )}
          {activeSection === "addresses" && (
            <AddressBook />
          )}
          {activeSection === "reports" && <UserReports />}
          {activeSection === "settings" && <ProfileSettings />}
        </div>
      </main>
    </div>
  );
}
