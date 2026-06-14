import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Catalogue from "../pages/Catalogue";
import PlatDetail from "../pages/PlatDetail";
import Cart from "../pages/Cart";
import Favorites from "../pages/Favorites";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import SellerDashboard from "../pages/SellerDashboard";
import SellerProfile from "../pages/SellerProfile";
import AddDish from "../pages/AddDish";
import NotFound from "../pages/NotFound";
import RoleRoute from "../components/RoleRoute";
import CreateProfile from "../pages/CreateProfile";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<RoleRoute userRole={"acheteur"} allowedRoles={["acheteur"]}><Home /></RoleRoute>} />
          <Route path="/plats" element={<RoleRoute userRole={"acheteur"} allowedRoles={["acheteur"]}><Catalogue /></RoleRoute>} />
          <Route path="/plats/:id" element={<RoleRoute userRole={"acheteur"} allowedRoles={["acheteur"]}><PlatDetail /></RoleRoute>} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />

          {/* Protected Routes */}
          <Route path="/panier" element={
              <ProtectedRoute>
                <RoleRoute userRole={"acheteur"} allowedRoles={["acheteur"]}>
                  <Cart />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />
          <Route path="/favoris" element={<ProtectedRoute><RoleRoute userRole={"acheteur"} allowedRoles={["acheteur"]}><Favorites /></RoleRoute></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><RoleRoute userRole={"acheteur"} allowedRoles={["acheteur"]}><Profile /></RoleRoute></ProtectedRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><RoleRoute userRole={"admin"} allowedRoles={["admin"]}><Dashboard /></RoleRoute></ProtectedRoute>} />

          {/* Seller Routes */}
          <Route path="/seller/dashboard" element={<ProtectedRoute><RoleRoute userRole="vendeur" allowedRoles={["vendeur"]}><SellerDashboard /></RoleRoute></ProtectedRoute>} />

          <Route path="/seller/dishes" element={<ProtectedRoute><RoleRoute userRole="vendeur" allowedRoles={["vendeur"]}><SellerDashboard /></RoleRoute></ProtectedRoute>} />
          
          <Route path="/seller/add-dish" element={<ProtectedRoute><RoleRoute userRole="vendeur" allowedRoles={["vendeur"]}><AddDish /></RoleRoute></ProtectedRoute>} />
          
          <Route path="/seller/profile" element={<ProtectedRoute><RoleRoute userRole="vendeur" allowedRoles={["vendeur"]}><SellerProfile /></RoleRoute></ProtectedRoute>} />
          
          <Route path="/seller/orders" element={<ProtectedRoute><RoleRoute userRole="vendeur" allowedRoles={["vendeur"]}><SellerDashboard /></RoleRoute></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
