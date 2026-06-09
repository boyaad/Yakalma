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
import AddDish from "../pages/AddDish";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/plats" element={<Catalogue />} />

          <Route path="/plats/:id" element={<PlatDetail />} />

          <Route path="/panier" element={<Cart />} />

          <Route path="/favoris" element={<Favorites />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/SellerDashboard" element={<SellerDashboard />} />
          <Route path="/seller/dishes" element={<SellerDashboard />} />
          <Route path="/seller/add-dish" element={<AddDish />} />

          <Route path="/seller/orders" element={<SellerDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
