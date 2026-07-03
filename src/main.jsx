import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.css";

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserInfoProvider } from "./context/UserInfoContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import SellerInfoProvider from "./context/SellerInfoContext.jsx";
import AdminInfoProvider from "./context/AdminInfoContext.jsx";

ReactDOM.createRoot(
  document.getElementById(
    "root",
  ),
).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <UserInfoProvider>
          <CartProvider>
            <SellerInfoProvider>
              <AdminInfoProvider>
                <App />
                <ToastContainer position="bottom-right" />
              </AdminInfoProvider>
            </SellerInfoProvider>
          </CartProvider>
        </UserInfoProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>,
);
