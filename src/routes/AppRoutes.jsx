import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";
import ScrollToTop from "../components/routing/ScrollToTop";
import Loader from "../components/ui/Loader";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const Catalogue = lazy(() => import("../pages/Catalogue"));
const PlatDetail = lazy(() => import("../pages/PlatDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Favorites = lazy(() => import("../pages/Favorites"));
const Profile = lazy(() => import("../pages/Profile"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const SellerDashboard = lazy(() => import("../pages/SellerDashboard"));
const SellerProfile = lazy(() => import("../pages/SellerProfile"));
const AddDish = lazy(() => import("../pages/AddDish"));
const NotFound = lazy(() => import("../pages/NotFound"));
const CreateProfile = lazy(() => import("../pages/CreateProfile"));
const EditDish = lazy(() => import("../pages/EditDish"));
const About = lazy(() => import("../pages/About"));
const HowItWorks = lazy(() => import("../pages/HowItWorks"));
const Careers = lazy(() => import("../pages/Careers"));
const HelpCenter = lazy(() => import("../pages/HelpCenter"));
const Contact = lazy(() => import("../pages/Contact"));
const Terms = lazy(() => import("../pages/Terms"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loader fullScreen={true} />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
