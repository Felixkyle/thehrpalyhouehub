"use client";

import { useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/lib/hooks";
import { useAuth } from "@/lib/stores/auth";
import { ApiError } from "@/lib/api/client";
import type { CourseLevel } from "@/lib/api/types";
import "./dashboard.css";

/**
 * Learner dashboard.
 *
 * Faithful port of 02_dashboard.html, now wired to the real backend via
 * `useDashboard()` ({ user, stats, levels, recent_activity, badges }). The
 * static demo content has been replaced with live data; the visual markup and
 * CSS classes are preserved.
 *
 * This is an auth-gated page: the query is disabled until a session token
 * exists, so the not-logged-in case shows a sign-in prompt, and loading/error
 * states are rendered with lightweight inline-styled UI that fits the page.
 *
 * The only original script behaviour was the mobile hamburger button, which
 * toggled `.topnav-links` between `display:flex`/`display:none`. That imperative
 * DOM toggle is React state; the inline `display:none` start state is preserved
 * so the CSS media query keeps controlling desktop visibility.
 */

// ── Helpers (pure, no module-scope Date.now()/Math.random()) ──────────────

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(then).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function monthYear(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

// Soft tint backgrounds (matching the original palette) for icon chips.
const ICON_TINTS = ["#E8ECF4", "#FDF4DD", "#FAF0EB", "#e8f7ee"];
function tintFor(index: number): string {
  return ICON_TINTS[index % ICON_TINTS.length];
}

// Per-status presentation for a level card badge/fill.
function levelBadgeStyle(level: CourseLevel): {
  badge: React.CSSProperties;
  fill: React.CSSProperties;
  pct: React.CSSProperties;
} {
  if (level.status === "complete") {
    return {
      badge: { background: "#e8f7ee", color: "#1a7a4a" },
      fill: { width: `${level.progress_percent}%`, background: "#1a7a4a" },
      pct: { color: "#1a7a4a" },
    };
  }
  if (level.status === "current") {
    return {
      badge: { background: "#E8ECF4", color: "#1E3560" },
      fill: { width: `${level.progress_percent}%`, background: "var(--navy)" },
      pct: {},
    };
  }
  return {
    badge: { background: "#E8ECF4", color: "#5A6880" },
    fill: { width: `${level.progress_percent}%`, background: "var(--navy)" },
    pct: { color: "var(--ink-4)" },
  };
}

function countDone(items: { status: string }[]): number {
  return items.filter((i) => i.status === "complete" || i.status === "done")
    .length;
}

export default function DashboardContent() {
  // null = not toggled (CSS media query controls visibility);
  // "flex"/"none" once the user clicks the mobile menu button.
  const [linksDisplay, setLinksDisplay] = useState<"flex" | "none" | null>(
    null,
  );

  const token = useAuth((s) => s.token);
  const { data, isLoading, isError, error, refetch } = useDashboard();

  function toggleMenu() {
    setLinksDisplay((prev) =>
      prev === "none" || prev === null ? "flex" : "none",
    );
  }

  // The top nav + avatar (greeting/avatar use live data once loaded).
  const headerInitials = data?.user ? initialsFor(data.user.display_name) : "";
  const headerName = data?.user?.display_name ?? "";

  const topNav = (
    <nav className="topnav">
      <a className="nav-logo" href="https://www.thehrplayhousehub.org/">
        <div className="nav-logo-pill">HR Playhouse</div>
        <div className="nav-logo-text">Hub</div>
      </a>
      <div
        className="topnav-links"
        style={linksDisplay ? { display: linksDisplay } : undefined}
      >
        <Link className="tnl active" href="/learn/dashboard">
          Dashboard
        </Link>
        <a className="tnl" href="/learn/my-courses">
          Courses
        </a>
        <Link className="tnl" href="/learn/case-study-vault">
          Case Studies
        </Link>
        <Link className="tnl" href="/learn/playbook">
          Playbook
        </Link>
        <Link className="tnl" href="/learn/innovation-lab">
          Innovation Lab
        </Link>
        <Link className="tnl" href="/learn/ai-support">
          AI Support
        </Link>
      </div>
      <button
        className="mobile-menu-btn"
        onClick={toggleMenu}
        style={{
          display: "none",
          marginLeft: "auto",
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "rgba(255,255,255,.1)",
          border: "none",
          cursor: "pointer",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          flexShrink: 0,
        }}
      >
        <div
          style={{ width: 18, height: 2, background: "#fff", borderRadius: 1 }}
        />
        <div
          style={{ width: 18, height: 2, background: "#fff", borderRadius: 1 }}
        />
        <div
          style={{ width: 18, height: 2, background: "#fff", borderRadius: 1 }}
        />
      </button>
      <div className="topnav-right">
        {headerInitials ? (
          <div className="user-avatar" title={headerName}>
            {headerInitials}
          </div>
        ) : null}
      </div>
    </nav>
  );

  // ── Not authenticated: prompt to sign in ────────────────────────────────
  if (!token) {
    return (
      <>
        {topNav}
        <div className="dashboard">
          <main className="main">
            <div
              style={{
                margin: "60px auto",
                maxWidth: 440,
                textAlign: "center",
                background: "#fff",
                border: "1px solid var(--line, #e6e9ef)",
                borderRadius: 16,
                padding: "40px 32px",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
              <div className="section-title" style={{ marginBottom: 8 }}>
                Sign in to view your dashboard
              </div>
              <p
                style={{
                  color: "var(--ink-3, #5A6880)",
                  margin: "0 0 24px",
                  lineHeight: 1.5,
                }}
              >
                Your learning progress, badges and recent activity live behind
                your account. Sign in to pick up where you left off.
              </p>
              <Link className="wh-next-btn" href="/login">
                Sign in →
              </Link>
            </div>
          </main>
        </div>
      </>
    );
  }

  // ── Loading state ───────────────────────────────────────────────────────
  if (isLoading || !data) {
    return (
      <>
        {topNav}
        <div className="dashboard">
          <main className="main">
            <div
              style={{
                margin: "60px auto",
                textAlign: "center",
                color: "var(--ink-3, #5A6880)",
              }}
            >
              <div
                aria-label="Loading dashboard"
                role="status"
                style={{
                  width: 36,
                  height: 36,
                  margin: "0 auto 16px",
                  borderRadius: "50%",
                  border: "3px solid #E8ECF4",
                  borderTopColor: "var(--navy, #1E3560)",
                  animation: "dash-spin 0.8s linear infinite",
                }}
              />
              Loading your dashboard…
            </div>
          </main>
        </div>
        <style>{`@keyframes dash-spin{to{transform:rotate(360deg)}}`}</style>
      </>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (isError) {
    const message =
      error instanceof ApiError
        ? error.message
        : "We couldn't load your dashboard. Please try again.";
    return (
      <>
        {topNav}
        <div className="dashboard">
          <main className="main">
            <div
              style={{
                margin: "60px auto",
                maxWidth: 440,
                textAlign: "center",
                background: "#fff",
                border: "1px solid #f3d6d0",
                borderRadius: 16,
                padding: "40px 32px",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
              <div className="section-title" style={{ marginBottom: 8 }}>
                Something went wrong
              </div>
              <p
                style={{
                  color: "var(--ink-3, #5A6880)",
                  margin: "0 0 24px",
                  lineHeight: 1.5,
                }}
              >
                {message}
              </p>
              <button
                className="wh-next-btn"
                onClick={() => refetch()}
                style={{ border: "none", cursor: "pointer" }}
              >
                Try again
              </button>
            </div>
          </main>
        </div>
      </>
    );
  }

  // ── Loaded ──────────────────────────────────────────────────────────────
  const { user, stats, levels, recent_activity, badges } = data;

  const currentLevel = levels.find((l) => l.status === "current");
  const userRoleLine = [user.job_title || user.role, user.country]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      {topNav}

      <div className="dashboard">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="user-card">
            <div className="uc-avatar">{initialsFor(user.display_name)}</div>
            <div className="uc-name">{user.display_name}</div>
            <div className="uc-role">{userRoleLine}</div>
            {currentLevel ? (
              <div className="uc-level-badge">
                <div className="uc-level-dot" />
                Level {currentLevel.level_number} — {currentLevel.title}
              </div>
            ) : null}
            <div className="uc-divider" />
            <div className="uc-stat-row">
              <div className="uc-stat">
                <div className="uc-stat-n">{stats.courses_count}</div>
                <div className="uc-stat-l">Courses</div>
              </div>
              <div className="uc-stat">
                <div className="uc-stat-n">{stats.cases_read}</div>
                <div className="uc-stat-l">Cases Read</div>
              </div>
              <div className="uc-stat">
                <div className="uc-stat-n">{stats.badges_earned}</div>
                <div className="uc-stat-l">Badges</div>
              </div>
            </div>
          </div>

          <div className="side-nav">
            <Link className="sn-item active" href="/learn/dashboard">
              <div className="sn-icon" style={{ background: "#E8ECF4" }}>
                📊
              </div>{" "}
              My Dashboard
            </Link>
            <a className="sn-item" href="/learn/my-courses">
              <div className="sn-icon" style={{ background: "#E8ECF4" }}>
                🎓
              </div>{" "}
              My Courses
            </a>
            <Link className="sn-item" href="/learn/case-study-vault">
              <div className="sn-icon" style={{ background: "#FDF4DD" }}>
                📚
              </div>{" "}
              Case Studies
              <span className="sn-badge">32</span>
            </Link>
            <Link className="sn-item" href="/learn/playbook">
              <div className="sn-icon" style={{ background: "#E8ECF4" }}>
                📖
              </div>{" "}
              HR Playbook
            </Link>
            <Link className="sn-item" href="/learn/innovation-lab">
              <div className="sn-icon" style={{ background: "#FAF0EB" }}>
                🔬
              </div>{" "}
              Innovation Lab
            </Link>
            <Link className="sn-item" href="/learn/ai-support">
              <div className="sn-icon" style={{ background: "#e8f7ee" }}>
                🤖
              </div>{" "}
              AI HR Support
            </Link>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* WELCOME */}
          <div className="welcome-header">
            <div className="wh-left">
              <div className="wh-greeting">{greetingForNow()}</div>
              <div className="wh-title">
                Welcome back, {user.first_name} 👋
              </div>
              <div className="wh-sub">
                {currentLevel
                  ? `You're ${currentLevel.progress_percent}% through Level ${currentLevel.level_number} — ${currentLevel.title}. Keep going.`
                  : "Pick a level below to keep learning."}
              </div>
            </div>
            <a className="wh-next-btn" href="/learn/my-courses">
              Continue learning →
            </a>
          </div>

          {/* COURSE PROGRESS */}
          <div>
            <div className="section-title">My Learning Progress</div>
            <div className="levels-grid">
              {levels.map((level) => {
                const s = levelBadgeStyle(level);
                const topicsDone = countDone(level.topics);
                const gamesDone = countDone(level.games);
                const allTopicsDone =
                  level.topics.length > 0 &&
                  topicsDone === level.topics.length;
                const allGamesDone =
                  level.games.length > 0 && gamesDone === level.games.length;
                return (
                  <div
                    key={level.id}
                    className={`level-card${
                      level.status === "current" ? " current" : ""
                    }`}
                  >
                    <div className="lc-header">
                      <span className="lc-badge" style={s.badge}>
                        {level.status === "current"
                          ? `Level ${level.level_number} · Current`
                          : `Level ${level.level_number}`}
                      </span>
                      <span
                        className="lc-status"
                        style={
                          level.status === "current"
                            ? { color: "var(--accent)" }
                            : undefined
                        }
                      >
                        {level.status === "complete" && "✓ Complete"}
                        {level.status === "current" && "In progress"}
                        {level.status === "locked" && (
                          <>
                            <span className="lc-lock">🔒</span> Locked
                          </>
                        )}
                      </span>
                    </div>
                    <div className="lc-title">{level.course_name}</div>
                    <div className="lc-sub">{level.description}</div>
                    <div className="lc-progress-row">
                      <div className="lc-bar">
                        <div className="lc-fill" style={s.fill} />
                      </div>
                      <div className="lc-pct" style={s.pct}>
                        {level.progress_percent}%
                      </div>
                    </div>
                    <div className="lc-topics">
                      <span className="lc-topic">
                        {allTopicsDone
                          ? `${level.topics.length} topics`
                          : `${topicsDone} / ${level.topics.length} topics`}
                      </span>
                      {level.case_studies.length > 0 ? (
                        <span className="lc-topic">Case study</span>
                      ) : null}
                      {level.games.length > 0 ? (
                        <span className="lc-topic">
                          {allGamesDone
                            ? `${level.games.length} games`
                            : `${gamesDone} / ${level.games.length} games`}
                        </span>
                      ) : null}
                    </div>
                    <div className="lc-action">
                      {level.status === "complete" && (
                        <a className="lc-btn outline" href="/learn/my-courses">
                          Review →
                        </a>
                      )}
                      {level.status === "current" && (
                        <a className="lc-btn primary" href="/learn/my-courses">
                          Continue →
                        </a>
                      )}
                      {level.status === "locked" && (
                        <span className="lc-btn locked">
                          {level.level_number > 1
                            ? `Complete Level ${level.level_number - 1} first`
                            : "Locked"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NEXT STEP BANNER */}
          {currentLevel ? (
            <div className="next-step-banner">
              <div className="nsb-icon">📖</div>
              <div className="nsb-body">
                <div className="nsb-label">Your next step</div>
                <div className="nsb-title">
                  {currentLevel.topics.find(
                    (t) => t.status !== "complete" && t.status !== "done",
                  )?.name ?? currentLevel.course_name}
                </div>
                <div className="nsb-sub">
                  Level {currentLevel.level_number} · {currentLevel.title} —
                  pick up where you left off
                </div>
              </div>
              <a className="nsb-btn" href="/learn/my-courses">
                Continue →
              </a>
            </div>
          ) : null}

          {/* ACTIVITY + QUICK ACCESS */}
          <div className="two-col">
            {/* RECENT ACTIVITY */}
            <div className="activity-feed">
              <div className="section-title">Recent Activity</div>
              <div className="activity-list">
                {recent_activity.length === 0 ? (
                  <div
                    className="activity-meta"
                    style={{ padding: "8px 0" }}
                  >
                    No activity yet — start a course to see your progress here.
                  </div>
                ) : (
                  recent_activity.map((activity, i) => (
                    <div className="activity-item" key={activity.id}>
                      <div
                        className="activity-icon"
                        style={{ background: tintFor(i) }}
                      >
                        {activity.icon || "•"}
                      </div>
                      <div>
                        <div className="activity-title">{activity.title}</div>
                        <div className="activity-meta">
                          {[activity.context, relativeTime(activity.occurred_at)]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* QUICK ACCESS */}
            <div className="quick-access">
              <div className="section-title">Quick Access</div>
              <div className="qa-grid">
                <Link className="qa-item" href="/learn/case-study-vault">
                  <div className="qa-icon" style={{ background: "#FDF4DD" }}>
                    📚
                  </div>
                  <div className="qa-label">Case Study Vault</div>
                  <div className="qa-arrow">→</div>
                </Link>
                <Link className="qa-item" href="/learn/playbook">
                  <div className="qa-icon" style={{ background: "#E8ECF4" }}>
                    📖
                  </div>
                  <div className="qa-label">Everyday HR Playbook</div>
                  <div className="qa-arrow">→</div>
                </Link>
                <Link className="qa-item" href="/learn/ai-support">
                  <div className="qa-icon" style={{ background: "#e8f7ee" }}>
                    🤖
                  </div>
                  <div className="qa-label">AI HR Support</div>
                  <div className="qa-arrow">→</div>
                </Link>
                <Link className="qa-item" href="/learn/innovation-lab">
                  <div className="qa-icon" style={{ background: "#FAF0EB" }}>
                    🔬
                  </div>
                  <div className="qa-label">Innovation Lab</div>
                  <div className="qa-arrow">→</div>
                </Link>
              </div>
            </div>
          </div>

          {/* BADGES */}
          <div className="badges-section">
            <div className="section-title">My Badges &amp; Achievements</div>
            <div className="badges-grid">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`badge-item ${badge.earned ? "earned" : "locked"}`}
                  title={badge.description}
                >
                  <span className="badge-emoji">{badge.emoji}</span>
                  <div className="badge-name">{badge.name}</div>
                  <div className="badge-date">
                    {badge.earned
                      ? badge.earned_at
                        ? `Earned ${monthYear(badge.earned_at)}`
                        : "Earned"
                      : "Locked"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
