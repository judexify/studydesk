import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoutes({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate replace to="login" />;

  return children;
}

export default ProtectedRoutes;
