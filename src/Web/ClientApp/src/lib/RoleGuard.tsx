import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../features/auth/api/getCurrentUser";



type RoleGuardProps = {
  allowedRoles: string[];
};

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
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

  if (!Array.isArray(user.roles)) {
    return <Navigate to="/" replace />;
  }

  const hasAccess = user.roles.some((role: string) =>
    allowedRoles.includes(role)
  );

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
