// src/components/ProtectedRoute.tsx
// This component renders no UI of its own -- it only decides.
import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/authStore";

function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);

  // No token? Send them to the login page instead of the page they asked for.
  // `replace` overwrites the history entry, so Back does not bounce them
  // straight forward into the redirect again.
  if (token === null) {
    return <Navigate to="/login" replace />;
  }

  // There IS a token, so render whichever child route matched.
  return <Outlet />;
}

export default ProtectedRoute;
