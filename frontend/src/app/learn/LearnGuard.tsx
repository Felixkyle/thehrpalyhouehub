"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/stores/auth";

/**
 * Route guard for the whole /learn/* section.
 *
 * Anonymous users are redirected to /login (with a ?next= back-link).
 * We wait for the persisted auth store to hydrate from localStorage before
 * deciding — otherwise a logged-in user would be bounced on first paint.
 */
export default function LearnGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuth((s) => s.token);
  const hasHydrated = useAuth((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !token) {
      const next = encodeURIComponent(pathname || "/learn/dashboard");
      router.replace(`/login?next=${next}`);
    }
  }, [hasHydrated, token, pathname, router]);

  // Still reading localStorage, or about to redirect — show a neutral splash
  // rather than the protected UI.
  if (!hasHydrated || !token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D1F3C",
          color: "rgba(255,255,255,.7)",
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          gap: 14,
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            border: "3px solid rgba(255,255,255,.25)",
            borderTopColor: "#C9501E",
            borderRadius: "50%",
            animation: "learnguard-spin .7s linear infinite",
          }}
        />
        <span style={{ fontSize: 13 }}>Loading your workspace…</span>
        <style>{`@keyframes learnguard-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
