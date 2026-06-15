import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.css";

import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { UserInfoProvider } from "./context/UserInfoContext.jsx";
import SellerInfoProvider from "./context/SellerInfoContext.jsx";

ReactDOM.createRoot(
  document.getElementById(
    "root",
  ),
).render(
  <React.StrictMode>
    <AuthProvider>
      <UserInfoProvider>
        <SellerInfoProvider>
          <App />
          <ToastContainer position="bottom-right" />
        </SellerInfoProvider>
      </UserInfoProvider>
    </AuthProvider>
  </React.StrictMode>,
);
