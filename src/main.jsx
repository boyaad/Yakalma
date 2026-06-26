import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.css";

import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserInfoProvider } from "./context/UserInfoContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import SellerInfoProvider from "./context/SellerInfoContext.jsx";

ReactDOM.createRoot(
  document.getElementById(
    "root",
  ),
).render(
  <React.StrictMode>
    <AuthProvider>
      <UserInfoProvider>
        <CartProvider>
          <SellerInfoProvider>
            <App />
            <ToastContainer position="bottom-right" />
          </SellerInfoProvider>
        </CartProvider>
      </UserInfoProvider>
    </AuthProvider>
  </React.StrictMode>,
);
