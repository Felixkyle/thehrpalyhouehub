"use client";

import { useState } from "react";
import Link from "next/link";
import "./dashboard.css";

/**
 * Learner dashboard.
 *
 * Faithful port of 02_dashboard.html. This is an app page that uses the app
 * chrome (`.topnav` + `<aside class="sidebar">`), which is distinct from the
 * shared marketing nav/footer, so that chrome is ported inline as JSX.
 *
 * The only script behaviour in the original was the mobile hamburger button,
 * which toggled `.topnav-links` between `display:flex` / `display:none` via an
 * inline `onclick`. That imperative DOM toggle is now React state; the inline
 * `style="display:none"` start state is preserved via the same inline style so
 * the CSS media query keeps controlling desktop visibility.
 *
 * Internal links that have a local route use Next `<Link>`. The LMS course
 * links remain plain anchors per the link-rewrite rules (the `learn.*` paths
 * map to local routes where one exists).
 */
export default function DashboardContent() {
  // null = not toggled (CSS media query controls visibility);
  // "flex"/"none" once the user clicks the mobile menu button.
  const [linksDisplay, setLinksDisplay] = useState<"flex" | "none" | null>(
    null,
  );

  function toggleMenu() {
    setLinksDisplay((prev) =>
      prev === "none" || prev === null ? "flex" : "none",
    );
  }

  return (
    <>
      <nav className="topnav">
        <a className="nav-logo" href="https://www.thehrplayhousehub.org/">
          <div className="nav-logo-pill">HR Playhouse</div>
          <div className="nav-logo-text">Hub</div>
        </a>
        <div
          className="topnav-links"
          style={linksDisplay ? { display: linksDisplay } : undefined}
        >
          <Link className="tnl active" href="/dashboard">
            Dashboard
          </Link>
          <a
            className="tnl"
            href="/courses/"
          >
            Courses
          </a>
          <Link className="tnl" href="/case-study-vault">
            Case Studies
          </Link>
          <Link className="tnl" href="/playbook">
            Playbook
          </Link>
          <Link className="tnl" href="/innovation-lab">
            Innovation Lab
          </Link>
          <Link className="tnl" href="/ai-support">
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
          <div className="user-avatar" title="Ada Okonkwo">
            AO
          </div>
        </div>
      </nav>

      <div className="dashboard">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="user-card">
            <div className="uc-avatar">AO</div>
            <div className="uc-name">Ada Okonkwo</div>
            <div className="uc-role">HR Business Partner · Lagos, Nigeria</div>
            <div className="uc-level-badge">
              <div className="uc-level-dot" />
              Level 2 — Operational HR
            </div>
            <div className="uc-divider" />
            <div className="uc-stat-row">
              <div className="uc-stat">
                <div className="uc-stat-n">3</div>
                <div className="uc-stat-l">Courses</div>
              </div>
              <div className="uc-stat">
                <div className="uc-stat-n">12</div>
                <div className="uc-stat-l">Cases Read</div>
              </div>
              <div className="uc-stat">
                <div className="uc-stat-n">4</div>
                <div className="uc-stat-l">Badges</div>
              </div>
            </div>
          </div>

          <div className="side-nav">
            <Link className="sn-item active" href="/dashboard">
              <div className="sn-icon" style={{ background: "#E8ECF4" }}>
                📊
              </div>{" "}
              My Dashboard
            </Link>
            <a
              className="sn-item"
              href="/courses/"
            >
              <div className="sn-icon" style={{ background: "#E8ECF4" }}>
                🎓
              </div>{" "}
              My Courses
            </a>
            <Link className="sn-item" href="/case-study-vault">
              <div className="sn-icon" style={{ background: "#FDF4DD" }}>
                📚
              </div>{" "}
              Case Studies
              <span className="sn-badge">32</span>
            </Link>
            <Link className="sn-item" href="/playbook">
              <div className="sn-icon" style={{ background: "#E8ECF4" }}>
                📖
              </div>{" "}
              HR Playbook
            </Link>
            <Link className="sn-item" href="/innovation-lab">
              <div className="sn-icon" style={{ background: "#FAF0EB" }}>
                🔬
              </div>{" "}
              Innovation Lab
            </Link>
            <Link className="sn-item" href="/ai-support">
              <div className="sn-icon" style={{ background: "#e8f7ee" }}>
                🤖
              </div>{" "}
              AI HR Support
            </Link>
          </div>

          {/* DEVELOPER NOTE */}
          <div className="dev-note">
            <div className="dev-note-title">🔧 Developer Integration Note</div>
            <div className="dev-note-body">
              Connect this dashboard to TutorLMS via the REST API:
              <br />
              <br />
              • User data: <code>/wp-json/tutor/v1/students/{"{id}"}</code>
              <br />
              • Course progress:{" "}
              <code>/wp-json/tutor/v1/course-progress/{"{id}"}</code>
              <br />
              • Enrolled courses:{" "}
              <code>/wp-json/tutor/v1/enrolled-courses</code>
              <br />
              <br />
              Replace static content above with <code>fetch()</code> calls on
              page load. Store JWT token in <code>localStorage</code>.
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* WELCOME */}
          <div className="welcome-header">
            <div className="wh-left">
              <div className="wh-greeting">Good morning</div>
              <div className="wh-title">Welcome back, Ada 👋</div>
              <div className="wh-sub">
                You&apos;re 75% through Level 2 — Operational HR. Keep going.
              </div>
            </div>
            <a
              className="wh-next-btn"
              href="/courses/"
            >
              Continue learning →
            </a>
          </div>

          {/* COURSE PROGRESS */}
          <div>
            <div className="section-title">My Learning Progress</div>
            <div className="levels-grid">
              {/* L1 Complete */}
              <div className="level-card">
                <div className="lc-header">
                  <span
                    className="lc-badge"
                    style={{ background: "#e8f7ee", color: "#1a7a4a" }}
                  >
                    Level 1
                  </span>
                  <span className="lc-status">✓ Complete</span>
                </div>
                <div className="lc-title">HR Foundations</div>
                <div className="lc-sub">
                  Mindset, HR toolkit, culture &amp; engagement
                </div>
                <div className="lc-progress-row">
                  <div className="lc-bar">
                    <div
                      className="lc-fill"
                      style={{ width: "100%", background: "#1a7a4a" }}
                    />
                  </div>
                  <div className="lc-pct" style={{ color: "#1a7a4a" }}>
                    100%
                  </div>
                </div>
                <div className="lc-topics">
                  <span className="lc-topic">3 topics</span>
                  <span className="lc-topic">Case study</span>
                  <span className="lc-topic">3 games</span>
                </div>
                <div className="lc-action">
                  <a
                    className="lc-btn outline"
                    href="/courses/"
                  >
                    Review →
                  </a>
                </div>
              </div>

              {/* L2 In Progress */}
              <div className="level-card current">
                <div className="lc-header">
                  <span
                    className="lc-badge"
                    style={{ background: "#E8ECF4", color: "#1E3560" }}
                  >
                    Level 2 · Current
                  </span>
                  <span
                    className="lc-status"
                    style={{ color: "var(--accent)" }}
                  >
                    In progress
                  </span>
                </div>
                <div className="lc-title">Operational HR</div>
                <div className="lc-sub">
                  Hiring, performance, retention &amp; wellbeing
                </div>
                <div className="lc-progress-row">
                  <div className="lc-bar">
                    <div
                      className="lc-fill"
                      style={{ width: "75%", background: "var(--navy)" }}
                    />
                  </div>
                  <div className="lc-pct">75%</div>
                </div>
                <div className="lc-topics">
                  <span className="lc-topic">2 / 3 topics</span>
                  <span className="lc-topic">Case study</span>
                  <span className="lc-topic">2 / 3 games</span>
                </div>
                <div className="lc-action">
                  <a
                    className="lc-btn primary"
                    href="/courses/"
                  >
                    Continue →
                  </a>
                </div>
              </div>

              {/* L3 Locked */}
              <div className="level-card">
                <div className="lc-header">
                  <span
                    className="lc-badge"
                    style={{ background: "#E8ECF4", color: "#5A6880" }}
                  >
                    Level 3
                  </span>
                  <span className="lc-status">
                    <span className="lc-lock">🔒</span> Locked
                  </span>
                </div>
                <div className="lc-title">Strategic HR</div>
                <div className="lc-sub">
                  Analytics, talent management, HR strategy
                </div>
                <div className="lc-progress-row">
                  <div className="lc-bar">
                    <div
                      className="lc-fill"
                      style={{ width: "0%", background: "var(--navy)" }}
                    />
                  </div>
                  <div className="lc-pct" style={{ color: "var(--ink-4)" }}>
                    0%
                  </div>
                </div>
                <div className="lc-topics">
                  <span className="lc-topic">3 topics</span>
                  <span className="lc-topic">Case study</span>
                  <span className="lc-topic">3 games</span>
                </div>
                <div className="lc-action">
                  <span className="lc-btn locked">Complete Level 2 first</span>
                </div>
              </div>

              {/* L4 Locked */}
              <div className="level-card">
                <div className="lc-header">
                  <span
                    className="lc-badge"
                    style={{ background: "#E8ECF4", color: "#5A6880" }}
                  >
                    Level 4
                  </span>
                  <span className="lc-status">
                    <span className="lc-lock">🔒</span> Locked
                  </span>
                </div>
                <div className="lc-title">Future-Forward HR</div>
                <div className="lc-sub">
                  AI, gamification, future of work + final project
                </div>
                <div className="lc-progress-row">
                  <div className="lc-bar">
                    <div
                      className="lc-fill"
                      style={{ width: "0%", background: "var(--navy)" }}
                    />
                  </div>
                  <div className="lc-pct" style={{ color: "var(--ink-4)" }}>
                    0%
                  </div>
                </div>
                <div className="lc-topics">
                  <span className="lc-topic">3 topics</span>
                  <span className="lc-topic">Case study</span>
                  <span className="lc-topic">Final project</span>
                </div>
                <div className="lc-action">
                  <span className="lc-btn locked">Complete Level 3 first</span>
                </div>
              </div>
            </div>
          </div>

          {/* NEXT STEP BANNER */}
          <div className="next-step-banner">
            <div className="nsb-icon">📖</div>
            <div className="nsb-body">
              <div className="nsb-label">Your next step</div>
              <div className="nsb-title">
                Topic 3: Retention &amp; Employee Well-being
              </div>
              <div className="nsb-sub">
                Level 2 · Operational HR — pick up where you left off
              </div>
            </div>
            <a
              className="nsb-btn"
              href="/courses/"
            >
              Continue →
            </a>
          </div>

          {/* ACTIVITY + QUICK ACCESS */}
          <div className="two-col">
            {/* RECENT ACTIVITY */}
            <div className="activity-feed">
              <div className="section-title">Recent Activity</div>
              <div className="activity-list">
                <div className="activity-item">
                  <div
                    className="activity-icon"
                    style={{ background: "#E8ECF4" }}
                  >
                    🎮
                  </div>
                  <div>
                    <div className="activity-title">
                      Completed: Burnout Detective Game
                    </div>
                    <div className="activity-meta">Level 2 · 2 hours ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div
                    className="activity-icon"
                    style={{ background: "#E8ECF4" }}
                  >
                    📖
                  </div>
                  <div>
                    <div className="activity-title">
                      Read: Topic 2 — Performance Management
                    </div>
                    <div className="activity-meta">Level 2 · Yesterday</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div
                    className="activity-icon"
                    style={{ background: "#FDF4DD" }}
                  >
                    📚
                  </div>
                  <div>
                    <div className="activity-title">
                      Case Study: HealthCo Retention Crisis
                    </div>
                    <div className="activity-meta">
                      Case Study Vault · 2 days ago
                    </div>
                  </div>
                </div>
                <div className="activity-item">
                  <div
                    className="activity-icon"
                    style={{ background: "#e8f7ee" }}
                  >
                    ✓
                  </div>
                  <div>
                    <div className="activity-title">
                      Completed: HR Foundations (Level 1)
                    </div>
                    <div className="activity-meta">
                      3 days ago · Badge earned
                    </div>
                  </div>
                </div>
                <div className="activity-item">
                  <div
                    className="activity-icon"
                    style={{ background: "#FAF0EB" }}
                  >
                    🤖
                  </div>
                  <div>
                    <div className="activity-title">
                      AI Support: Grievance procedure question
                    </div>
                    <div className="activity-meta">
                      AI HR Support · 4 days ago
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACCESS */}
            <div className="quick-access">
              <div className="section-title">Quick Access</div>
              <div className="qa-grid">
                <Link className="qa-item" href="/case-study-vault">
                  <div className="qa-icon" style={{ background: "#FDF4DD" }}>
                    📚
                  </div>
                  <div className="qa-label">Case Study Vault</div>
                  <div className="qa-arrow">→</div>
                </Link>
                <Link className="qa-item" href="/playbook">
                  <div className="qa-icon" style={{ background: "#E8ECF4" }}>
                    📖
                  </div>
                  <div className="qa-label">Everyday HR Playbook</div>
                  <div className="qa-arrow">→</div>
                </Link>
                <Link className="qa-item" href="/ai-support">
                  <div className="qa-icon" style={{ background: "#e8f7ee" }}>
                    🤖
                  </div>
                  <div className="qa-label">AI HR Support</div>
                  <div className="qa-arrow">→</div>
                </Link>
                <Link className="qa-item" href="/innovation-lab">
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
              <div className="badge-item earned">
                <span className="badge-emoji">🧱</span>
                <div className="badge-name">
                  Foundations
                  <br />
                  Complete
                </div>
                <div className="badge-date">Earned Mar 2026</div>
              </div>
              <div className="badge-item earned">
                <span className="badge-emoji">🎮</span>
                <div className="badge-name">Game Player</div>
                <div className="badge-date">Earned Mar 2026</div>
              </div>
              <div className="badge-item earned">
                <span className="badge-emoji">📚</span>
                <div className="badge-name">Case Student</div>
                <div className="badge-date">Earned Mar 2026</div>
              </div>
              <div className="badge-item earned">
                <span className="badge-emoji">⚙️</span>
                <div className="badge-name">
                  Operational
                  <br />
                  In Progress
                </div>
                <div className="badge-date">In progress</div>
              </div>
              <div className="badge-item locked">
                <span className="badge-emoji">📊</span>
                <div className="badge-name">Strategist</div>
                <div className="badge-date">Locked</div>
              </div>
              <div className="badge-item locked">
                <span className="badge-emoji">🚀</span>
                <div className="badge-name">Innovator</div>
                <div className="badge-date">Locked</div>
              </div>
              <div className="badge-item locked">
                <span className="badge-emoji">👑</span>
                <div className="badge-name">HR Leader</div>
                <div className="badge-date">Locked</div>
              </div>
              <div className="badge-item locked">
                <span className="badge-emoji">🏆</span>
                <div className="badge-name">
                  All Levels
                  <br />
                  Complete
                </div>
                <div className="badge-date">Locked</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
