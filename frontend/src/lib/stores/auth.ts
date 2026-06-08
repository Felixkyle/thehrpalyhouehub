"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../api/types";

interface AuthState {
  token: string | null;
  user: User | null;
  expiresAt: string | null;
  // True once persisted state has been read from localStorage. Guards must
  // wait for this before treating "no token" as "logged out" (avoids a
  // flash-redirect of an actually-logged-in user on first paint).
  hasHydrated: boolean;
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
      hasHydrated: false,
      setSession: ({ token, user, expires_at }) => set({ token, user, expiresAt: expires_at }),
      setUser: (user) => set({ user }),
      clear: () => set({ token: null, user: null, expiresAt: null }),
    }),
    {
      name: "hrph_auth",
      // Only persist the session fields, not the transient hydration flag.
      partialize: (s) => ({ token: s.token, user: s.user, expiresAt: s.expiresAt }),
    },
  ),
);

/**
 * Explicitly rehydrate the persisted store on the client and flip hasHydrated.
 * Called once from <Providers> on mount. Relying on onRehydrateStorage alone
 * proved flaky (the callback could miss), so we drive it deterministically and
 * always set the flag — even if there's nothing stored or rehydration throws.
 */
export async function hydrateAuth() {
  try {
    await useAuth.persist.rehydrate();
  } finally {
    useAuth.setState({ hasHydrated: true });
  }
}
