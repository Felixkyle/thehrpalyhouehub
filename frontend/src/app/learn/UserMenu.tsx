"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/stores/auth";

/**
 * Avatar button in the top nav that opens a dropdown with Profile + Log out.
 * Shared across the /learn pages.
 */
export default function UserMenu({ initials, name }: { initials: string; name?: string }) {
  const router = useRouter();
  const clear = useAuth((s) => s.clear);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function logout() {
    clear();
    router.push("/");
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        className="user-avatar"
        title={name}
        onClick={() => setOpen((v) => !v)}
        style={{ cursor: "pointer", border: "none" }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 12px 32px rgba(10,22,40,.18)",
            border: "1px solid rgba(10,22,40,.08)",
            minWidth: 180,
            overflow: "hidden",
            zIndex: 1000,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          {name && (
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(10,22,40,.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0A1628" }}>{name}</div>
              <div style={{ fontSize: 11, color: "#9BABC0" }}>Signed in</div>
            </div>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => router.push("/learn/learner-profile")}
            style={menuItemStyle}
          >
            👤 Profile
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => router.push("/learn/dashboard")}
            style={menuItemStyle}
          >
            📊 Dashboard
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            style={{ ...menuItemStyle, color: "#C9351E", borderTop: "1px solid rgba(10,22,40,.06)" }}
          >
            ↪ Log out
          </button>
        </div>
      )}
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "11px 16px",
  background: "none",
  border: "none",
  fontSize: 14,
  color: "#1E2D4A",
  cursor: "pointer",
  fontFamily: "inherit",
};
