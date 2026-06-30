import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import {
  DashboardPreview,
  SellerPreviewRow,
  UserPreviewRow,
} from "../components/admin/DashboardPreview";
import { DishAdminCard } from "../components/admin/DishAdminCard";
import OrdersTable from "../components/admin/OrdersTable";
import OrderDetailModal from "../components/admin/OrderDetailModal";
import CardStat from "../components/ui/CardStat";
import ReportsTable from "../components/admin/ReportsTable";
import ReportDetailModal from "../components/admin/ReportDetailModal";
import UsersTable from "../components/admin/UsersTable";
import UserDetailModal from "../components/admin/UserDetailModal";
import SellersTable from "../components/admin/SellersTable";
import SellerDetailModal from "../components/admin/SellerDetailModal";
import { useAdmin } from "../context/AdminInfoContext";
import { signOut } from "../services/authService";
import { menuItems } from "../data/adminDashboardData";
import {
  Users,
  ChefHat,
  Package,
  DollarSign,
  AlertCircle,
  Flag,
} from "lucide-react";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [sellerModalOpen, setSellerModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [dishesPage, setDishesPage] = useState(0);
  const dishesPerPage = 6;
  const navigate = useNavigate();

  const {
    users,
    usersLoading,
    sellers,
    sellersLoading,
    plats,
    platsLoading,
    commandes,
    commandesLoading,
    signalements,
    signalementsLoading,
    stats,
    recentUsers,
    topSellers,
    updateUserStatus,
    updateReportStatus,
    actionLoading,
  } = useAdmin();

  const totalDishesPages = useMemo(() => Math.ceil(plats.length / dishesPerPage), [plats, dishesPerPage]);
  const paginatedDishes = useMemo(
    () => plats.slice(dishesPage * dishesPerPage, (dishesPage + 1) * dishesPerPage),
    [plats, dishesPage, dishesPerPage]
  );

  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    setDishesPage(0);
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleViewSeller = (seller) => {
    setSelectedSeller(seller);
    setSellerModalOpen(true);
  };

  const handleToggleStatus = (entity) => {
    const newStatus = entity.status === "active" || entity.status === "verified" ? "suspended" : "active";
    updateUserStatus(entity.user_id || entity.id, newStatus);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setReportModalOpen(true);
  };

  const handleUpdateReportStatus = (reportId, newStatus, responseText) => {
    updateReportStatus(reportId, newStatus, responseText);
  };

  const handleResolveReport = (report) => {
    updateReportStatus(report.id, "resolved");
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate("/login");
    } else {
      console.error("Erreur lors de la déconnexion :", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <AdminSidebar
        activeSection={activeSection}
        menuItems={menuItems}
        onLogout={handleLogout}
        onSelectSection={handleSectionChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="min-w-0 flex-1 lg:ml-64 xl:ml-72">
        <AdminHeader
          activeSection={activeSection}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="mx-auto w-full max-w-[1600px] p-3 sm:p-6">
          {activeSection === "dashboard" && (
            <DashboardSection setActiveSection={setActiveSection} />
          )}

          {activeSection === "users" && (
            <SectionLoading loading={usersLoading}>
              <UsersTable
                users={users}
                onView={handleViewUser}
                onToggleStatus={handleToggleStatus}
                actionLoading={actionLoading}
              />
            </SectionLoading>
          )}

          <UserDetailModal
            user={selectedUser}
            isOpen={userModalOpen}
            onClose={() => setUserModalOpen(false)}
          />

          <SellerDetailModal
            seller={selectedSeller}
            isOpen={sellerModalOpen}
            onClose={() => setSellerModalOpen(false)}
          />

          {activeSection === "sellers" && (
            <SectionLoading loading={sellersLoading}>
              <SellersTable
                sellers={sellers}
                onView={handleViewSeller}
                onToggleStatus={handleToggleStatus}
                actionLoading={actionLoading}
              />
            </SectionLoading>
          )}

          {activeSection === "dishes" && (
            <SectionLoading loading={platsLoading}>
              {paginatedDishes.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">Aucun plat trouvé.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedDishes.map((dish) => (
                      <DishAdminCard key={dish.id} dish={dish} />
                    ))}
                  </div>
                  {totalDishesPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <button
                        onClick={() => setDishesPage((p) => Math.max(0, p - 1))}
                        disabled={dishesPage === 0}
                        className="p-2 rounded-lg border border-border-warm hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: totalDishesPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setDishesPage(i)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            dishesPage === i
                              ? "bg-primary text-white"
                              : "border border-border-warm hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setDishesPage((p) => Math.min(totalDishesPages - 1, p + 1))}
                        disabled={dishesPage >= totalDishesPages - 1}
                        className="p-2 rounded-lg border border-border-warm hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </SectionLoading>
          )}

          {activeSection === "orders" && (
            <SectionLoading loading={commandesLoading}>
              <OrdersTable orders={commandes} onView={handleViewOrder} />
            </SectionLoading>
          )}

          <OrderDetailModal
            order={selectedOrder}
            isOpen={orderModalOpen}
            onClose={() => setOrderModalOpen(false)}
          />

          {activeSection === "reports" && (
            <SectionLoading loading={signalementsLoading}>
              <ReportsTable
                reports={signalements}
                onView={handleViewReport}
                onResolve={handleResolveReport}
                actionLoading={actionLoading}
              />
            </SectionLoading>
          )}

          <ReportDetailModal
            report={selectedReport}
            isOpen={reportModalOpen}
            onClose={() => setReportModalOpen(false)}
            onUpdateStatus={handleUpdateReportStatus}
            actionLoading={actionLoading}
          />
        </div>
      </main>
    </div>
  );
}

function DashboardSection({ setActiveSection }) {
  const { users, commandes, signalements, sellers, recentUsers, topSellers, usersLoading, commandesLoading, signalementsLoading, sellersLoading } = useAdmin();
  const isLoading = usersLoading || commandesLoading || signalementsLoading || sellersLoading;

  const now = useMemo(() => new Date(), []);
  const startOfMonth = useMemo(() => new Date(now.getFullYear(), now.getMonth(), 1), [now]);
  const startOfDay = useMemo(() => new Date(now.getFullYear(), now.getMonth(), now.getDate()), [now]);

  const statCards = useMemo(() => {
    const totalUsers = users.length;
    const totalChefs = users.filter((u) => u.role === "vendeur").length;
    const monthlyOrders = commandes.filter((c) => new Date(c.rawDate) >= startOfMonth).length;
    const monthlyRevenue = commandes
      .filter((c) => {
        const d = new Date(c.rawDate);
        const paid = c.status === "livre" || c.status === "delivered" || c.status === "ready";
        return d >= startOfMonth && paid;
      })
      .reduce((sum, c) => sum + c.total, 0);

    return [
      {
        label: "Utilisateurs totaux",
        value: String(totalUsers),
        icon: Users,
        change: "",
        color: "bg-primary/10",
        iconColor: "text-primary",
      },
      {
        label: "Chefs actifs",
        value: String(totalChefs),
        icon: ChefHat,
        change: "",
        color: "bg-warning/10",
        iconColor: "text-warning",
      },
      {
        label: "Commandes du mois",
        value: String(monthlyOrders),
        icon: Package,
        change: "",
        color: "bg-primary/10",
        iconColor: "text-primary",
      },
      {
        label: "Revenus du mois",
        value: `${monthlyRevenue.toFixed(0)} FCFA`,
        icon: DollarSign,
        change: "",
        color: "bg-warning/10",
        iconColor: "text-warning",
      },
    ];
  }, [users, commandes, startOfMonth]);

  const quickStatItems = useMemo(() => {
    const newToday = users.filter((u) => {
      const d = new Date(u.created_at);
      return d >= startOfDay;
    }).length;
    const activeReports = signalements.filter(
      (r) => r.status === "open" || r.status === "en_cours" || r.status === "investigating"
    ).length;
    const pendingValidations = sellers.filter((s) => s.status === "pending").length;

    return [
      {
        label: "Nouveaux aujourd'hui",
        value: String(newToday),
        icon: Users,
        className: "bg-primary/5 border-primary/20 text-primary",
      },
      {
        label: "En attente validation",
        value: String(pendingValidations),
        icon: AlertCircle,
        className: "bg-warning/10 border-warning/20 text-warning",
      },
      {
        label: "Signalements actifs",
        value: String(activeReports),
        icon: Flag,
        className: "bg-error/10 border-error/20 text-error",
      },
    ];
  }, [users, signalements, sellers, startOfDay]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {statCards.map((stat) => (
          <CardStat
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            iconBg={stat.color}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStatItems.map((item) => (
          <CardStat
            key={item.label}
            label={item.label}
            value={item.value}
            icon={item.icon}
            className={item.className}
            layout="horizontal"
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <DashboardPreview
          title="Utilisateurs récents"
          actionLabel="Voir tout"
          onAction={() => setActiveSection("users")}
        >
          {recentUsers.map((user) => (
            <UserPreviewRow key={user.id} user={user} />
          ))}
        </DashboardPreview>

        <DashboardPreview
          title="Meilleurs vendeurs"
          actionLabel="Voir tout"
          onAction={() => setActiveSection("sellers")}
        >
          {topSellers.map((seller) => (
            <SellerPreviewRow key={seller.id} seller={seller} />
          ))}
        </DashboardPreview>
      </div>
    </div>
  );
}

function SectionLoading({ loading, children }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  return children;
}
