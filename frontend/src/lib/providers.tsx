"use client";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureClient } from "./api/client";
import { useAuth, hydrateAuth } from "./stores/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  useEffect(() => {
    configureClient({
      getToken: () => useAuth.getState().token,
      onUnauthenticated: () => useAuth.getState().clear(),
    });
    // Load the persisted session from localStorage and mark hydration done.
    void hydrateAuth();
  }, []);

  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
