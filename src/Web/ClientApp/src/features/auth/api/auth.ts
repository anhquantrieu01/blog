import {
  useMutation,
} from "@tanstack/react-query";
import {
  AuthClient,
  CreateUserCommand,
  LoginCommand,
} from "../../../web-api-client";

const authClient = new AuthClient();

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: CreateUserCommand) =>
      authClient.postApiAuthRegister(data),
  });
}

export const useLogin = () => { 
  return useMutation({
    mutationFn: (data: LoginCommand) =>
      authClient.postApiAuthLogin(data),
  });
}