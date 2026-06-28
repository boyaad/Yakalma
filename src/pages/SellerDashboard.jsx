import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  DollarSign,
  ShoppingBag,
  Star,
  TrendingUp,
  Loader2
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
  const { 
    plats, 
    platsLoading, 
    commandes, 
    commandesLoading, 
    refreshPlats, 
    refreshCommandes 
  } = useSeller();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = async (id) => {
    const { error } = await deletePlat(id);
    if (error) {
      console.error("Erreur suppression:", error);
      toast.error("Erreur lors de la suppression");
      return;
    }
    toast.success("Plat supprimé avec succès.");
    await refreshPlats();
  };

  const handleEdit = (id) => {
    navigate(`/seller/edit-dish/${id}`);
  };

  const getActiveSection = () => {
    if (location.pathname.includes("/seller/dishes")) return "dishes";
    if (location.pathname.includes("/seller/orders")) return "orders";
    return "dashboard";
  };

  const activeSection = getActiveSection();

  const getStatusInfo = (status) => {
    const statusMap = {
      active: { text: "Actif", color: "text-primary", bgColor: "bg-primary/10", variant: "active" },
      inactive: { text: "Inactif", color: "text-gray-700", bgColor: "bg-gray-100", variant: "inactive" },
      en_attente: { text: "En attente", color: "text-warning", bgColor: "bg-warning/10", variant: "pending" },
      en_cours: { text: "En préparation", color: "text-info", bgColor: "bg-info/10", variant: "preparing" },
      pret: { text: "Prêt", color: "text-success", bgColor: "bg-success/10", variant: "ready" },
      livre: { text: "Livré", color: "text-success", bgColor: "bg-success/10", variant: "success" },
      annulee: { text: "Annulé", color: "text-error", bgColor: "bg-error/10", variant: "danger" },
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

  // Calculer les statistiques du tableau de bord
  const activePlatsCount = plats ? plats.filter((p) => p.disponibilite).length : 0;
  const totalOrdersCount = commandes ? commandes.length : 0;
  const totalRevenue = commandes
    ? commandes
        .filter((c) => c.order_status === "livre" || c.order_status === "ready")
        .reduce((sum, c) => sum + Number(c.total), 0)
    : 0;

  const allReviews = plats ? plats.flatMap((plat) => plat.avis || []) : [];
  const averageRating = allReviews.length
    ? (allReviews.reduce((sum, review) => sum + Number(review.note || 0), 0) / allReviews.length).toFixed(1)
    : "5.0";

  const dynamicStats = [
    {
      label: "Revenus totaux",
      value: `${totalRevenue.toFixed(0)} FCFA`,
      icon: DollarSign,
      change: "",
      trend: "up",
    },
    {
      label: "Commandes reçues",
      value: totalOrdersCount.toString(),
      icon: ShoppingBag,
      change: "",
      trend: "up",
    },
    {
      label: "Note moyenne",
      value: averageRating,
      icon: Star,
      change: "",
      badgeText: allReviews.length > 0 ? `${allReviews.length} avis` : "0 avis",
      trend: "up",
    },
    {
      label: "Plats actifs",
      value: activePlatsCount.toString(),
      icon: TrendingUp,
      change: "",
      trend: "up",
    },
  ];

  // Enrichir les plats avec les ventes, revenus et avis calculés
  const enrichedDishes = plats
    ? plats.map((p) => {
        let dishOrders = 0;
        let dishRevenue = 0;
        
        if (commandes) {
          commandes.forEach((order) => {
            const isValidSale = order.order_status === "livre" || order.order_status === "ready";
            if (isValidSale && order.ligne_commandes) {
              order.ligne_commandes.forEach((line) => {
                if (line.plat_id === p.id) {
                  dishOrders += line.quantite || 0;
                  dishRevenue += line.sous_total || (line.quantite * (line.plats?.prix || p.prix)) || 0;
                }
              });
            }
          });
        }

        const totalReviews = p.avis ? p.avis.length : 0;
        const rating = totalReviews > 0
          ? parseFloat((p.avis.reduce((sum, a) => sum + a.note, 0) / totalReviews).toFixed(1))
          : 5.0;

        return {
          ...p,
          orders: dishOrders,
          rating: rating,
          reviews: totalReviews,
          revenue: `${dishRevenue} FCFA`,
        };
      })
    : [];

  // Adapter la liste de plats pour le tableau de bord
  const formattedDishes = enrichedDishes.slice(0, 4).map((d) => ({
    id: d.id,
    name: d.titre,
    image: d.image_url,
    price: d.prix,
    status: d.disponibilite ? "active" : "inactive",
    orders: d.orders,
    rating: d.rating,
    reviews: d.reviews,
    revenue: d.revenue,
  }));

  // Adapter les commandes pour l'UI des commandes récentes
  const recentOrdersList = commandes
    ? commandes.slice(0, 5).map((o) => ({
        id: `CMD-${o.id.slice(0, 4).toUpperCase()}`,
        customer: o.customer,
        dish: o.dish,
        quantity: o.quantity,
        total: o.total,
        status: o.order_status,
        time: o.time,
      }))
    : [];

  return (
    <div className="flex min-h-screen bg-background-warm overflow-x-hidden font-poppins">
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
                {dynamicStats.map((stat, index) => (
                  <CardStat
                    key={index}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    change={stat.change}
                    badgeText={stat.badgeText}
                    trend={stat.trend}
                  />
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {commandesLoading ? (
                    <div className="bg-white rounded-xl p-6 text-center border">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground mt-2">Chargement des commandes...</p>
                    </div>
                  ) : (
                    <RecentOrders
                      orders={recentOrdersList}
                      getStatusInfo={getStatusInfo}
                    />
                  )}
                  <TopDishes dishes={formattedDishes} />
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
                <div className="col-span-full py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </div>
              ) : enrichedDishes && enrichedDishes.length !== 0 ? (
                enrichedDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    statusInfo={getStatusInfo(dish.disponibilite ? "active" : "inactive")}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 flex flex-col justify-center items-center gap-4 text-center bg-white rounded-2xl border border-dashed p-6">
                  <p className="text-muted-foreground">Vous n'avez ajouté aucun plat !</p>
                  <Link
                    to="/seller/add-dish"
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent"
                  >
                    Ajouter mon premier plat
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Orders Section */}
          {activeSection === "orders" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {commandesLoading ? (
                <div className="col-span-full py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </div>
              ) : commandes && commandes.length > 0 ? (
                commandes.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusUpdated={refreshCommandes}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed p-6 text-muted-foreground">
                  Aucune commande reçue pour le moment.
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
