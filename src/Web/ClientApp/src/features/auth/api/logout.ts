import { useMutation } from "@tanstack/react-query";
import { AuthClient } from "../../../web-api-client";
const authClient = new AuthClient();
const logout = async () => {
  return await authClient.postApiAuthLogout();
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};
