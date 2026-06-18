"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/stores/auth";
import { useAdminFinalProjects } from "@/lib/hooks";
import { API_BASE } from "@/lib/api/client";

function fmtSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SubmissionsContent() {
  const router = useRouter();
  const token = useAuth((s) => s.token);
  const hasHydrated = useAuth((s) => s.hasHydrated);
  const { data, isLoading, isError, error } = useAdminFinalProjects();

  // Not logged in → bounce to login.
  useEffect(() => {
    if (hasHydrated && !token) router.replace("/login?next=/admin/submissions");
  }, [hasHydrated, token, router]);

  const subs = data?.submissions ?? [];
  // The admin endpoint 403s for non-admins.
  const forbidden = isError && (error as { status?: number })?.status === 403;

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FC", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#0A1628" }}>
      <nav style={{ height: 60, background: "#0D1F3C", display: "flex", alignItems: "center", padding: "0 32px", gap: 12 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ height: 30, padding: "0 12px", borderRadius: 100, background: "#C9501E", fontWeight: 800, fontSize: 12, color: "#fff", display: "flex", alignItems: "center" }}>HR</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,.8)" }}>Playhouse Hub — Admin</span>
        </Link>
      </nav>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Final Project Submissions</h1>
        <p style={{ color: "#5A6880", marginBottom: 32, fontSize: 14 }}>
          Every submitted HR Strategy Proposal, newest first.
        </p>

        {isLoading && <p style={{ color: "#5A6880" }}>Loading submissions…</p>}

        {forbidden && (
          <div style={{ padding: 16, background: "#fef2f0", border: "1px solid #fca5a5", borderRadius: 8, color: "#991b1b" }}>
            You need an admin account to view this page.
          </div>
        )}

        {isError && !forbidden && (
          <div style={{ padding: 16, background: "#fef2f0", border: "1px solid #fca5a5", borderRadius: 8, color: "#991b1b" }}>
            Could not load submissions. Please try again.
          </div>
        )}

        {!isLoading && !isError && subs.length === 0 && (
          <p style={{ color: "#5A6880" }}>No submissions yet.</p>
        )}

        {subs.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(10,22,40,.08)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#F0F2F8", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Learner</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>File</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Submitted</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}></th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} style={{ borderTop: "1px solid rgba(10,22,40,.06)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 600 }}>{s.learner_name}</div>
                      <div style={{ color: "#9BABC0", fontSize: 12 }}>{s.learner_email}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div>{s.original_name}</div>
                      <div style={{ color: "#9BABC0", fontSize: 12 }}>{fmtSize(s.size_bytes)}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#5A6880" }}>{fmtDate(s.submitted_at)}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <a
                        href={`${API_BASE}${s.file_url}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#C9501E", fontWeight: 600, textDecoration: "none" }}
                      >
                        Download →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
