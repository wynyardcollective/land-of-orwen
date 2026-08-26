"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearGuestMode,
  enableGuestMode,
  isGuestMode,
} from "@/lib/game/guest";
import type { GameState } from "@/lib/game/types";
import { SAVE_KEY, PLAYER_ID_KEY } from "@/lib/game/save";

export interface AuthUser {
  email: string;
  playerId: string;
  heroName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    heroName: string,
    options?: { state?: GameState | null },
  ) => Promise<boolean>;
  startGuest: () => void;
  endGuest: (clearSave?: boolean) => void;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function readError(res: Response) {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

function clearLocalSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(PLAYER_ID_KEY);
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          if (!cancelled) {
            setUser(null);
            setIsGuest(isGuestMode());
          }
          return;
        }
        const data = (await res.json()) as { user: AuthUser };
        if (!cancelled) {
          clearGuestMode();
          setIsGuest(false);
          setUser(data.user);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setIsGuest(isGuestMode());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError(await readError(res));
      return false;
    }
    const data = (await res.json()) as { user: AuthUser };
    clearGuestMode();
    setIsGuest(false);
    setUser(data.user);
    return true;
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      heroName: string,
      options?: { state?: GameState | null },
    ) => {
      setError(null);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          heroName,
          ...(options?.state ? { state: options.state } : {}),
        }),
      });
      if (!res.ok) {
        setError(await readError(res));
        return false;
      }
      const data = (await res.json()) as { user: AuthUser };
      if (options?.state) {
        try {
          const bound: GameState = {
            ...options.state,
            playerId: data.user.playerId,
            heroName: data.user.heroName,
            updatedAt: Date.now(),
          };
          localStorage.setItem(SAVE_KEY, JSON.stringify(bound));
          localStorage.setItem(PLAYER_ID_KEY, bound.playerId);
        } catch {
          /* ignore */
        }
      }
      clearGuestMode();
      setIsGuest(false);
      setUser(data.user);
      return true;
    },
    [],
  );

  const startGuest = useCallback(() => {
    setError(null);
    enableGuestMode();
    setIsGuest(true);
    setUser(null);
  }, []);

  const endGuest = useCallback((clearSave = true) => {
    setError(null);
    clearGuestMode();
    setIsGuest(false);
    if (clearSave) clearLocalSave();
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
      clearGuestMode();
      setIsGuest(false);
      clearLocalSave();
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isGuest,
      loading,
      error,
      login,
      register,
      startGuest,
      endGuest,
      logout,
      clearError: () => setError(null),
    }),
    [user, isGuest, loading, error, login, register, startGuest, endGuest, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
