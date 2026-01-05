import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../features/auth/api/getCurrentUser";

export const ProtectedRoute = () => {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};
