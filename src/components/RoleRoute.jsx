import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ allowedRoles, children }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <h2 className="flex items-center justify-center min-h-screen text-lg">Chargement...</h2>;
  }

  if (user && !profile) {
    return <h2 className="flex items-center justify-center min-h-screen text-lg">Chargement du profil...</h2>;
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RoleRoute;