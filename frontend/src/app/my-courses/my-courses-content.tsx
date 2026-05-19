"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./my-courses.css";

/**
 * My Courses dashboard.
 *
 * Faithful port of my-courses.html. The original was static markup driven by a
 * few imperative scripts:
 *
 *  - `filter()` toggled `card.style.display` by `data-status`; now `filter`
 *    state hides cards by status.
 *  - `viewCert()` / `closeCertModal()` / `printCert()` rendered a generated
 *    certificate from the `CERTS` table. `buildCertHTML()` is kept verbatim (it
 *    produces a string used both in the in-page modal preview and in a printed
 *    `window.open` popup, exactly as before). The modal open/close is React
 *    state; Escape still closes it.
 *  - The "LIVE MODE" IIFE read `localStorage.hrph_token` and, when present,
 *    fetched WordPress/TutorLMS endpoints to swap the preview name/avatar,
 *    remove the demo banner and update the two header stats. That logic now
 *    lives in a `useEffect` and drives state. With no token the preview data
 *    stays (safe fallback), unchanged from the original.
 *
 * This page uses its own platform-style top nav (not the shared marketing
 * `.nav`), so that chrome is ported inline. Internal links with a local route
 * use Next `<Link>`; LMS course/case-study/playbook links stay plain anchors.
 */

const LIVE_CONFIG = {
  SITE_URL: "",
  COURSE_IDS: { L1: 0, L2: 0, L3: 0, L4: 0 },
  COURSE_URLS: {
    L1: "/courses/level-1-hr-foundations/",
    L2: "/courses/level-2-operational-hr/",
    L3: "/courses/level-3-strategic-hr/",
    L4: "/courses/level-4-future-forward-hr/",
  },
};

type Cert = {
  level: string;
  title: string;
  desc: string;
  extras: string;
  date: string;
  color: string;
  badge: string;
  programme: boolean;
};

const CERTS: Record<string, Cert> = {
  l1: {
    level: "Level 1",
    title: "HR Foundations",
    desc: "Topics: The HR Mindset & Function · Employment Relationships · Culture & Engagement",
    extras:
      "Case Study: TechStart Culture Clash · Games: HR Role Matcher, Culture Builder, Engagement Audit",
    date: "March 2026",
    color: "#1a7a4a",
    badge: "🏅",
    programme: false,
  },
  l2: {
    level: "Level 2",
    title: "Operational HR",
    desc: "Topics: Recruitment & Selection · Performance Management · Retention & Well-being",
    extras:
      "Case Study: HealthCo Retention Crisis · Games: Hiring Decision, Burnout Detective, Wellbeing Sprint",
    date: "",
    color: "#0D1F3C",
    badge: "🏅",
    programme: false,
  },
  l3: {
    level: "Level 3",
    title: "Strategic HR",
    desc: "Topics: HR Analytics & Metrics · Talent Management · HR Strategy & Business",
    extras:
      "Case Study: RetailCo Talent Pipeline · Games: Analytics Challenge, Talent Board, Strategy Pitch",
    date: "",
    color: "#1E3560",
    badge: "🏅",
    programme: false,
  },
  l4: {
    level: "Level 4",
    title: "Future-Forward HR",
    desc: "Topics: AI Ethics in HR · Gamification & L&D Design · Future of Work",
    extras:
      "Case Study: FintechNG AI Hiring Audit · Final Project: HR Strategy Proposal",
    date: "",
    color: "#C9501E",
    badge: "🏅",
    programme: false,
  },
  programme: {
    level: "Full Programme",
    title: "HR Playhouse Hub Professional Development Programme",
    desc: "Levels 1–4 · All topics, case studies, games and the final HR Strategy Proposal",
    extras:
      "Commonwealth Universities Grant Cohort 2026 · Recognised across the Commonwealth",
    date: "",
    color: "#C4830A",
    badge: "🏆",
    programme: true,
  },
};

function buildCertHTML(certKey: string, userName?: string) {
  const c = CERTS[certKey];
  const name = userName || "Ada Okonkwo";
  const issued = c.date || "Date of Issue";
  const borderColor = c.color;
  const isProg = c.programme;

  return [
    '<div style="position:relative;border:3px solid ' +
      borderColor +
      ";border-radius:3px;padding:" +
      (isProg ? "52px 60px" : "44px 60px") +
      ';text-align:center;background:#fff">',

    /* Decorative corner marks */
    '<div style="position:absolute;top:10px;left:10px;width:20px;height:20px;border-top:2px solid ' +
      borderColor +
      ";border-left:2px solid " +
      borderColor +
      ';opacity:.4"></div>',
    '<div style="position:absolute;top:10px;right:10px;width:20px;height:20px;border-top:2px solid ' +
      borderColor +
      ";border-right:2px solid " +
      borderColor +
      ';opacity:.4"></div>',
    '<div style="position:absolute;bottom:10px;left:10px;width:20px;height:20px;border-bottom:2px solid ' +
      borderColor +
      ";border-left:2px solid " +
      borderColor +
      ';opacity:.4"></div>',
    '<div style="position:absolute;bottom:10px;right:10px;width:20px;height:20px;border-bottom:2px solid ' +
      borderColor +
      ";border-right:2px solid " +
      borderColor +
      ';opacity:.4"></div>',

    /* Logo row */
    '<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:' +
      (isProg ? "28px" : "20px") +
      '">',
    '  <div style="width:1px;height:24px;background:' +
      borderColor +
      ';opacity:.25"></div>',
    '  <div style="font-size:11px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:' +
      borderColor +
      '">HR Playhouse Hub</div>',
    '  <div style="width:1px;height:24px;background:' +
      borderColor +
      ';opacity:.25"></div>',
    "</div>",

    /* Heading */
    '<div style="font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#9BABC0;margin-bottom:' +
      (isProg ? "20px" : "14px") +
      '">Certificate of ' +
      (isProg ? "Programme Completion" : "Level Completion") +
      "</div>",

    /* Badge emoji */
    isProg
      ? '<div style="font-size:44px;margin-bottom:16px">' + c.badge + "</div>"
      : "",

    /* This certifies */
    '<div style="font-size:14px;color:#9BABC0;margin-bottom:10px">This certifies that</div>',

    /* Name */
    '<div style="font-size:' +
      (isProg ? "40px" : "36px") +
      ';font-weight:900;color:#0A1628;line-height:1;margin-bottom:' +
      (isProg ? "20px" : "14px") +
      ';letter-spacing:-1px">' +
      name +
      "</div>",

    /* Has completed */
    '<div style="font-size:14px;color:#9BABC0;margin-bottom:12px">has successfully completed all requirements of</div>',

    /* Level + title */
    '<div style="font-size:' +
      (isProg ? "22px" : "18px") +
      ";font-weight:900;color:" +
      borderColor +
      ';letter-spacing:-.3px;margin-bottom:6px">' +
      c.level +
      "</div>",
    '<div style="font-size:' +
      (isProg ? "17px" : "15px") +
      ';font-weight:700;color:#0A1628;margin-bottom:14px">' +
      c.title +
      "</div>",

    /* Content included */
    '<div style="font-size:12px;color:#9BABC0;max-width:440px;margin:0 auto 6px;line-height:1.6">' +
      c.desc +
      "</div>",
    '<div style="font-size:11px;color:#BFCAD8;max-width:440px;margin:0 auto ' +
      (isProg ? "28px" : "20px") +
      ';line-height:1.55">' +
      c.extras +
      "</div>",

    /* Divider */
    '<div style="height:1px;background:linear-gradient(90deg,transparent,#E8ECF4,transparent);margin-bottom:' +
      (isProg ? "28px" : "20px") +
      '"></div>',

    /* Footer */
    '<div style="display:flex;justify-content:space-between;align-items:flex-end">',
    '  <div style="text-align:left">',
    '    <div style="font-size:15px;font-weight:900;color:#0A1628;margin-bottom:2px">Dr. Marvellous Gberevbie</div>',
    '    <div style="font-size:11px;color:#9BABC0">Founder &amp; CEO · HR Playhouse Hub</div>',
    isProg
      ? '    <div style="font-size:11px;color:#9BABC0;margin-top:2px">Commonwealth Universities Grant — ACU</div>'
      : "",
    "  </div>",
    '  <div style="text-align:center">',
    '    <div style="font-size:24px;margin-bottom:4px">' +
      (isProg ? "🏆" : "🏅") +
      "</div>",
    "  </div>",
    '  <div style="text-align:right">',
    '    <div style="font-size:13px;font-weight:700;color:#0A1628;margin-bottom:2px">' +
      issued +
      "</div>",
    '    <div style="font-size:11px;color:#9BABC0">Date of Issue</div>',
    '    <div style="font-size:11px;color:#9BABC0;margin-top:2px">thehrplayhousehub.org</div>',
    "  </div>",
    "</div>",

    "</div>" /* end cert wrapper */,
  ].join("");
}

function CertificatePreview({
  certKey,
  userName = "Ada Okonkwo",
}: {
  certKey: string;
  userName?: string;
}) {
  const c = CERTS[certKey];
  if (!c) return null;

  const issued = c.date || "Date of Issue";
  const isProg = c.programme;
  const cornerStyle = {
    position: "absolute" as const,
    width: 20,
    height: 20,
    borderColor: c.color,
    opacity: 0.4,
  };

  return (
    <div
      style={{
        position: "relative",
        border: `3px solid ${c.color}`,
        borderRadius: 3,
        padding: isProg ? "52px 60px" : "44px 60px",
        textAlign: "center",
        background: "#fff",
      }}
    >
      <div
        style={{
          ...cornerStyle,
          top: 10,
          left: 10,
          borderTop: `2px solid ${c.color}`,
          borderLeft: `2px solid ${c.color}`,
        }}
      />
      <div
        style={{
          ...cornerStyle,
          top: 10,
          right: 10,
          borderTop: `2px solid ${c.color}`,
          borderRight: `2px solid ${c.color}`,
        }}
      />
      <div
        style={{
          ...cornerStyle,
          bottom: 10,
          left: 10,
          borderBottom: `2px solid ${c.color}`,
          borderLeft: `2px solid ${c.color}`,
        }}
      />
      <div
        style={{
          ...cornerStyle,
          right: 10,
          bottom: 10,
          borderRight: `2px solid ${c.color}`,
          borderBottom: `2px solid ${c.color}`,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: isProg ? 28 : 20,
        }}
      >
        <div
          style={{ width: 1, height: 24, background: c.color, opacity: 0.25 }}
        />
        <div
          style={{
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: c.color,
          }}
        >
          HR Playhouse Hub
        </div>
        <div
          style={{ width: 1, height: 24, background: c.color, opacity: 0.25 }}
        />
      </div>

      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: "#9BABC0",
          marginBottom: isProg ? 20 : 14,
        }}
      >
        Certificate of {isProg ? "Programme Completion" : "Level Completion"}
      </div>

      {isProg && (
        <div style={{ fontSize: 44, marginBottom: 16 }}>{c.badge}</div>
      )}

      <div style={{ fontSize: 14, color: "#9BABC0", marginBottom: 10 }}>
        This certifies that
      </div>
      <div
        style={{
          fontSize: isProg ? 40 : 36,
          fontWeight: 900,
          color: "#0A1628",
          lineHeight: 1,
          marginBottom: isProg ? 20 : 14,
          letterSpacing: -1,
        }}
      >
        {userName}
      </div>
      <div style={{ fontSize: 14, color: "#9BABC0", marginBottom: 12 }}>
        has successfully completed all requirements of
      </div>
      <div
        style={{
          fontSize: isProg ? 22 : 18,
          fontWeight: 900,
          color: c.color,
          letterSpacing: -0.3,
          marginBottom: 6,
        }}
      >
        {c.level}
      </div>
      <div
        style={{
          fontSize: isProg ? 17 : 15,
          fontWeight: 700,
          color: "#0A1628",
          marginBottom: 14,
        }}
      >
        {c.title}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#9BABC0",
          maxWidth: 440,
          margin: "0 auto 6px",
          lineHeight: 1.6,
        }}
      >
        {c.desc}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#BFCAD8",
          maxWidth: 440,
          margin: `0 auto ${isProg ? 28 : 20}px`,
          lineHeight: 1.55,
        }}
      >
        {c.extras}
      </div>

      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg,transparent,#E8ECF4,transparent)",
          marginBottom: isProg ? 28 : 20,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 900,
              color: "#0A1628",
              marginBottom: 2,
            }}
          >
            Dr. Marvellous Gberevbie
          </div>
          <div style={{ fontSize: 11, color: "#9BABC0" }}>
            Founder &amp; CEO · HR Playhouse Hub
          </div>
          {isProg && (
            <div style={{ fontSize: 11, color: "#9BABC0", marginTop: 2 }}>
              Commonwealth Universities Grant — ACU
            </div>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>
            {isProg ? "🏆" : "🏅"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#0A1628",
              marginBottom: 2,
            }}
          >
            {issued}
          </div>
          <div style={{ fontSize: 11, color: "#9BABC0" }}>Date of Issue</div>
          <div style={{ fontSize: 11, color: "#9BABC0", marginTop: 2 }}>
            thehrplayhousehub.org
          </div>
        </div>
      </div>
    </div>
  );
}

function printCert(certKey: string) {
  const key = certKey || "l1";
  const certHTML = buildCertHTML(key, "Ada Okonkwo");
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(
    [
      '<!DOCTYPE html><html><head><meta charset="UTF-8">',
      "<title>Certificate — HR Playhouse Hub</title>",
      '<link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600&display=swap" rel="stylesheet">',
      "<style>",
      "*{box-sizing:border-box;margin:0;padding:0}",
      'body{background:#f8f9fc;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:"Plus Jakarta Sans",sans-serif;padding:40px}',
      'body > div{font-family:"Cabinet Grotesk",sans-serif;max-width:740px;width:100%}',
      "@media print{body{background:#fff;padding:0} body>div{max-width:100%}}",
      ".cert-actions{text-align:center;margin-bottom:24px;display:flex;gap:12px;justify-content:center}",
      ".cert-actions button{height:40px;padding:0 24px;border-radius:100px;font-size:14px;font-weight:700;cursor:pointer;border:none;transition:.15s}",
      ".btn-print{background:#C9501E;color:#fff}",
      ".btn-close{background:#E8ECF4;color:#0A1628}",
      "@media print{.cert-actions{display:none}}",
      "</style></head><body>",
      "<div>",
      '<div class="cert-actions">',
      '<button class="btn-print" onclick="window.print()">🖨 Print / Save as PDF</button>',
      '<button class="btn-close" onclick="window.close()">Close</button>',
      "</div>",
      certHTML,
      "</div>",
      "</body></html>",
    ].join(""),
  );
  win.document.close();
}

export default function MyCoursesContent() {
  const [navOpen, setNavOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [currentCertId, setCurrentCertId] = useState<string | null>(null);

  // LIVE MODE state (preview defaults, overwritten only when a token + API
  // succeed — exactly like the original IIFE).
  const [bannerHidden, setBannerHidden] = useState(false);
  const [userName, setUserName] = useState("Ada Okonkwo");
  const [userInitials, setUserInitials] = useState("AO");
  const [statCompleted, setStatCompleted] = useState<string | number>(1);
  const [statProgress, setStatProgress] = useState("75%");

  function viewCert(certKey: string) {
    setCurrentCertId(certKey);
  }
  function closeCertModal() {
    setCurrentCertId(null);
  }

  // Escape closes the certificate modal (original document keydown listener).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setCurrentCertId(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while the modal is open (original toggled
  // document.body.style.overflow).
  useEffect(() => {
    if (currentCertId) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [currentCertId]);

  // LIVE API MODE — activates only when a token exists.
  useEffect(() => {
    const token = localStorage.getItem("hrph_token");
    if (!token) return; // No token = stay in preview mode, nothing breaks

    const base = LIVE_CONFIG.SITE_URL + "/wp-json";

    function apiFetch(endpoint: string) {
      return fetch(base + endpoint, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      });
    }

    function ini(name: string) {
      return (name || "?")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    Promise.all([
      apiFetch("/wp/v2/users/me?context=edit"),
      apiFetch("/tutor/v1/course-progress/" + LIVE_CONFIG.COURSE_IDS.L1),
      apiFetch("/tutor/v1/course-progress/" + LIVE_CONFIG.COURSE_IDS.L2),
      apiFetch("/tutor/v1/course-progress/" + LIVE_CONFIG.COURSE_IDS.L3),
      apiFetch("/tutor/v1/course-progress/" + LIVE_CONFIG.COURSE_IDS.L4),
    ])
      .then((results) => {
        const user = results[0];
        const progL1 = results[1];
        const progL2 = results[2];
        const progL3 = results[3];
        const progL4 = results[4];

        const name =
          user.name ||
          ((user.first_name || "") + " " + (user.last_name || "")).trim() ||
          user.username;
        const initials = ini(name);

        setUserInitials(initials);
        setUserName(name);
        setBannerHidden(true);

        const pct1 = Math.round((progL1 || {}).completed_percent || 0);
        const pct2 = Math.round((progL2 || {}).completed_percent || 0);
        const pct3 = Math.round((progL3 || {}).completed_percent || 0);
        const pct4 = Math.round((progL4 || {}).completed_percent || 0);

        const completed = [pct1, pct2, pct3, pct4].filter(
          (p) => p >= 100,
        ).length;
        const curPct = pct2 < 100 ? pct2 : pct3 < 100 ? pct3 : pct4;
        setStatCompleted(completed);
        setStatProgress(curPct + "%");

        console.log(
          "HR Playhouse Hub: Live data loaded for",
          name,
          "| L1:",
          pct1 + "%",
          "| L2:",
          pct2 + "%",
          "| L3:",
          pct3 + "%",
          "| L4:",
          pct4 + "%",
        );
      })
      .catch((err) => {
        console.warn(
          "HR Playhouse Hub: API load failed, showing preview data.",
          err,
        );
      });
  }, []);

  const showCard = (status: string) => filter === "all" || filter === status;

  const cert = currentCertId ? CERTS[currentCertId] : null;

  return (
    <>
      {/* DEMO BANNER */}
      {!bannerHidden && (
        <div className="demo-banner">
          <span>👆</span>
          <span>
            <strong>Design Preview Mode</strong> — showing sample data. Stephen:
            connect TutorLMS API and remove this banner. Full instructions in
            the &lt;script&gt; block.
          </span>
        </div>
      )}

      {/* NAV */}
      <nav className="topnav">
        <a className="nav-logo" href="https://www.thehrplayhousehub.org/">
          <div className="nav-logo-pill">HR Playhouse</div>
          <div className="nav-logo-text">Hub</div>
        </a>
        <div className={`topnav-links${navOpen ? " open" : ""}`}>
          <Link className="tnl" href="/dashboard">
            Dashboard
          </Link>
          <Link className="tnl active" href="/my-courses">
            My Courses
          </Link>
          <a
            className="tnl"
            href="/case-study-vault/"
          >
            Case Studies
          </a>
          <a
            className="tnl"
            href="/playbook/"
          >
            Playbook
          </a>
          <Link className="tnl" href="/innovation-lab">
            Innovation Lab
          </Link>
          <Link className="tnl" href="/ai-support">
            AI Support
          </Link>
        </div>
        <button
          className="mc-hamburger"
          onClick={() => setNavOpen((v) => !v)}
          style={{
            display: "none",
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
            marginLeft: "auto",
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
          <div className="user-avatar">{userInitials}</div>
        </div>
      </nav>

      <div className="dashboard">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="user-card">
            <div className="uc-avatar">{userInitials}</div>
            <div className="uc-name">{userName}</div>
            <div className="uc-role">HR Business Partner · Lagos, Nigeria</div>
            <div className="uc-level-badge">
              <div className="uc-level-dot" />
              <span>Level 2 — Operational HR</span>
            </div>
            <div className="uc-divider" />
            <div className="uc-stat-row">
              <div className="uc-stat">
                <div className="uc-stat-n">1</div>
                <div className="uc-stat-l">Completed</div>
              </div>
              <div className="uc-stat">
                <div className="uc-stat-n">12</div>
                <div className="uc-stat-l">Cases Read</div>
              </div>
              <div className="uc-stat">
                <div className="uc-stat-n">3</div>
                <div className="uc-stat-l">Badges</div>
              </div>
            </div>
          </div>

          <div className="side-nav">
            <Link className="sn-item" href="/dashboard">
              <div className="sn-icon" style={{ background: "#E8ECF4" }}>
                📊
              </div>
              My Dashboard
            </Link>
            <Link className="sn-item active" href="/my-courses">
              <div className="sn-icon" style={{ background: "#E8ECF4" }}>
                🎓
              </div>
              My Courses
            </Link>
            <a
              className="sn-item"
              href="/case-study-vault/"
            >
              <div className="sn-icon" style={{ background: "#FDF4DD" }}>
                📚
              </div>
              Case Studies
              <span className="sn-badge">32</span>
            </a>
            <a
              className="sn-item"
              href="/playbook/"
            >
              <div className="sn-icon" style={{ background: "#E8ECF4" }}>
                📖
              </div>
              HR Playbook
            </a>
            <Link className="sn-item" href="/innovation-lab">
              <div className="sn-icon" style={{ background: "#FAF0EB" }}>
                🔬
              </div>
              Innovation Lab
            </Link>
            <Link className="sn-item" href="/ai-support">
              <div className="sn-icon" style={{ background: "#e8f7ee" }}>
                🤖
              </div>
              AI HR Support
            </Link>
          </div>

          <div className="dev-note">
            <div className="dev-note-title">🔧 Stephen — Integration Note</div>
            <div className="dev-note-body">
              TutorLMS REST endpoints needed:
              <br />
              <br />• User: <code>/wp-json/wp/v2/users/me</code>
              <br />• Progress:{" "}
              <code>/wp-json/tutor/v1/course-progress/{"{id}"}</code>
              <br />• Enrolled: <code>/wp-json/tutor/v1/enrolled-courses</code>
              <br />
              <br />
              Set course IDs + URLs in the CONFIG block in the &lt;script&gt;.
              JWT token from <code>localStorage.hrph_token</code>.
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* PAGE HEADER */}
          <div className="page-header">
            <div>
              <div className="ph-eyebrow">{userName} · HR Business Partner</div>
              <div className="ph-title">My Courses 🎓</div>
              <div className="ph-sub">
                4 levels · Level 1 complete · Level 2 in progress · 75% of your
                journey done
              </div>
            </div>
            <div className="ph-stats">
              <div className="ph-stat">
                <div className="ph-stat-n">{statCompleted}</div>
                <div className="ph-stat-l">Completed</div>
              </div>
              <div className="ph-div" />
              <div className="ph-stat">
                <div className="ph-stat-n">{statProgress}</div>
                <div className="ph-stat-l">Current level</div>
              </div>
              <div className="ph-div" />
              <div className="ph-stat">
                <div className="ph-stat-n">2</div>
                <div className="ph-stat-l">Locked</div>
              </div>
            </div>
          </div>

          {/* PROGRESS RING STRIP */}
          <div className="progress-strip">
            {/* L1 Complete */}
            <div className="ps-item">
              <div className="ps-ring-wrap">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle
                    fill="none"
                    stroke="var(--mist)"
                    strokeWidth="5"
                    cx="32"
                    cy="32"
                    r="27"
                  />
                  <circle
                    fill="none"
                    stroke="var(--green)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    cx="32"
                    cy="32"
                    r="27"
                    strokeDasharray="169.6"
                    strokeDashoffset="0"
                  />
                </svg>
                <div
                  className="ps-ring-label"
                  style={{ color: "var(--green)" }}
                >
                  ✓
                </div>
              </div>
              <div className="ps-level">Level 1</div>
              <div className="ps-name">HR Foundations</div>
              <div
                className="ps-status"
                style={{ color: "var(--green)", fontWeight: 600 }}
              >
                Complete
              </div>
            </div>

            {/* L2 In Progress */}
            <div className="ps-item">
              <div className="ps-ring-wrap">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle
                    fill="none"
                    stroke="var(--mist)"
                    strokeWidth="5"
                    cx="32"
                    cy="32"
                    r="27"
                  />
                  <circle
                    fill="none"
                    stroke="var(--navy)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    cx="32"
                    cy="32"
                    r="27"
                    strokeDasharray="169.6"
                    strokeDashoffset="42.4"
                  />
                </svg>
                <div
                  className="ps-ring-label"
                  style={{ color: "var(--navy)" }}
                >
                  75%
                </div>
              </div>
              <div className="ps-level">Level 2 · Current</div>
              <div className="ps-name">Operational HR</div>
              <div
                className="ps-status"
                style={{ color: "var(--accent)", fontWeight: 600 }}
              >
                In progress
              </div>
            </div>

            {/* L3 Locked */}
            <div className="ps-item" style={{ opacity: 0.4 }}>
              <div className="ps-ring-wrap">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle
                    fill="none"
                    stroke="var(--mist)"
                    strokeWidth="5"
                    cx="32"
                    cy="32"
                    r="27"
                  />
                  <circle
                    fill="none"
                    stroke="var(--ink-4)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    cx="32"
                    cy="32"
                    r="27"
                    strokeDasharray="169.6"
                    strokeDashoffset="169.6"
                  />
                </svg>
                <div className="ps-ring-label" style={{ fontSize: 16 }}>
                  🔒
                </div>
              </div>
              <div className="ps-level">Level 3</div>
              <div className="ps-name">Strategic HR</div>
              <div className="ps-status">Locked</div>
            </div>

            {/* L4 Locked */}
            <div className="ps-item" style={{ opacity: 0.4 }}>
              <div className="ps-ring-wrap">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle
                    fill="none"
                    stroke="var(--mist)"
                    strokeWidth="5"
                    cx="32"
                    cy="32"
                    r="27"
                  />
                  <circle
                    fill="none"
                    stroke="var(--ink-4)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    cx="32"
                    cy="32"
                    r="27"
                    strokeDasharray="169.6"
                    strokeDashoffset="169.6"
                  />
                </svg>
                <div className="ps-ring-label" style={{ fontSize: 16 }}>
                  🔒
                </div>
              </div>
              <div className="ps-level">Level 4</div>
              <div className="ps-name">Future-Forward HR</div>
              <div className="ps-status">Locked</div>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="filter-bar">
            <button
              className={`filter-tab${filter === "all" ? " active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All levels
            </button>
            <button
              className={`filter-tab${filter === "complete" ? " active" : ""}`}
              onClick={() => setFilter("complete")}
            >
              ✓ Completed
            </button>
            <button
              className={`filter-tab${filter === "current" ? " active" : ""}`}
              onClick={() => setFilter("current")}
            >
              In progress
            </button>
            <button
              className={`filter-tab${filter === "locked" ? " active" : ""}`}
              onClick={() => setFilter("locked")}
            >
              🔒 Locked
            </button>
          </div>

          {/* COURSE CARDS */}
          <div className="courses-stack">
            {/* LEVEL 1 — COMPLETE */}
            <div
              className="course-card"
              data-status="complete"
              style={{ display: showCard("complete") ? "block" : "none" }}
            >
              <div className="cc-bar" style={{ background: "var(--green)" }} />
              <div className="cc-body">
                <div className="cc-top">
                  <div>
                    <div className="cc-meta">
                      <span
                        className="cc-level-pill"
                        style={{
                          background: "var(--green-pale)",
                          color: "var(--green)",
                        }}
                      >
                        Level 1
                      </span>
                      <span
                        className="cc-status-pill"
                        style={{ color: "var(--green)" }}
                      >
                        ✓ Completed · March 2026
                      </span>
                    </div>
                    <div className="cc-title">HR Foundations</div>
                    <div className="cc-desc">
                      Build the mindset, vocabulary and toolkit of a confident
                      HR professional. Covers the HR function, employment
                      relationships, workplace culture and engagement from the
                      ground up.
                    </div>
                  </div>
                  <div className="cc-right">
                    <div
                      className="cc-pct-big"
                      style={{ color: "var(--green)" }}
                    >
                      100%
                    </div>
                    <div className="cc-pct-label">Complete</div>
                  </div>
                </div>

                <div className="cc-progress-row">
                  <div className="cc-bar-wrap">
                    <div
                      className="cc-bar-fill"
                      style={{ width: "100%", background: "var(--green)" }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: 13,
                      fontWeight: 900,
                      color: "var(--green)",
                      flexShrink: 0,
                    }}
                  >
                    100%
                  </span>
                </div>

                <div className="cc-topics-row">
                  <div className="cc-topic-block">
                    <div className="ctb-label">Topics</div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>The HR Mindset &amp; Function</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>Employment Relationships</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>Culture &amp; Engagement</span>
                    </div>
                  </div>
                  <div className="cc-topic-block">
                    <div className="ctb-label">Case Study</div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>TechStart Culture Clash</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>Reflection submitted</span>
                    </div>
                  </div>
                  <div className="cc-topic-block">
                    <div className="ctb-label">Games &amp; Activities</div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>HR Role Matcher</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>Culture Builder Game</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>Engagement Audit</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cc-footer">
                <div className="cc-footer-info">
                  <span>📅 Completed March 2026</span>
                  <span>⏱ ~6 hrs total</span>
                  <span>🏅 Badge earned</span>
                </div>
                <div className="cc-actions">
                  <a
                    className="cc-btn outline"
                    href="/courses/"
                  >
                    Review level →
                  </a>
                  <a className="cc-btn primary" href="#cert-section">
                    View certificate →
                  </a>
                </div>
              </div>
            </div>

            {/* LEVEL 2 — CURRENT */}
            <div
              className="course-card current"
              data-status="current"
              style={{ display: showCard("current") ? "block" : "none" }}
            >
              <div className="cc-bar" style={{ background: "var(--navy)" }} />
              <div className="cc-body">
                <div className="cc-top">
                  <div>
                    <div className="cc-meta">
                      <span
                        className="cc-level-pill"
                        style={{ background: "#E8ECF4", color: "#1E3560" }}
                      >
                        Level 2 · Current
                      </span>
                      <span
                        className="cc-status-pill"
                        style={{ color: "var(--accent)" }}
                      >
                        ● In progress — 75% done
                      </span>
                    </div>
                    <div className="cc-title">Operational HR</div>
                    <div className="cc-desc">
                      The day-to-day engine of HR practice. Covers the full
                      hiring lifecycle, performance management, retention
                      strategy and employee wellbeing — with real cases from
                      Nigerian and Commonwealth organisations.
                    </div>
                  </div>
                  <div className="cc-right">
                    <div
                      className="cc-pct-big"
                      style={{ color: "var(--navy)" }}
                    >
                      75%
                    </div>
                    <div className="cc-pct-label">In progress</div>
                  </div>
                </div>

                <div className="cc-progress-row">
                  <div className="cc-bar-wrap">
                    <div
                      className="cc-bar-fill"
                      style={{ width: "75%", background: "var(--navy)" }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: 13,
                      fontWeight: 900,
                      color: "var(--navy)",
                      flexShrink: 0,
                    }}
                  >
                    75%
                  </span>
                </div>

                <div className="cc-topics-row">
                  <div className="cc-topic-block">
                    <div className="ctb-label">Topics</div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>Recruitment &amp; Selection</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>Performance Management</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot active">→</div>
                      <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                        Retention &amp; Wellbeing
                      </span>
                    </div>
                  </div>
                  <div className="cc-topic-block">
                    <div className="ctb-label">Case Study</div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>HealthCo Retention Crisis</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot active">→</div>
                      <span style={{ color: "var(--ink-3)" }}>
                        Reflection pending
                      </span>
                    </div>
                  </div>
                  <div className="cc-topic-block">
                    <div className="ctb-label">Games &amp; Activities</div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>Hiring Decision Game</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot done">✓</div>
                      <span>Burnout Detective</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>Wellbeing Sprint</span>
                    </div>
                  </div>
                </div>

                {/* Next up */}
                <div className="next-up-box">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: "var(--accent-pale)",
                        border: "1px solid rgba(201,80,30,.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      📖
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--f-body)",
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: ".07em",
                          color: "var(--ink-4)",
                          marginBottom: 2,
                        }}
                      >
                        Next up
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--f-display)",
                          fontSize: 14,
                          fontWeight: 800,
                          color: "var(--ink)",
                        }}
                      >
                        Topic 3: Retention &amp; Employee Well-being
                      </div>
                    </div>
                  </div>
                  <a
                    className="cc-btn accent"
                    href="/courses/"
                  >
                    Continue →
                  </a>
                </div>
              </div>
              <div className="cc-footer">
                <div className="cc-footer-info">
                  <span>📅 Started Feb 2026</span>
                  <span>⏱ ~4.5 hrs remaining</span>
                  <span>🎯 2 of 3 topics done</span>
                </div>
                <div className="cc-actions">
                  <a
                    className="cc-btn outline"
                    href="/courses/"
                  >
                    View all lessons
                  </a>
                  <a
                    className="cc-btn accent"
                    href="/courses/"
                  >
                    Continue learning →
                  </a>
                </div>
              </div>
            </div>

            {/* LEVEL 3 — LOCKED */}
            <div
              className="course-card locked"
              data-status="locked"
              style={{ display: showCard("locked") ? "block" : "none" }}
            >
              <div className="cc-bar" style={{ background: "var(--mist)" }} />
              <div className="cc-body">
                <div className="cc-top">
                  <div>
                    <div className="cc-meta">
                      <span
                        className="cc-level-pill"
                        style={{ background: "#E8ECF4", color: "#5A6880" }}
                      >
                        Level 3
                      </span>
                      <span
                        className="cc-status-pill"
                        style={{ color: "var(--ink-4)" }}
                      >
                        🔒 Locked — complete Level 2 first
                      </span>
                    </div>
                    <div className="cc-title" style={{ color: "var(--ink-3)" }}>
                      Strategic HR
                    </div>
                    <div className="cc-desc">
                      Move from managing HR to shaping it. Analytics-driven
                      people decisions, talent management frameworks, HR
                      strategy design, and presenting a compelling people case
                      to leadership.
                    </div>
                  </div>
                  <div className="cc-right">
                    <div
                      className="cc-pct-big"
                      style={{ color: "var(--ink-4)" }}
                    >
                      0%
                    </div>
                    <div className="cc-pct-label">Locked</div>
                  </div>
                </div>
                <div className="cc-progress-row">
                  <div className="cc-bar-wrap">
                    <div
                      className="cc-bar-fill"
                      style={{ width: "0%", background: "var(--ink-4)" }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: 13,
                      fontWeight: 900,
                      color: "var(--ink-4)",
                      flexShrink: 0,
                    }}
                  >
                    0%
                  </span>
                </div>
                <div className="cc-topics-row" style={{ opacity: 0.5 }}>
                  <div className="cc-topic-block">
                    <div className="ctb-label">Topics</div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>HR Analytics &amp; Metrics</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>Talent Management</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>HR Strategy &amp; Business</span>
                    </div>
                  </div>
                  <div className="cc-topic-block">
                    <div className="ctb-label">Case Study</div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>RetailCo Talent Pipeline</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>Reflection exercise</span>
                    </div>
                  </div>
                  <div className="cc-topic-block">
                    <div className="ctb-label">Games &amp; Activities</div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>Analytics Challenge</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>Talent Board Simulator</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>Strategy Pitch</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cc-footer">
                <div className="cc-footer-info">
                  <span>🔒 Unlocks when Level 2 is complete</span>
                  <span>⏱ ~8 hrs estimated</span>
                </div>
                <div className="cc-actions">
                  <span className="cc-btn disabled">🔒 Locked</span>
                </div>
              </div>
            </div>

            {/* LEVEL 4 — LOCKED */}
            <div
              className="course-card locked"
              data-status="locked"
              style={{ display: showCard("locked") ? "block" : "none" }}
            >
              <div className="cc-bar" style={{ background: "var(--mist)" }} />
              <div className="cc-body">
                <div className="cc-top">
                  <div>
                    <div className="cc-meta">
                      <span
                        className="cc-level-pill"
                        style={{ background: "#E8ECF4", color: "#5A6880" }}
                      >
                        Level 4
                      </span>
                      <span
                        className="cc-status-pill"
                        style={{ color: "var(--ink-4)" }}
                      >
                        🔒 Locked — complete Level 3 first
                      </span>
                    </div>
                    <div className="cc-title" style={{ color: "var(--ink-3)" }}>
                      Future-Forward HR
                    </div>
                    <div className="cc-desc">
                      The frontier of HR practice. AI ethics in hiring,
                      gamification in L&amp;D, the future of work, and your
                      final HR Strategy Proposal — a real portfolio piece you
                      own and keep.
                    </div>
                  </div>
                  <div className="cc-right">
                    <div
                      className="cc-pct-big"
                      style={{ color: "var(--ink-4)" }}
                    >
                      0%
                    </div>
                    <div className="cc-pct-label">Locked</div>
                  </div>
                </div>
                <div className="cc-progress-row">
                  <div className="cc-bar-wrap">
                    <div
                      className="cc-bar-fill"
                      style={{ width: "0%", background: "var(--ink-4)" }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: 13,
                      fontWeight: 900,
                      color: "var(--ink-4)",
                      flexShrink: 0,
                    }}
                  >
                    0%
                  </span>
                </div>
                <div className="cc-topics-row" style={{ opacity: 0.5 }}>
                  <div className="cc-topic-block">
                    <div className="ctb-label">Topics</div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>AI Ethics in HR</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>Gamification &amp; L&amp;D Design</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>Future of Work</span>
                    </div>
                  </div>
                  <div className="cc-topic-block">
                    <div className="ctb-label">Case Study</div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>FintechNG AI Hiring Audit</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>Reflection exercise</span>
                    </div>
                  </div>
                  <div className="cc-topic-block">
                    <div className="ctb-label">Final Project</div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>HR Strategy Proposal</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>Peer review round</span>
                    </div>
                    <div className="ctb-item">
                      <div className="ctb-dot todo">·</div>
                      <span>Final certificate</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cc-footer">
                <div className="cc-footer-info">
                  <span>🔒 Unlocks when Level 3 is complete</span>
                  <span>⏱ ~10 hrs estimated</span>
                  <span>🏆 Final certificate on completion</span>
                </div>
                <div className="cc-actions">
                  <span className="cc-btn disabled">🔒 Locked</span>
                </div>
              </div>
            </div>
          </div>
          {/* /courses-stack */}

          {/* CERTIFICATES */}
          <div className="cert-section" id="cert-section">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div className="section-title" style={{ marginBottom: 4 }}>
                  My Certificates
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 13,
                    color: "var(--ink-4)",
                  }}
                >
                  Certificates are issued automatically when you complete each
                  level. Your programme certificate unlocks when all four levels
                  and the final project are done.
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--f-body)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--green)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--green)",
                  }}
                />
                1 of 5 earned
              </div>
            </div>

            {/* Level certificates — 2 col grid */}
            <div className="cert-grid" style={{ marginBottom: 14 }}>
              {/* L1 EARNED */}
              <div className="cert-item earned" onClick={() => viewCert("l1")}>
                <div
                  className="cert-icon"
                  style={{ background: "var(--green-pale)" }}
                >
                  🏅
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".07em",
                      color: "var(--green)",
                      marginBottom: 3,
                    }}
                  >
                    ✓ Earned · March 2026
                  </div>
                  <div className="cert-title">Level 1 — HR Foundations</div>
                  <div className="cert-date">
                    Issued automatically on completion
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    alignItems: "flex-end",
                    flexShrink: 0,
                  }}
                >
                  <div className="cert-action">View →</div>
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 11,
                      color: "var(--ink-4)",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      printCert("l1");
                    }}
                  >
                    Print / Save
                  </div>
                </div>
              </div>

              {/* L2 LOCKED */}
              <div className="cert-item locked-cert">
                <div className="cert-icon" style={{ background: "#E8ECF4" }}>
                  🏅
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".07em",
                      color: "var(--ink-4)",
                      marginBottom: 3,
                    }}
                  >
                    🔒 Locked
                  </div>
                  <div className="cert-title">Level 2 — Operational HR</div>
                  <div className="cert-date">
                    Auto-issued when Level 2 is complete
                  </div>
                </div>
              </div>

              {/* L3 LOCKED */}
              <div className="cert-item locked-cert">
                <div className="cert-icon" style={{ background: "#E8ECF4" }}>
                  🏅
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".07em",
                      color: "var(--ink-4)",
                      marginBottom: 3,
                    }}
                  >
                    🔒 Locked
                  </div>
                  <div className="cert-title">Level 3 — Strategic HR</div>
                  <div className="cert-date">
                    Auto-issued when Level 3 is complete
                  </div>
                </div>
              </div>

              {/* L4 LOCKED */}
              <div className="cert-item locked-cert">
                <div className="cert-icon" style={{ background: "#E8ECF4" }}>
                  🏅
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".07em",
                      color: "var(--ink-4)",
                      marginBottom: 3,
                    }}
                  >
                    🔒 Locked
                  </div>
                  <div className="cert-title">Level 4 — Future-Forward HR</div>
                  <div className="cert-date">
                    Auto-issued when Level 4 is complete
                  </div>
                </div>
              </div>
            </div>

            {/* PROGRAMME CERTIFICATE — full width, special treatment */}
            <div
              style={{
                borderRadius: 14,
                border: "2px dashed rgba(10,22,40,.15)",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                background:
                  "linear-gradient(135deg,rgba(13,31,60,.02),rgba(201,80,30,.02))",
                opacity: 0.5,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "#E8ECF4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                🏆
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    color: "var(--ink-4)",
                    marginBottom: 5,
                  }}
                >
                  🔒 Programme Certificate — Locked
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 17,
                    fontWeight: 900,
                    color: "var(--ink)",
                    marginBottom: 4,
                    letterSpacing: "-.3px",
                  }}
                >
                  HR Playhouse Hub — Full Programme Certificate
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-body)",
                    fontSize: 13,
                    color: "var(--ink-3)",
                    lineHeight: 1.55,
                  }}
                >
                  Awarded on completion of all 4 levels, all case studies, all
                  games, and the final HR Strategy Proposal. This is the highest
                  credential issued by HR Playhouse Hub — recognised across the
                  Commonwealth.
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--f-body)",
                  fontSize: 12,
                  color: "var(--ink-4)",
                  flexShrink: 0,
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                Complete all 4
                <br />
                levels to unlock
              </div>
            </div>
          </div>

          {/* CERTIFICATE VIEWER MODAL */}
          {cert && currentCertId && (
            <div
              style={{
                display: "flex",
                position: "fixed",
                inset: 0,
                zIndex: 200,
                background: "rgba(7,15,30,.75)",
                backdropFilter: "blur(12px)",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) closeCertModal();
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 4,
                  width: "100%",
                  maxWidth: 780,
                  overflow: "hidden",
                  boxShadow: "0 32px 80px rgba(7,15,30,.4)",
                  animation: "certIn .3s ease",
                }}
              >
                {/* Modal top bar */}
                <div
                  style={{
                    background: "var(--navy)",
                    padding: "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--f-body)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "rgba(255,255,255,.6)",
                    }}
                  >
                    Certificate Preview
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <button
                      onClick={() => printCert(currentCertId)}
                      style={{
                        height: 32,
                        padding: "0 16px",
                        borderRadius: 100,
                        background: "var(--accent)",
                        color: "#fff",
                        border: "none",
                        fontFamily: "var(--f-body)",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      🖨 Print / Save PDF
                    </button>
                    <button
                      onClick={closeCertModal}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,.1)",
                        border: "none",
                        color: "rgba(255,255,255,.7)",
                        fontSize: 18,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
                {/* Certificate body */}
                <div
                  style={{
                    padding: "48px 64px",
                    textAlign: "center",
                    fontFamily: "sans-serif",
                  }}
                >
                  <CertificatePreview
                    certKey={currentCertId}
                    userName="Ada Okonkwo"
                  />
                </div>
              </div>
            </div>
          )}

          {/* NEXT STEP BANNER */}
          <div className="next-step-banner">
            <div className="nsb-icon">📖</div>
            <div className="nsb-body">
              <div className="nsb-label">Your next step — Level 2</div>
              <div className="nsb-title">
                Topic 3: Retention &amp; Employee Well-being
              </div>
              <div className="nsb-sub">
                Operational HR · Pick up where you left off — 25% of this level
                remaining
              </div>
            </div>
            <a
              className="nsb-btn"
              href="/courses/"
            >
              Continue →
            </a>
          </div>
        </main>
      </div>
    </>
  );
}
