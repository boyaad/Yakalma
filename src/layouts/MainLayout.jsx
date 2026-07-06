import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { useOrderNotifications } from "../hooks/useOrderNotifications";
import { useUserInfo } from "../context/UserInfoContext";
import { ActiveOrderFloatingIndicator } from "../components/profile/ActiveOrderFloatingIndicator";

function MainLayout() {
  useOrderNotifications();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { commandes } = useUserInfo() || {};

  const hideFooter =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/dashboard" ||
    pathname === "/SellerDashboard" ||
    pathname === "/profile" ||
    pathname === "/panier" ||
    pathname === "/checkout" ||
    pathname === "/favoris" ||
    pathname === "/create-profile" ||
    pathname === "/plats" ||
    /^\/plats\/[^/]+$/.test(pathname) ||
    pathname.startsWith("/seller/");
    const hideNavbar =
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/create-profile" ||
    pathname === "/register" ||
    pathname === "/dashboard" ||
    pathname === "/SellerDashboard" ||
    pathname === "/profile" ||
    pathname.startsWith("/seller/");

  return (
    <div className="min-h-screen flex flex-col bg-background-warm">
      {!hideNavbar && <Navbar />}

      <main className="grow">
        <Outlet />
      </main>

      {!hideFooter && <Footer />}

      <ActiveOrderFloatingIndicator
        orders={commandes}
        onViewOrders={() =>
          navigate("/profile", { state: { activeSection: "orders" } })
        }
      />
    </div>
  );
}

export default MainLayout;
