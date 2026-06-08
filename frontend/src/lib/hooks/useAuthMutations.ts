"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth, type AuthResponse } from "@/lib/api/endpoints";
import { useAuth } from "@/lib/stores/auth";

type SignupBody = Parameters<typeof auth.signup>[0];
type LoginBody = Parameters<typeof auth.login>[0];

/** Persist a successful auth response into the session store. */
function useStoreSession() {
  const setSession = useAuth((s) => s.setSession);
  const qc = useQueryClient();
  return (res: AuthResponse) => {
    setSession({ token: res.token, user: res.user, expires_at: res.expires_at });
    // Any previously-cached "logged out" data is now stale.
    qc.invalidateQueries();
  };
}

export function useLogin() {
  const store = useStoreSession();
  return useMutation({
    mutationFn: (body: LoginBody) => auth.login(body),
    onSuccess: store,
  });
}

export function useSignup() {
  const store = useStoreSession();
  return useMutation({
    mutationFn: (body: SignupBody) => auth.signup(body),
    onSuccess: store,
  });
}

export function usePasswordResetRequest() {
  return useMutation({
    mutationFn: (email: string) => auth.passwordResetRequest(email),
  });
}

export function usePasswordResetConfirm() {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      auth.passwordResetConfirm(token, newPassword),
  });
}
