import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { useOrderNotifications } from "../hooks/useOrderNotifications";
  

function MainLayout() {
  useOrderNotifications();
  const { pathname } = useLocation();
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
    </div>
  );
}

export default MainLayout;
