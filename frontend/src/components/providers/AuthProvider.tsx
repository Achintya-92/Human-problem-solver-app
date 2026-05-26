"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/authToken";

export type AuthUser = {
  id: string;
  email?: string;
  name: string;
  username?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  trustScore?: { score: number } | null;
};

type AuthState = {
  status: "loading" | "guest" | "authed";
  user: AuthUser | null;
  token: string | null;
  login: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthState["status"]>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  async function refresh() {
    const t = getToken();
    if (!t) {
      setTokenState(null);
      setUser(null);
      setStatus("guest");
      return;
    }
    setTokenState(t);
    try {
      const { user } = await api.get<{ user: AuthUser }>("/api/auth/me");
      setUser(user);
      setStatus("authed");
    } catch {
      clearToken();
      setTokenState(null);
      setUser(null);
      setStatus("guest");
    }
  }

  async function login(input: { email: string; password: string }) {
    const { token, user } = await api.post<{ token: string; user: AuthUser }>("/api/auth/login", input);
    setToken(token);
    setTokenState(token);
    setUser(user);
    setStatus("authed");
  }

  async function signup(input: { email: string; password: string; name: string }) {
    const { token, user } = await api.post<{ token: string; user: AuthUser }>("/api/auth/signup", input);
    setToken(token);
    setTokenState(token);
    setUser(user);
    setStatus("authed");
  }

  function logout() {
    clearToken();
    setTokenState(null);
    setUser(null);
    setStatus("guest");
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthState>(
    () => ({ status, user, token, login, signup, logout, refresh }),
    [status, user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

