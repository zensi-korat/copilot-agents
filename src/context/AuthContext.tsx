import { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser } from "../services/auth";
import { getToken, removeToken } from "../utils/token";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(() => getToken());

  useEffect(() => {
    // Restore user from token if available (token is stored, user state is session-only)
    // A real app would call GET /user/me here to rehydrate — wire that up once needed
  }, []);

  function setAuth(newUser: AuthUser, newToken: string) {
    setUser(newUser);
    setTokenState(newToken);
  }

  function logout() {
    removeToken();
    setUser(null);
    setTokenState(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, setAuth, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
