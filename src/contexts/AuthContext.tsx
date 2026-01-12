import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UserRole = "admin" | "user";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (payload: LoginPayload) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "authUser";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = ({ email, password }: LoginPayload) => {
    if (!email || !password) {
      return { success: false, message: "Please enter your email and password." };
    }

    if (password.length < 6) {
      return { success: false, message: "Use at least 6 characters for the demo password." };
    }

    const role: UserRole = email.toLowerCase().includes("admin") ? "admin" : "user";
    const nextUser: AuthUser = {
      name: email.split("@")[0] || "Guest",
      email,
      role,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);

    return { success: true, message: "Welcome back!" };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
