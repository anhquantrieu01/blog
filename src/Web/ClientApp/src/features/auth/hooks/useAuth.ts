import { useCurrentUser } from "../api/getCurrentUser";

export const useAuth = () => {
  const { data: user, isLoading } = useCurrentUser();

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
};
