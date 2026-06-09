import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OrderHistory } from "../components/profile/OrderHistory";
import { ProfileForm } from "../components/profile/ProfileForm";
import { ProfileSettings } from "../components/profile/ProfileSettings";
import { ProfileSidebar } from "../components/profile/ProfileSidebar";

const user = {
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
  },
  {
    id: "CMD-002",
    date: "25 Mai 2026",
    status: "delivered",
    total: 28,
    items: 2,
  },
  {
    id: "CMD-003",
    date: "20 Mai 2026",
    status: "delivered",
    total: 35,
    items: 2,
  },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background-warm py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Mon profil</h1>
          <Link
            to="/SellerDashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au dashboard
          </Link>
        </div>

        <div className="space-y-6">
          <ProfileSidebar
            user={user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === "profile" && <ProfileForm user={user} />}
          {activeTab === "orders" && <OrderHistory orders={orders} />}
          {activeTab === "settings" && <ProfileSettings />}
        </div>
      </div>
    </div>
  );
}
