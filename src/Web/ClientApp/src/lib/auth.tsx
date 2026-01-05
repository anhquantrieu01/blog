import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { paths } from "../config/paths";
import {
  AuthClient,
  LoginCommand,
  RegisterCommand,
  CurrentUserDto,
} from "../web-api-client";
import { z } from "zod";
// ----------------------
// Types
// ----------------------
export type User = CurrentUserDto;

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
};

export const loginInputSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export const registerInputSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

// ----------------------
// Auth Context
// ----------------------
type AuthContextType = {
  user: User | null;
  login: (data: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authClient = new AuthClient();

  // Load current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authClient.getApiAuthMe();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (data: LoginInput) => {
    // Khởi tạo LoginCommand
    const cmd = new LoginCommand();
    cmd.email = data.email;
    cmd.password = data.password;

    const res = await authClient.postApiAuthLogin(cmd);
    if (Array.isArray(res)) {
      console.log("log err", res);
      throw new Error((res as string[]).join("\n"));
    } else {
      const currentUser = await authClient.getApiAuthMe();
      setUser(currentUser);
    }
  };

  const logout = async () => {
    await authClient.postApiAuthLogout();
    setUser(null);
  };

  const register = async (data: RegisterInput) => {
    const cmd = new RegisterCommand();
    cmd.email = data.email;
    cmd.fullName = data.fullName;
    cmd.password = data.password;

    const res = await authClient.postApiAuthRegister(cmd);
    console.log("res", res);
    if (Array.isArray(res)) {
      console.log("log err", res);
      throw new Error((res as string[]).join("\n"));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ----------------------
// Hooks
// ----------------------
export const useUser = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useUser must be used within AuthProvider");
  return ctx.user;
};

export const useLogin = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useLogin must be used within AuthProvider");
  return ctx.login;
};

export const useLogout = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useLogout must be used within AuthProvider");
  return ctx.logout;
};

export const useRegister = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useRegister must be used within AuthProvider");
  return ctx.register;
};

// ----------------------
// ProtectedRoute
// ----------------------
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return <>{children}</>;
};
