import { Navigate } from "react-router-dom";

function RoleRoute({ userRole, allowedRoles, children }) {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;
