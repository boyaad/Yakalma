import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

function RoleRoute({ userRole, allowedRoles, children }) {
  // const { profile } = useAuth()

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/seller/dashboard" replace />;
  }

  return children;
}

export default RoleRoute;