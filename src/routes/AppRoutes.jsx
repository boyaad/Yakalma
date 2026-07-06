import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Catalogue from "../pages/Catalogue";
import PlatDetail from "../pages/PlatDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Favorites from "../pages/Favorites";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import SellerDashboard from "../pages/SellerDashboard";
import SellerProfile from "../pages/SellerProfile";
import AddDish from "../pages/AddDish";
import NotFound from "../pages/NotFound";
import RoleRoute from "../components/RoleRoute";
import CreateProfile from "../pages/CreateProfile";
import EditDish from "../pages/EditDish";
import About from "../pages/About";
import HowItWorks from "../pages/HowItWorks";
import Careers from "../pages/Careers";
import HelpCenter from "../pages/HelpCenter";
import Contact from "../pages/Contact";
import Terms from "../pages/Terms";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import ScrollToTop from "../components/routing/ScrollToTop";

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/plats" element={<Catalogue />} />
          <Route path="/plats/:id" element={<PlatDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/qui-sommes-nous" element={<About />} />
          <Route path="/comment-ca-marche" element={<HowItWorks />} />
          <Route path="/carrieres" element={<Careers />} />
          <Route path="/centre-aide" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cgu" element={<Terms />} />
          <Route
            path="/politique-confidentialite"
            element={<PrivacyPolicy />}
          />
          <Route
            path="/create-profile"
            element={
              <>
                <CreateProfile />
              </>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/panier"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["acheteur"]}>
                  <Cart />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["acheteur"]}>
                  <Checkout />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/favoris"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["acheteur"]}>
                  <Favorites />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["acheteur"]}>
                  <Profile />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Seller Routes */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["vendeur"]}>
                  <SellerDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/dishes"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["vendeur"]}>
                  <SellerDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/add-dish"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["vendeur"]}>
                  <AddDish />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/profile"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["vendeur"]}>
                  <SellerProfile />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/orders"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["vendeur"]}>
                  <SellerDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route path="/seller/edit-dish/:id" element={<EditDish />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
