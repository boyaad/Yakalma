import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  DollarSign,
  ShoppingBag,
  Star,
  TrendingUp,
} from "lucide-react";

import { SellerSidebar } from "../components/seller/SellerSidebar";
import { DashboardHeader } from "../components/seller/DashboardHeader";
import CardStat from "../components/ui/CardStat";
import { RecentOrders } from "../components/seller/RecentOrders";
import { TopDishes } from "../components/seller/TopDishes";
import { QuickActions } from "../components/seller/QuickActions";
import { PerformanceCard } from "../components/seller/PerformanceCard";
import { DishCard } from "../components/seller/DishCard";
import { OrderCard } from "../components/seller/OrderCard";
import { signOut } from "../services/authService";
import { useSeller } from "../context/SellerInfoContext";
import { deletePlat } from "../services/platService";
import { toast } from "react-toastify";

const stats = [
  {
    label: "Revenus du mois",
    value: "1 240€",
    icon: DollarSign,
    change: "+12%",
    trend: "up",
  },
  {
    label: "Commandes totales",
    value: "87",
    icon: ShoppingBag,
    change: "+8%",
    trend: "up",
  },
  {
    label: "Note moyenne",
    value: "4.8",
    icon: Star,
    change: "+0.2",
    trend: "up",
  },
  {
    label: "Plats actifs",
    value: "12",
    icon: TrendingUp,
    change: "+2",
    trend: "up",
  },
];

const dishes = [
  {
    id: 1,
    name: "Couscous Royal",
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80",
    price: 15,
    status: "active",
    orders: 45,
    rating: 4.8,
    reviews: 38,
    revenue: "675€",
  },
  {
    id: 2,
    name: "Tajine Poulet Citron",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80",
    price: 12,
    status: "active",
    orders: 32,
    rating: 4.9,
    reviews: 29,
    revenue: "384€",
  },
  {
    id: 3,
    name: "Pastilla au Poulet",
    image:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80",
    price: 18,
    status: "inactive",
    orders: 10,
    rating: 5.0,
    reviews: 8,
    revenue: "180€",
  },
  {
    id: 4,
    name: "Baklava Maison",
    image:
      "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=400&q=80",
    price: 8,
    status: "active",
    orders: 28,
    rating: 4.7,
    reviews: 22,
    revenue: "224€",
  },
];

const recentOrders = [
  {
    id: "CMD-045",
    customer: "Marie L.",
    dish: "Couscous Royal",
    quantity: 2,
    total: 30,
    status: "pending",
    time: "Il y a 5 min",
  },
  {
    id: "CMD-044",
    customer: "Ahmed B.",
    dish: "Tajine Poulet Citron",
    quantity: 1,
    total: 12,
    status: "preparing",
    time: "Il y a 12 min",
  },
  {
    id: "CMD-043",
    customer: "Sophie M.",
    dish: "Baklava Maison",
    quantity: 3,
    total: 24,
    status: "ready",
    time: "Il y a 18 min",
  },
];

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
];

export default function SellerDashboard() {
  const { plats, platsLoading } = useSeller();
  const handleDelete = async (id) => {
    const { error } = await deletePlat(id);
    if (error) {
      console.error("Erreur suppression:", error);
      toast.error("Erreur lors de la suppression");
      return;
    }
    // Rafraîchir la page pour voir les changements
    window.location.reload();
  };
  const handleEdit = (id) => {
    navigate(`/seller/edit-dish/${id}`);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveSection = () => {
    if (location.pathname.includes("/seller/dishes")) return "dishes";
    if (location.pathname.includes("/seller/orders")) return "orders";
    return "dashboard";
  };

  const activeSection = getActiveSection();

  const getStatusInfo = (status) => {
    const statusMap = {
      active: {
        text: "Actif",
        color: "text-primary",
        bgColor: "bg-primary/10",
      },
      inactive: {
        text: "Inactif",
        color: "text-gray-700",
        bgColor: "bg-gray-100",
      },
      pending: {
        text: "En attente",
        color: "text-amber-700",
        bgColor: "bg-warning/10",
      },
      preparing: {
        text: "En préparation",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
      ready: { text: "Prête", color: "text-primary", bgColor: "bg-primary/10" },
    };
    return statusMap[status] || statusMap.active;
  };

  const handleLogout = () => {
    const { error } = signOut();
    if (!error) {
      navigate("/login");
    } else {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background-warm overflow-x-hidden">
      {/* Sidebar */}
      <SellerSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        menuItems={menuItems}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 xl:ml-72">
        {/* Header */}
        <DashboardHeader
          activeSection={activeSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content Area */}
        <div className="p-4 sm:p-6 max-w-400 mx-auto">
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <CardStat
                    key={index}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    change={stat.change}
                    trend={stat.trend}
                  />
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  <RecentOrders
                    orders={recentOrders}
                    getStatusInfo={getStatusInfo}
                  />
                  <TopDishes dishes={dishes} />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <QuickActions />
                  <PerformanceCard />
                </div>
              </div>
            </div>
          )}

          {/* Dishes Section */}
          {activeSection === "dishes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {platsLoading ? (
                <div className="flex justify-center items-center border">
                  <p className="text-center">Chargement des plats...</p>
                </div>
              ) : plats.length !== 0 ? (
                plats.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    statusInfo={getStatusInfo(dish.status)}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))
              ) : (
                <div className="w-full mx-auto flex flex-col justify-center items-center gap-2 text-center">
                  <p>Vous n'avez ajouté aucun plat !</p>
                  <Link
                    to="/seller/add-dish"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
                  >
                    Ajouter un plat
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Orders Section */}
          {activeSection === "orders" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {recentOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  statusInfo={getStatusInfo(order.status)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
