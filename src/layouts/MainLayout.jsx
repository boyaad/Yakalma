import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
  

function MainLayout() {
  const { pathname } = useLocation();
  const hideFooter =
    pathname === "/dashboard" ||
    pathname === "/SellerDashboard" ||
    pathname === "/profile" ||
    pathname === "/panier" ||
    pathname === "/favoris" ||
    pathname.startsWith("/seller/");
  const hideNavbar =
    pathname === "/SellerDashboard" ||
    pathname === "/profile" ||
    pathname.startsWith("/seller/");

  return (
    <div className="min-h-screen flex flex-col bg-background-warm">
      {!hideNavbar && <Navbar />}

      <main className="flex-grow">
        <Outlet />
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default MainLayout;
