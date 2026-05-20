"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../api/types";

interface AuthState {
  token: string | null;
  user: User | null;
  expiresAt: string | null;
  setSession: (s: { token: string; user: User; expires_at: string }) => void;
  setUser: (user: User) => void;
  clear: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      expiresAt: null,
      setSession: ({ token, user, expires_at }) => set({ token, user, expiresAt: expires_at }),
      setUser: (user) => set({ user }),
      clear: () => set({ token: null, user: null, expiresAt: null }),
    }),
    { name: "hrph_auth" },
  ),
);
