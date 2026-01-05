import { useQuery } from "@tanstack/react-query";
import { AuthClient, } from "../../../web-api-client";
const getCurrentUser = async () => {
  const authClient = new AuthClient();
  
  return authClient.getApiAuthMe();
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
  });
};
