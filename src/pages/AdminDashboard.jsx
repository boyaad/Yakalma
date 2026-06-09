import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import {
  DashboardPreview,
  SellerPreviewRow,
  UserPreviewRow,
} from "../components/admin/DashboardPreview";
import { DishAdminCard } from "../components/admin/DishAdminCard";
import { OrderCard } from "../components/admin/OrderCard";
import { QuickStatCard } from "../components/admin/QuickStatCard";
import { ReportCard } from "../components/admin/ReportCard";
import { SellerAdminCard } from "../components/admin/SellerAdminCard";
import { StatCard } from "../components/admin/StatCard";
import { UserCard } from "../components/admin/UserCard";
import {
  dishes,
  menuItems,
  orders,
  quickStats,
  reports,
  sellers,
  stats,
  users,
} from "../data/adminDashboardData";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <AdminSidebar
        activeSection={activeSection}
        menuItems={menuItems}
        onLogout={handleLogout}
        onSelectSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 lg:ml-64 xl:ml-72">
        <AdminHeader
          activeSection={activeSection}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
          {activeSection === "dashboard" && (
            <DashboardSection setActiveSection={setActiveSection} />
          )}

          {activeSection === "users" && (
            <CardsGrid>
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </CardsGrid>
          )}

          {activeSection === "sellers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellers.map((seller) => (
                <SellerAdminCard key={seller.id} seller={seller} />
              ))}
            </div>
          )}

          {activeSection === "dishes" && (
            <CardsGrid>
              {dishes.map((dish) => (
                <DishAdminCard key={dish.id} dish={dish} />
              ))}
            </CardsGrid>
          )}

          {activeSection === "orders" && (
            <CardsGrid>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </CardsGrid>
          )}

          {activeSection === "reports" && (
            <CardsGrid>
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </CardsGrid>
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardSection({ setActiveSection }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((item) => (
          <QuickStatCard key={item.label} item={item} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <DashboardPreview
          title="Utilisateurs récents"
          actionLabel="Voir tout"
          onAction={() => setActiveSection("users")}
        >
          {users.map((user) => (
            <UserPreviewRow key={user.id} user={user} />
          ))}
        </DashboardPreview>

        <DashboardPreview
          title="Meilleurs vendeurs"
          actionLabel="Voir tout"
          onAction={() => setActiveSection("sellers")}
        >
          {sellers.slice(0, 4).map((seller) => (
            <SellerPreviewRow key={seller.id} seller={seller} />
          ))}
        </DashboardPreview>
      </div>
    </div>
  );
}

function CardsGrid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {children}
    </div>
  );
}
