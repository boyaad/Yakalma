import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
  

function MainLayout() {
  const { pathname } = useLocation();
  const hideFooter =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/dashboard" ||
    pathname === "/SellerDashboard" ||
    pathname === "/profile" ||
    pathname === "/panier" ||
    pathname === "/favoris" ||
    pathname === "/create-profile" ||
    pathname === "/plats" ||
    /^\/plats\/[^/]+$/.test(pathname) ||
    pathname.startsWith("/seller/");
    const hideNavbar =
    pathname === "/login" ||
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
