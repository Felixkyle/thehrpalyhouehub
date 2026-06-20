"use client";

import { useEffect, useRef, useState } from "react";
import "./email-sender.css";

/**
 * Internal email-template builder (team tool).
 *
 * NOTE: the original page does NOT load EmailJS or any external CDN script — it sends via
 * a `mailto:` link and gates access with a SHA-256 hash check using the Web
 * Crypto API. There is therefore no external library to load via `next/script`.
 *
 * The original built the live email preview by assigning an HTML string to
 * `innerHTML`; that string-building logic has been re-expressed as real React
 * JSX components (preserving the `header`, `signoff`, `footer`, `esc`,
 * `LEVEL_DATA` / `PROGRESS_DATA` / `TEMPLATES` constants, and the
 * `new Date().toLocaleDateString` calls verbatim). The recipient form, template
 * picker, conditional level/progress fields, mailto subject/body, clipboard
 * copy, print-preview window, sent log, nav status, toast, and the password
 * gate (same SHA-256 digest comparison + `sessionStorage` key) all preserve
 * their original behaviour, now driven by React state.
 *
 * This is an app tool with its own `.app-nav` chrome, ported inline.
 */

type TemplateId = "announce" | "complete" | "nudge" | "programme";

const TEMPLATES: Record<
  TemplateId,
  { label: string; levelField: boolean; progressField: boolean }
> = {
  announce: {
    label: "Programme Announcement",
    levelField: false,
    progressField: false,
  },
  complete: {
    label: "Level Completion",
    levelField: true,
    progressField: false,
  },
  nudge: { label: "Progress Nudge", levelField: false, progressField: true },
  programme: {
    label: "Programme Certificate",
    levelField: false,
    progressField: false,
  },
};

const LEVEL_DATA: Record<
  number,
  { name: string; topics: string; cs: string; games: string }
> = {
  1: {
    name: "HR Foundations",
    topics:
      "The HR Mindset & Function · Employment Relationships · Culture & Engagement",
    cs: "TechStart Culture Clash",
    games: "HR Role Matcher, Culture Builder, Engagement Audit",
  },
  2: {
    name: "Operational HR",
    topics:
      "Recruitment & Selection · Performance Management · Retention & Wellbeing",
    cs: "HealthCo Retention Crisis",
    games: "Hiring Decision Game, Burnout Detective, Wellbeing Sprint",
  },
  3: {
    name: "Strategic HR",
    topics:
      "HR Analytics & Metrics · Talent Management · HR Strategy & Business",
    cs: "RetailCo Talent Pipeline",
    games: "Analytics Challenge, Talent Board, Strategy Pitch",
  },
  4: {
    name: "Future-Forward HR",
    topics:
      "AI Ethics in HR · Gamification & L&D Design · Future of Work",
    cs: "FintechNG AI Hiring Audit",
    games: "AI Ethics Simulator, L&D Sprint, Future Scenarios",
  },
};

const PROGRESS_DATA: Record<
  string,
  { level: number; pct: number; topic: string; remaining: string }
> = {
  L1_30: { level: 1, pct: 30, topic: "Employment Relationships", remaining: "~4 hrs" },
  L1_60: { level: 1, pct: 60, topic: "Culture & Engagement", remaining: "~2.5 hrs" },
  L2_30: { level: 2, pct: 30, topic: "Performance Management", remaining: "~5.5 hrs" },
  L2_75: { level: 2, pct: 75, topic: "Retention & Wellbeing", remaining: "~2 hrs" },
  L3_30: { level: 3, pct: 30, topic: "Talent Management", remaining: "~5.5 hrs" },
  L3_60: { level: 3, pct: 60, topic: "HR Strategy & Business", remaining: "~3 hrs" },
};

function esc(s: unknown): string {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function header(): string {
  return '<div class="e-header"><div class="e-pill">HR Playhouse</div><div class="e-logo-text">Hub</div></div>';
}

function signoff(tone?: string): string {
  const word = tone || "warmth";
  return [
    '<div class="e-divider"></div>',
    '<div class="e-signoff">With ' + word + ",</div>",
    '<div class="e-name">Dr. Marvellous Gberevbie</div>',
    '<div class="e-role-sig">Founder &amp; CEO · HR Playhouse Hub Limited</div>',
  ].join("");
}

function footer(): string {
  return [
    '<div class="e-footer">',
    '  <div class="e-footer-links"><a href="https://www.thehrplayhousehub.org/">Website</a><a href="/learn/my-courses">Courses</a><a href="/learn/case-study-vault">Case Studies</a><a href="/learn/ai-support">AI Support</a></div>',
    '  <div class="e-footer-addr">The HR Playhouse Hub Limited · RC 8387672 · thehrplayhousehub.org · contact@thehrplayhousehub.org</div>',
    '  <div class="e-footer-unsub">You are receiving this because you are a member or enquirer of HR Playhouse Hub.<br><a href="https://www.thehrplayhousehub.org/preferences/">Manage preferences</a> · <a href="https://www.thehrplayhousehub.org/unsubscribe/">Unsubscribe</a></div>',
    "</div>",
  ].join("");
}

type Vals = {
  first: string;
  last: string;
  email: string;
  note: string;
  level: number;
  progress: string;
};

function renderAnnounce(v: Vals): string {
  const note = v.note ? '<div class="e-p">' + esc(v.note) + "</div>" : "";
  return [
    header(),
    '<div class="e-hero" style="background:linear-gradient(135deg,#0D1F3C 0%,#1E3560 100%)">',
    '  <div class="e-eyebrow" style="color:#C9501E">Now Open · New Programme</div>',
    '  <div class="e-title">The HR Playhouse Hub<br>Professional Development<br><em>Programme is now open.</em></div>',
    '  <div class="e-hero-sub">Four levels. Real cases. Games that build instinct. A final project you keep. Everything you need to go from competent to outstanding.</div>',
    "</div>",
    '<div class="e-body">',
    '  <div class="e-greeting">Hi ' + esc(v.first) + ",</div>",
    note,
    '  <div class="e-p">I am excited to let you know that the <strong>HR Playhouse Hub Professional Development Programme</strong> is now open for enrolment.</div>',
    '  <div class="e-p">HR practice is changing fast — across Nigeria, the UK, and the Commonwealth. The professionals who stand out are the ones who can <strong>think clearly under pressure, act with confidence, and lead the moments that matter.</strong></div>',
    '  <div class="e-hbox">',
    '    <div class="e-hbox-label">Programme Overview</div>',
    '    <div class="e-hbox-title">Four progressive levels · 32+ case studies · 12 games</div>',
    '    <div class="e-hbox-desc">Multi-jurisdiction employment law · Final HR Strategy Proposal · ACU grant-backed · Certificate at every level + Full Programme Certificate</div>',
    "  </div>",
    '  <div style="margin:16px 0">',
    ["1", "2", "3", "4"]
      .map(function (n) {
        const l = LEVEL_DATA[Number(n)];
        return (
          '<div class="e-inc-row"><div class="e-dot" style="background:' +
          (n == "1" ? "#e8f7ee;color:#1a7a4a" : "#E8ECF4;color:#1E3560") +
          '">' +
          (n == "1" ? "✓" : n) +
          '</div><div class="e-inc-text"><strong>Level ' +
          n +
          " — " +
          l.name +
          '</strong><span class="e-inc-sub">' +
          l.topics +
          "</span></div></div>"
        );
      })
      .join(""),
    "  </div>",
    '  <div class="e-cta-wrap"><a class="e-cta" href="/learn/my-courses">Enrol in the Programme →</a><div class="e-cta-note">Level 1 is free to start · <a href="/learn/my-courses">Preview the curriculum</a></div></div>',
    '  <div class="e-divider"></div>',
    signoff(),
    '  <div class="e-ps"><p><strong>P.S.</strong> If you would like a closer look before enrolling, <a href="/learn/my-courses">preview the Level 1 curriculum here</a> — it is free to start with no commitment required.</p></div>',
    "</div>",
    footer(),
  ].join("");
}

function renderComplete(v: Vals): string {
  const l = LEVEL_DATA[v.level];
  const note = v.note ? '<div class="e-p">' + esc(v.note) + "</div>" : "";
  const isLast = v.level === 4;
  return [
    header(),
    '<div class="e-hero" style="background:linear-gradient(135deg,#041a0c 0%,#0a2e18 100%)">',
    '  <div class="e-eyebrow" style="color:#28ca65">🎉 Congratulations</div>',
    '  <div class="e-title">You have completed<br><em>Level ' +
      v.level +
      " — " +
      l.name +
      ".</em></div>",
    '  <div class="e-hero-sub">Your certificate has been issued and is ready to view, download and share right now.</div>',
    "</div>",
    '<div class="e-body">',
    '  <div class="e-greeting">Hi ' + esc(v.first) + ",</div>",
    note,
    '  <div class="e-p">You did it. <strong>Level ' +
      v.level +
      " — " +
      l.name +
      " is complete.</strong> Every topic covered, the case study done, all games completed.</div>",
    '  <div class="cert-preview-mini">',
    '    <div class="cpm-brand">HR Playhouse Hub</div>',
    '    <div class="cpm-head">Certificate of Level Completion</div>',
    '    <div class="cpm-badge">🏅</div>',
    '    <div class="cpm-certifies">This certifies that</div>',
    '    <div class="cpm-name">' +
      esc(v.first + (v.last ? " " + v.last : "")) +
      "</div>",
    '    <div class="cpm-done">has successfully completed all requirements of</div>',
    '    <div class="cpm-level">Level ' + v.level + "</div>",
    '    <div class="cpm-sub">' + l.name + "</div>",
    '    <div class="cpm-details">' +
      l.topics +
      "<br>Case Study: " +
      l.cs +
      " · Games: " +
      l.games +
      "</div>",
    '    <div class="cpm-hr"></div>',
    '    <div class="cpm-foot"><div><div class="cpm-sig">Dr. Marvellous Gberevbie</div><div>Founder &amp; CEO · HR Playhouse Hub</div></div><div style="text-align:right"><div style="font-weight:600;color:var(--ink)">' +
      new Date().toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      }) +
      '</div><div>Date of Issue</div></div></div>',
    "  </div>",
    isLast
      ? ""
      : '<div class="e-hbox" style="border-left-color:var(--green);background:#e8f7ee"><div class="e-hbox-label" style="color:var(--green)">What comes next</div><div class="e-hbox-title">Level ' +
        (v.level + 1) +
        " — " +
        LEVEL_DATA[v.level + 1].name +
        '</div><div class="e-hbox-desc">' +
        LEVEL_DATA[v.level + 1].topics +
        "</div></div>",
    '  <div class="e-cta-wrap"><a class="e-cta" style="background:#1a7a4a" href="/learn/dashboard/">View your certificate →</a>' +
      (isLast
        ? ""
        : '<div class="e-cta-note">Then <a href="/learn/my-courses">start Level ' +
          (v.level + 1) +
          "</a> when you are ready</div>") +
      "</div>",
    '  <div class="e-divider"></div>',
    signoff("genuinely proud of you"),
    '  <div class="e-ps" style="background:#E8ECF4"><p>Your Level ' +
      v.level +
      " certificate is saved permanently in your dashboard. Download or print it any time. " +
      (v.level < 4
        ? 4 - v.level +
          " more level" +
          (4 - v.level > 1 ? "s" : "") +
          " to go — and a Programme Certificate waiting at the end."
        : "You have earned the full programme certificate too — check your dashboard.") +
      "</p></div>",
    "</div>",
    footer(),
  ].join("");
}

function renderNudge(v: Vals): string {
  const pd = PROGRESS_DATA[v.progress];
  const l = LEVEL_DATA[pd.level];
  const note = v.note ? '<div class="e-p">' + esc(v.note) + "</div>" : "";
  // Build progress rows
  const topics = l.topics.split(" · ");
  const doneCount = Math.floor((topics.length * pd.pct) / 100);
  const progressRows = topics
    .map(function (t, i) {
      const done = i < doneCount;
      const current = i === doneCount;
      const pct = done
        ? 100
        : current
          ? (pd.pct % Math.floor(100 / topics.length)) * 3
          : 0;
      const color = done ? "#1a7a4a" : current ? "#C9501E" : "#E8ECF4";
      const label = done ? "✓" : current ? pd.pct + "%" : "—";
      const lcolor = done ? "#1a7a4a" : current ? "#C9501E" : "#9BABC0";
      const bold = current ? "font-weight:700;color:#C9501E" : "";
      return (
        '<div class="prog-row"><div class="prog-label" style="' +
        bold +
        '">' +
        esc(t) +
        '</div><div class="prog-bar-wrap"><div class="prog-bar" style="width:' +
        pct +
        "%;background:" +
        color +
        '"></div></div><div class="prog-pct" style="color:' +
        lcolor +
        '">' +
        label +
        "</div></div>"
      );
    })
    .join("");

  return [
    header(),
    '<div class="e-hero" style="background:linear-gradient(135deg,#0D1F3C 0%,#1E3560 100%)">',
    '  <div class="e-eyebrow" style="color:#C9501E">You were so close</div>',
    '  <div class="e-title">Your next lesson<br><em>is waiting for you.</em></div>',
    '  <div class="e-hero-sub">You are ' +
      pd.pct +
      "% through Level " +
      pd.level +
      " — " +
      l.name +
      ". Keep going — you are genuinely close.</div>",
    "</div>",
    '<div class="e-body">',
    '  <div class="e-greeting">Hi ' + esc(v.first) + ",</div>",
    note,
    '  <div class="e-p">It has been a little while since you last logged in. That is completely fine — life gets busy. But I did not want your progress to sit there without a gentle nudge.</div>',
    '  <div class="e-p">You are <strong>' +
      pd.pct +
      "% through Level " +
      pd.level +
      " — " +
      l.name +
      ".</strong> You are genuinely close to finishing this level and earning your certificate.</div>",
    '  <div style="background:#F0F2F8;border-radius:10px;padding:16px 18px;margin:16px 0">',
    '    <div style="font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--ink4);margin-bottom:12px;font-family:var(--fb)">Your Level ' +
      pd.level +
      " progress</div>",
    progressRows,
    "  </div>",
    '  <div class="e-hbox"><div class="e-hbox-label">Pick up where you left off</div><div class="e-hbox-title">Next: ' +
      esc(pd.topic) +
      '</div><div class="e-hbox-desc">Estimated time to finish this level: ' +
      pd.remaining +
      "</div></div>",
    '  <div class="e-cta-wrap"><a class="e-cta" href="/learn/my-courses">Continue Level ' +
      pd.level +
      ' →</a><div class="e-cta-note">Your Level ' +
      pd.level +
      " certificate is " +
      (100 - pd.pct) +
      "% away</div></div>",
    '  <div class="e-divider"></div>',
    signoff(),
    "</div>",
    footer(),
  ].join("");
}

function renderProgramme(v: Vals): string {
  const note = v.note ? '<div class="e-p">' + esc(v.note) + "</div>" : "";
  return [
    header(),
    '<div class="e-hero" style="background:linear-gradient(135deg,#1a0e00 0%,#2a1a06 100%)">',
    '  <div class="e-eyebrow" style="color:#C4830A">🏆 Programme Complete</div>',
    '  <div class="e-title">You have done it.<br><em>All four levels. Done.</em></div>',
    '  <div class="e-hero-sub">Your HR Playhouse Hub Programme Certificate has been issued. You are now among a small group of HR professionals who have completed the full programme.</div>',
    "</div>",
    '<div class="e-body">',
    '  <div class="e-greeting">Hi ' + esc(v.first) + ",</div>",
    note,
    '  <div class="e-p">I mean this: <strong>well done.</strong> Completing all four levels — every topic, every case study, every game, and your final HR Strategy Proposal — is a genuine achievement.</div>',
    '  <div class="cert-preview-mini" style="border-color:#C4830A;background:linear-gradient(135deg,#fffdf5,#fff)">',
    '    <div class="cpm-brand">HR Playhouse Hub</div>',
    '    <div class="cpm-head">Programme Certificate of Completion</div>',
    '    <div class="cpm-badge">🏆</div>',
    '    <div class="cpm-certifies">This certifies that</div>',
    '    <div class="cpm-name">' +
      esc(v.first + (v.last ? " " + v.last : "")) +
      "</div>",
    '    <div class="cpm-done">has successfully completed all requirements of the</div>',
    '    <div class="cpm-level" style="font-size:13px">Full Programme</div>',
    '    <div class="cpm-sub" style="font-size:14px">HR Playhouse Hub Professional Development Programme</div>',
    '    <div class="cpm-details">Levels 1–4 · All topics, case studies, games and the final HR Strategy Proposal<br>Commonwealth Universities (ACU) Grant · Cohort 2026 · Recognised across the Commonwealth</div>',
    '    <div class="cpm-hr"></div>',
    '    <div class="cpm-foot"><div><div class="cpm-sig">Dr. Marvellous Gberevbie</div><div>Founder &amp; CEO · HR Playhouse Hub</div><div>ACU Community Grant</div></div><div style="text-align:right"><div style="font-weight:600;color:var(--ink)">' +
      new Date().toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      }) +
      '</div><div>Date of Issue</div><div>thehrplayhousehub.org</div></div></div>',
    "  </div>",
    '  <div class="e-hbox" style="border-left-color:#C4830A;background:#FDF4DD">',
    '    <div class="e-hbox-label" style="color:#C4830A">Your credential</div>',
    '    <div class="e-hbox-title">What this certificate represents</div>',
    '    <div class="e-hbox-desc">This is not a participation certificate. You have demonstrated mastery across all four levels of professional HR practice. It is a serious credential, backed by an ACU grant and recognised across Commonwealth nations.</div>',
    "  </div>",
    '  <div class="e-cta-wrap"><a class="e-cta" style="background:#C4830A" href="/learn/dashboard/">View &amp; Download your Certificate →</a><div class="e-cta-note">All 5 certificates are saved in your dashboard</div></div>',
    '  <div class="e-divider"></div>',
    '  <div class="e-p">If you would like to share this achievement on LinkedIn or with your employer, I am happy to write a short verification note for you. Simply reply to this email and ask.</div>',
    signoff("genuine pride"),
    '  <div class="e-ps"><p><strong>P.S.</strong> You are welcome to join the <a href="/learn/innovation-lab">Innovation Lab</a> community — a thinking space for HR professionals who want to go further. Your perspective, with four levels of practice behind it, would be genuinely valuable there.</p></div>',
    "</div>",
    footer(),
  ].join("");
}

function getPlainText(
  v: Vals,
  currentTemplate: TemplateId,
): string {
  const l = v.level ? LEVEL_DATA[v.level] : null;
  const lines = ["Hi " + v.first + ",", ""];
  if (v.note) {
    lines.push(v.note);
    lines.push("");
  }

  if (currentTemplate === "announce") {
    lines.push(
      "I am excited to let you know that the HR Playhouse Hub Professional Development Programme is now open for enrolment.",
    );
    lines.push("");
    lines.push(
      "Four progressive levels. 32+ original case studies. 12 games. A final HR Strategy Proposal. A certificate at every level — and a Full Programme Certificate when you complete all four.",
    );
    lines.push("");
    lines.push("Enrol here: /courses/");
    lines.push("");
    lines.push("Level 1 is free to start. No commitment required to begin.");
  } else if (currentTemplate === "complete") {
    lines.push(
      "Congratulations — Level " + v.level + " — " + l!.name + " is complete.",
    );
    lines.push("");
    lines.push(
      "Your certificate has been issued automatically. View, download and print it here:",
    );
    lines.push("/dashboard/");
    lines.push("");
    if (v.level < 4) {
      lines.push(
        "Level " +
          (v.level + 1) +
          " — " +
          LEVEL_DATA[v.level + 1].name +
          " is now unlocked and waiting for you.",
      );
    }
  } else if (currentTemplate === "nudge") {
    const pd = PROGRESS_DATA[v.progress] || PROGRESS_DATA["L2_75"];
    lines.push(
      "It has been a little while since you last logged in. Just a gentle nudge — you are " +
        pd.pct +
        "% through Level " +
        pd.level +
        " — " +
        LEVEL_DATA[pd.level].name +
        ".",
    );
    lines.push("");
    lines.push("Your next topic is: " + pd.topic);
    lines.push("Estimated time remaining: " + pd.remaining);
    lines.push("");
    lines.push(
      "Pick up where you left off: /courses/",
    );
  } else if (currentTemplate === "programme") {
    lines.push(
      "Well done. All four levels of the HR Playhouse Hub Professional Development Programme are complete.",
    );
    lines.push("");
    lines.push(
      "Your Programme Certificate has been issued. View and download it here:",
    );
    lines.push("/dashboard/");
    lines.push("");
    lines.push(
      "This is a serious credential — backed by the ACU grant and recognised across the Commonwealth.",
    );
  }

  lines.push("");
  lines.push("With warmth,");
  lines.push("Dr. Marvellous Gberevbie");
  lines.push("Founder & CEO · HR Playhouse Hub Limited");
  lines.push("contact@thehrplayhousehub.org");
  lines.push("thehrplayhousehub.org");

  return lines.join("\n");
}

function EmailHeader() {
  return (
    <div className="e-header">
      <div className="e-pill">HR Playhouse</div>
      <div className="e-logo-text">Hub</div>
    </div>
  );
}

function EmailSignoff({ tone = "warmth" }: { tone?: string }) {
  return (
    <>
      <div className="e-divider" />
      <div className="e-signoff">With {tone},</div>
      <div className="e-name">Dr. Marvellous Gberevbie</div>
      <div className="e-role-sig">
        Founder &amp; CEO · HR Playhouse Hub Limited
      </div>
    </>
  );
}

function EmailFooter() {
  return (
    <div className="e-footer">
      <div className="e-footer-links">
        <a href="https://www.thehrplayhousehub.org/">Website</a>
        <a href="/learn/my-courses">Courses</a>
        <a href="/learn/case-study-vault">
          Case Studies
        </a>
        <a href="/learn/ai-support">
          AI Support
        </a>
      </div>
      <div className="e-footer-addr">
        The HR Playhouse Hub Limited · RC 8387672 · thehrplayhousehub.org ·
        contact@thehrplayhousehub.org
      </div>
      <div className="e-footer-unsub">
        You are receiving this because you are a member or enquirer of HR
        Playhouse Hub.
        <br />
        <a href="https://www.thehrplayhousehub.org/preferences/">
          Manage preferences
        </a>{" "}
        ·{" "}
        <a href="https://www.thehrplayhousehub.org/unsubscribe/">
          Unsubscribe
        </a>
      </div>
    </div>
  );
}

function PersonalNote({ note }: { note: string }) {
  return note ? <div className="e-p">{note}</div> : null;
}

function MiniCertificate({
  programme = false,
  name,
  level,
  title,
  details,
}: {
  programme?: boolean;
  name: string;
  level: string;
  title: string;
  details: string;
}) {
  const date = new Date().toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="cert-preview-mini"
      style={
        programme
          ? {
              borderColor: "#C4830A",
              background: "linear-gradient(135deg,#fffdf5,#fff)",
            }
          : undefined
      }
    >
      <div className="cpm-brand">HR Playhouse Hub</div>
      <div className="cpm-head">
        {programme
          ? "Programme Certificate of Completion"
          : "Certificate of Level Completion"}
      </div>
      <div className="cpm-badge">{programme ? "🏆" : "🏅"}</div>
      <div className="cpm-certifies">This certifies that</div>
      <div className="cpm-name">{name}</div>
      <div className="cpm-done">
        {programme
          ? "has successfully completed all requirements of the"
          : "has successfully completed all requirements of"}
      </div>
      <div className="cpm-level" style={programme ? { fontSize: 13 } : undefined}>
        {level}
      </div>
      <div className="cpm-sub" style={programme ? { fontSize: 14 } : undefined}>
        {title}
      </div>
      <div className="cpm-details">
        {details.split("\n").map((line, index) => (
          <span key={line}>
            {index > 0 && <br />}
            {line}
          </span>
        ))}
      </div>
      <div className="cpm-hr" />
      <div className="cpm-foot">
        <div>
          <div className="cpm-sig">Dr. Marvellous Gberevbie</div>
          <div>Founder &amp; CEO · HR Playhouse Hub</div>
          {programme && <div>ACU Community Grant</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 600, color: "var(--ink)" }}>{date}</div>
          <div>Date of Issue</div>
          {programme && <div>thehrplayhousehub.org</div>}
        </div>
      </div>
    </div>
  );
}

function EmailPreview({
  template,
  v,
}: {
  template: TemplateId;
  v: Vals;
}) {
  if (template === "announce") {
    return <AnnouncePreview v={v} />;
  }
  if (template === "complete") {
    return <CompletePreview v={v} />;
  }
  if (template === "nudge") {
    return <NudgePreview v={v} />;
  }
  return <ProgrammePreview v={v} />;
}

function AnnouncePreview({ v }: { v: Vals }) {
  return (
    <>
      <EmailHeader />
      <div
        className="e-hero"
        style={{ background: "linear-gradient(135deg,#0D1F3C 0%,#1E3560 100%)" }}
      >
        <div className="e-eyebrow" style={{ color: "#C9501E" }}>
          Now Open · New Programme
        </div>
        <div className="e-title">
          The HR Playhouse Hub
          <br />
          Professional Development
          <br />
          <em>Programme is now open.</em>
        </div>
        <div className="e-hero-sub">
          Four levels. Real cases. Games that build instinct. A final project
          you keep. Everything you need to go from competent to outstanding.
        </div>
      </div>
      <div className="e-body">
        <div className="e-greeting">Hi {v.first},</div>
        <PersonalNote note={v.note} />
        <div className="e-p">
          I am excited to let you know that the{" "}
          <strong>HR Playhouse Hub Professional Development Programme</strong>{" "}
          is now open for enrolment.
        </div>
        <div className="e-p">
          HR practice is changing fast — across Nigeria, the UK, and the
          Commonwealth. The professionals who stand out are the ones who can{" "}
          <strong>
            think clearly under pressure, act with confidence, and lead the
            moments that matter.
          </strong>
        </div>
        <div className="e-hbox">
          <div className="e-hbox-label">Programme Overview</div>
          <div className="e-hbox-title">
            Four progressive levels · 32+ case studies · 12 games
          </div>
          <div className="e-hbox-desc">
            Multi-jurisdiction employment law · Final HR Strategy Proposal · ACU
            grant-backed · Certificate at every level + Full Programme
            Certificate
          </div>
        </div>
        <div style={{ margin: "16px 0" }}>
          {[1, 2, 3, 4].map((n) => {
            const level = LEVEL_DATA[n];
            return (
              <div className="e-inc-row" key={n}>
                <div
                  className="e-dot"
                  style={{
                    background: n === 1 ? "#e8f7ee" : "#E8ECF4",
                    color: n === 1 ? "#1a7a4a" : "#1E3560",
                  }}
                >
                  {n === 1 ? "✓" : n}
                </div>
                <div className="e-inc-text">
                  <strong>
                    Level {n} — {level.name}
                  </strong>
                  <span className="e-inc-sub">{level.topics}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="e-cta-wrap">
          <a className="e-cta" href="/learn/my-courses">
            Enrol in the Programme →
          </a>
          <div className="e-cta-note">
            Level 1 is free to start ·{" "}
            <a href="/learn/my-courses">
              Preview the curriculum
            </a>
          </div>
        </div>
        <EmailSignoff />
        <div className="e-ps">
          <p>
            <strong>P.S.</strong> If you would like a closer look before
            enrolling,{" "}
            <a href="/learn/my-courses">
              preview the Level 1 curriculum here
            </a>{" "}
            — it is free to start with no commitment required.
          </p>
        </div>
      </div>
      <EmailFooter />
    </>
  );
}

function CompletePreview({ v }: { v: Vals }) {
  const level = LEVEL_DATA[v.level];
  const isLast = v.level === 4;
  const name = v.first + (v.last ? " " + v.last : "");

  return (
    <>
      <EmailHeader />
      <div
        className="e-hero"
        style={{ background: "linear-gradient(135deg,#041a0c 0%,#0a2e18 100%)" }}
      >
        <div className="e-eyebrow" style={{ color: "#28ca65" }}>
          🎉 Congratulations
        </div>
        <div className="e-title">
          You have completed
          <br />
          <em>
            Level {v.level} — {level.name}.
          </em>
        </div>
        <div className="e-hero-sub">
          Your certificate has been issued and is ready to view, download and
          share right now.
        </div>
      </div>
      <div className="e-body">
        <div className="e-greeting">Hi {v.first},</div>
        <PersonalNote note={v.note} />
        <div className="e-p">
          You did it.{" "}
          <strong>
            Level {v.level} — {level.name} is complete.
          </strong>{" "}
          Every topic covered, the case study done, all games completed.
        </div>
        <MiniCertificate
          name={name}
          level={`Level ${v.level}`}
          title={level.name}
          details={`${level.topics}\nCase Study: ${level.cs} · Games: ${level.games}`}
        />
        {!isLast && (
          <div
            className="e-hbox"
            style={{ borderLeftColor: "var(--green)", background: "#e8f7ee" }}
          >
            <div className="e-hbox-label" style={{ color: "var(--green)" }}>
              What comes next
            </div>
            <div className="e-hbox-title">
              Level {v.level + 1} — {LEVEL_DATA[v.level + 1].name}
            </div>
            <div className="e-hbox-desc">
              {LEVEL_DATA[v.level + 1].topics}
            </div>
          </div>
        )}
        <div className="e-cta-wrap">
          <a
            className="e-cta"
            style={{ background: "#1a7a4a" }}
            href="/learn/dashboard/"
          >
            View your certificate →
          </a>
          {!isLast && (
            <div className="e-cta-note">
              Then{" "}
              <a href="/learn/my-courses">
                start Level {v.level + 1}
              </a>{" "}
              when you are ready
            </div>
          )}
        </div>
        <EmailSignoff tone="genuinely proud of you" />
        <div className="e-ps" style={{ background: "#E8ECF4" }}>
          <p>
            Your Level {v.level} certificate is saved permanently in your
            dashboard. Download or print it any time.{" "}
            {v.level < 4
              ? `${4 - v.level} more level${4 - v.level > 1 ? "s" : ""} to go — and a Programme Certificate waiting at the end.`
              : "You have earned the full programme certificate too — check your dashboard."}
          </p>
        </div>
      </div>
      <EmailFooter />
    </>
  );
}

function NudgePreview({ v }: { v: Vals }) {
  const progress = PROGRESS_DATA[v.progress] || PROGRESS_DATA["L2_75"];
  const level = LEVEL_DATA[progress.level];
  const topics = level.topics.split(" · ");
  const doneCount = Math.floor((topics.length * progress.pct) / 100);

  return (
    <>
      <EmailHeader />
      <div
        className="e-hero"
        style={{ background: "linear-gradient(135deg,#0D1F3C 0%,#1E3560 100%)" }}
      >
        <div className="e-eyebrow" style={{ color: "#C9501E" }}>
          You were so close
        </div>
        <div className="e-title">
          Your next lesson
          <br />
          <em>is waiting for you.</em>
        </div>
        <div className="e-hero-sub">
          You are {progress.pct}% through Level {progress.level} — {level.name}.
          Keep going — you are genuinely close.
        </div>
      </div>
      <div className="e-body">
        <div className="e-greeting">Hi {v.first},</div>
        <PersonalNote note={v.note} />
        <div className="e-p">
          It has been a little while since you last logged in. That is
          completely fine — life gets busy. But I did not want your progress to
          sit there without a gentle nudge.
        </div>
        <div className="e-p">
          You are{" "}
          <strong>
            {progress.pct}% through Level {progress.level} — {level.name}.
          </strong>{" "}
          You are genuinely close to finishing this level and earning your
          certificate.
        </div>
        <div
          style={{
            background: "#F0F2F8",
            borderRadius: 10,
            padding: "16px 18px",
            margin: "16px 0",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".09em",
              textTransform: "uppercase",
              color: "var(--ink4)",
              marginBottom: 12,
              fontFamily: "var(--fb)",
            }}
          >
            Your Level {progress.level} progress
          </div>
          {topics.map((topic, i) => {
            const done = i < doneCount;
            const current = i === doneCount;
            const pct = done
              ? 100
              : current
                ? (progress.pct % Math.floor(100 / topics.length)) * 3
                : 0;
            const color = done ? "#1a7a4a" : current ? "#C9501E" : "#E8ECF4";
            const label = done ? "✓" : current ? `${progress.pct}%` : "—";
            const labelColor = done
              ? "#1a7a4a"
              : current
                ? "#C9501E"
                : "#9BABC0";
            return (
              <div className="prog-row" key={topic}>
                <div
                  className="prog-label"
                  style={
                    current
                      ? { fontWeight: 700, color: "#C9501E" }
                      : undefined
                  }
                >
                  {topic}
                </div>
                <div className="prog-bar-wrap">
                  <div
                    className="prog-bar"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <div className="prog-pct" style={{ color: labelColor }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
        <div className="e-hbox">
          <div className="e-hbox-label">Pick up where you left off</div>
          <div className="e-hbox-title">Next: {progress.topic}</div>
          <div className="e-hbox-desc">
            Estimated time to finish this level: {progress.remaining}
          </div>
        </div>
        <div className="e-cta-wrap">
          <a className="e-cta" href="/learn/my-courses">
            Continue Level {progress.level} →
          </a>
          <div className="e-cta-note">
            Your Level {progress.level} certificate is {100 - progress.pct}%
            away
          </div>
        </div>
        <EmailSignoff />
      </div>
      <EmailFooter />
    </>
  );
}

function ProgrammePreview({ v }: { v: Vals }) {
  const name = v.first + (v.last ? " " + v.last : "");

  return (
    <>
      <EmailHeader />
      <div
        className="e-hero"
        style={{ background: "linear-gradient(135deg,#1a0e00 0%,#2a1a06 100%)" }}
      >
        <div className="e-eyebrow" style={{ color: "#C4830A" }}>
          🏆 Programme Complete
        </div>
        <div className="e-title">
          You have done it.
          <br />
          <em>All four levels. Done.</em>
        </div>
        <div className="e-hero-sub">
          Your HR Playhouse Hub Programme Certificate has been issued. You are
          now among a small group of HR professionals who have completed the
          full programme.
        </div>
      </div>
      <div className="e-body">
        <div className="e-greeting">Hi {v.first},</div>
        <PersonalNote note={v.note} />
        <div className="e-p">
          I mean this: <strong>well done.</strong> Completing all four levels —
          every topic, every case study, every game, and your final HR Strategy
          Proposal — is a genuine achievement.
        </div>
        <MiniCertificate
          programme
          name={name}
          level="Full Programme"
          title="HR Playhouse Hub Professional Development Programme"
          details={
            "Levels 1–4 · All topics, case studies, games and the final HR Strategy Proposal\nCommonwealth Universities (ACU) Grant · Cohort 2026 · Recognised across the Commonwealth"
          }
        />
        <div
          className="e-hbox"
          style={{ borderLeftColor: "#C4830A", background: "#FDF4DD" }}
        >
          <div className="e-hbox-label" style={{ color: "#C4830A" }}>
            Your credential
          </div>
          <div className="e-hbox-title">What this certificate represents</div>
          <div className="e-hbox-desc">
            This is not a participation certificate. You have demonstrated
            mastery across all four levels of professional HR practice. It is a
            serious credential, backed by an ACU grant and recognised across
            Commonwealth nations.
          </div>
        </div>
        <div className="e-cta-wrap">
          <a
            className="e-cta"
            style={{ background: "#C4830A" }}
            href="/learn/dashboard/"
          >
            View &amp; Download your Certificate →
          </a>
          <div className="e-cta-note">
            All 5 certificates are saved in your dashboard
          </div>
        </div>
        <EmailSignoff tone="genuine pride" />
        <div className="e-p">
          If you would like to share this achievement on LinkedIn or with your
          employer, I am happy to write a short verification note for you. Simply
          reply to this email and ask.
        </div>
        <div className="e-ps">
          <p>
            <strong>P.S.</strong> You are welcome to join the{" "}
            <a href="/learn/innovation-lab">
              Innovation Lab
            </a>{" "}
            community — a thinking space for HR professionals who want to go
            further. Your perspective, with four levels of practice behind it,
            would be genuinely valuable there.
          </p>
        </div>
      </div>
      <EmailFooter />
    </>
  );
}

type LogEntry = {
  first: string;
  last: string;
  email: string;
  templateLabel: string;
  sentAt: string;
};

export default function EmailSenderContent() {
  const [gatePassed, setGatePassed] = useState(false);
  const [gateValue, setGateValue] = useState("");
  const [gateError, setGateError] = useState("");
  const [gateShake, setGateShake] = useState(false);
  const [gateFading, setGateFading] = useState(false);
  const gateInputRef = useRef<HTMLInputElement>(null);

  const [currentTemplate, setCurrentTemplate] =
    useState<TemplateId>("announce");
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    note: "",
    level: "1",
    progress: "L2_75",
  });
  const [sentLog, setSentLog] = useState<LogEntry[]>([]);
  const [navStatus, setNavStatus] = useState("No email sent yet");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── PASSWORD GATE ──────────────────────────────────── */
  useEffect(() => {
    if (sessionStorage.getItem("hrph_auth") === "ok") {
      setGatePassed(true);
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      gateInputRef.current?.focus();
    }, 150);
    return () => clearTimeout(t);
  }, []);

  async function checkGate() {
    const val = gateValue;
    if (!val) {
      setGateShake(true);
      setTimeout(() => setGateShake(false), 400);
      return;
    }
    const enc = new TextEncoder().encode(val);
    const hashBuf = await crypto.subtle.digest("SHA-256", enc);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    const hashHex = hashArr
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    if (
      hashHex ===
      "6d3b76d310e54362520a555d6eca6f54547e8837940bde1ad6502ceb778fab77"
    ) {
      sessionStorage.setItem("hrph_auth", "ok");
      // Original faded the overlay out over .4s before removing it.
      setTimeout(() => {
        setGatePassed(true);
        document.body.style.overflow = "";
      }, 400);
      setGateError("");
      setGateFading(true);
    } else {
      setGateShake(true);
      setGateValue("");
      setGateError("Incorrect password. Try again.");
      setTimeout(() => {
        setGateShake(false);
        setGateError("");
      }, 2000);
    }
  }

  /* ── FIELD VALUES ───────────────────────────────────── */
  function vals(): Vals {
    return {
      first: form.first.trim() || "[First Name]",
      last: form.last.trim(),
      email: form.email.trim(),
      note: form.note.trim(),
      level: parseInt(form.level) || 1,
      progress: form.progress || "L2_75",
    };
  }

  function renderEmail(): string {
    const v = vals();
    if (currentTemplate === "announce") return renderAnnounce(v);
    if (currentTemplate === "complete") return renderComplete(v);
    if (currentTemplate === "nudge") return renderNudge(v);
    if (currentTemplate === "programme") return renderProgramme(v);
    return "";
  }

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }

  /* ── SEND via mailto ────────────────────────────────── */
  function sendEmail() {
    const v = vals();
    if (!v.email || v.email === "") {
      showToast("Please enter a recipient email address.");
      return;
    }
    if (v.first === "[First Name]") {
      showToast("Please enter the recipient's first name.");
      return;
    }

    const subjects: Record<TemplateId, string> = {
      announce:
        "HR Playhouse Hub Professional Development Programme — Now Open",
      complete:
        "Your Level " +
        v.level +
        " Certificate is Ready — HR Playhouse Hub 🏅",
      nudge:
        "You were so close — come back and finish Level " +
        (PROGRESS_DATA[v.progress] || { level: 2 }).level +
        " 👋",
      programme: "Your HR Playhouse Hub Programme Certificate 🏆",
    };

    const plainText = getPlainText(v, currentTemplate);
    const subject = encodeURIComponent(subjects[currentTemplate]);
    const body = encodeURIComponent(plainText);
    const to = encodeURIComponent(v.email);

    window.location.href =
      "mailto:" + to + "?subject=" + subject + "&body=" + body;

    // Log it
    logSent(v);
    showToast("Opening your email app… ✉");
  }

  /* ── COPY BODY TEXT ─────────────────────────────────── */
  function copyEmailBody() {
    const v = vals();
    const text = getPlainText(v, currentTemplate);
    navigator.clipboard
      .writeText(text)
      .then(function () {
        showToast("Email text copied to clipboard ✓");
      })
      .catch(function () {
        showToast("Could not copy — please copy manually from the preview");
      });
  }

  /* ── PRINT PREVIEW ──────────────────────────────────── */
  function printPreview() {
    const content =
      '<div class="email-shell" id="email-preview">' +
      renderEmail() +
      "</div>";
    const pageHTML = [
      "<!DOCTYPE html><html><head>",
      '<meta charset="UTF-8"><title>Email Preview — HR Playhouse Hub</title>',
      '<link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;800;900',
      '&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">',
      "<style>",
      "body{margin:0;background:#E4E8F0;padding:32px;font-family:sans-serif}",
      "@media print{body{background:#fff;padding:0}}",
      "</style></head><body>",
      content,
      "</body></html>",
    ].join("");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(pageHTML);
    win.document.close();
    win.onload = function () {
      win.print();
    };
  }

  /* ── SENT LOG ───────────────────────────────────────── */
  function logSent(v: Vals) {
    const now = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setSentLog((prev) => [
      {
        first: v.first,
        last: v.last,
        email: v.email,
        templateLabel: TEMPLATES[currentTemplate].label,
        sentAt: now,
      },
      ...prev,
    ]);
    setNavStatus("Last sent: " + v.first + " · " + now);
  }

  function pickTemplate(id: TemplateId) {
    setCurrentTemplate(id);
  }

  const t = TEMPLATES[currentTemplate];

  return (
    <>
      {/* ── APP NAV ──────────────────────────────────────── */}
      <nav className="app-nav">
        <div className="app-logo-pill">HR Playhouse</div>
        <div className="app-logo-text">Hub</div>
        <div className="app-title">Email Sender</div>
        <div className="nav-right">
          <div className="nav-status">{navStatus}</div>
        </div>
      </nav>

      <div className="app-body">
        {/* ── LEFT PANEL ─────────────────────────────────── */}
        <div className="left-panel">
          {/* Step 1: Choose template */}
          <div>
            <span className="panel-label">Step 1 — Choose email type</span>
            <div className="template-grid">
              <button
                className={`template-btn${
                  currentTemplate === "announce" ? " active" : ""
                }`}
                onClick={() => pickTemplate("announce")}
              >
                <div className="tb-eyebrow">Outreach</div>
                <div className="tb-name">Programme Announcement</div>
                <div className="tb-desc">
                  Invite someone to enrol — new cohort, new programme, or
                  general outreach
                </div>
              </button>
              <button
                className={`template-btn${
                  currentTemplate === "complete" ? " active" : ""
                }`}
                onClick={() => pickTemplate("complete")}
              >
                <div className="tb-eyebrow">Recognition</div>
                <div className="tb-name">Level Completion + Certificate</div>
                <div className="tb-desc">
                  Celebrate a level completion and share their certificate link
                </div>
              </button>
              <button
                className={`template-btn${
                  currentTemplate === "nudge" ? " active" : ""
                }`}
                onClick={() => pickTemplate("nudge")}
              >
                <div className="tb-eyebrow">Re-engagement</div>
                <div className="tb-name">Progress Nudge</div>
                <div className="tb-desc">
                  Gentle reminder to a learner who has gone quiet mid-level
                </div>
              </button>
              <button
                className={`template-btn${
                  currentTemplate === "programme" ? " active" : ""
                }`}
                onClick={() => pickTemplate("programme")}
              >
                <div className="tb-eyebrow">Milestone 🏆</div>
                <div className="tb-name">Full Programme Certificate</div>
                <div className="tb-desc">
                  The big one — all 4 levels done, programme certificate issued
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Recipient details */}
          <div>
            <span className="panel-label">Step 2 — Recipient details</span>
            <div className="field-group">
              <div className="field">
                <label>
                  First name <span>*</span>
                </label>
                <input
                  type="text"
                  value={form.first}
                  onChange={(e) =>
                    setForm({ ...form, first: e.target.value })
                  }
                  placeholder="e.g. Adaeze"
                />
              </div>
              <div className="field">
                <label>Last name</label>
                <input
                  type="text"
                  value={form.last}
                  onChange={(e) => setForm({ ...form, last: e.target.value })}
                  placeholder="e.g. Okafor"
                />
              </div>
              <div className="field">
                <label>
                  Email address <span>*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="adaeze@company.com"
                />
              </div>
              {t.levelField && (
                <div className="field">
                  <label>Level completed</label>
                  <select
                    value={form.level}
                    onChange={(e) =>
                      setForm({ ...form, level: e.target.value })
                    }
                  >
                    <option value="1">Level 1 — HR Foundations</option>
                    <option value="2">Level 2 — Operational HR</option>
                    <option value="3">Level 3 — Strategic HR</option>
                    <option value="4">Level 4 — Future-Forward HR</option>
                  </select>
                </div>
              )}
              {t.progressField && (
                <div className="field">
                  <label>Current level &amp; progress</label>
                  <select
                    value={form.progress}
                    onChange={(e) =>
                      setForm({ ...form, progress: e.target.value })
                    }
                  >
                    <option value="L1_30">Level 1 — 30% done</option>
                    <option value="L1_60">Level 1 — 60% done</option>
                    <option value="L2_30">Level 2 — 30% done</option>
                    <option value="L2_75">Level 2 — 75% done</option>
                    <option value="L3_30">Level 3 — 30% done</option>
                    <option value="L3_60">Level 3 — 60% done</option>
                  </select>
                </div>
              )}
              <div className="field">
                <label>Personal note (optional)</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Add a personal line — e.g. 'It was great meeting you at the CIPM event…'"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Send */}
          <div>
            <span className="panel-label">Step 3 — Send</span>
            <button className="send-btn" onClick={sendEmail}>
              ✉ Send via your email app
            </button>
            <button className="copy-btn" onClick={copyEmailBody}>
              Copy email text
            </button>
          </div>

          {/* Sent log */}
          <div>
            <span className="panel-label">Sent today</span>
            <div className="sent-log">
              {sentLog.length === 0 ? (
                <div className="log-empty">
                  No emails sent yet this session.
                </div>
              ) : (
                sentLog.map((entry, i) => (
                  <div key={i} className="log-item">
                    <strong>
                      {entry.first}
                      {entry.last ? ` ${entry.last}` : ""}
                    </strong>{" "}
                    &lt;{entry.email}&gt;
                    <br />
                    {entry.templateLabel} · {entry.sentAt}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {/* /left-panel */}

        {/* ── RIGHT PANEL — PREVIEW ───────────────────────── */}
        <div className="right-panel">
          <div className="preview-toolbar">
            <div className="preview-label">Live preview</div>
            <div className="preview-actions">
              <button className="prev-action-btn" onClick={printPreview}>
                🖨 Print preview
              </button>
            </div>
          </div>
          <div className="email-shell">
            <EmailPreview template={currentTemplate} v={vals()} />
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast${toast ? " show" : ""}`}>{toast || ""}</div>

      {/* PASSWORD GATE OVERLAY */}
      {!gatePassed && (
        <div
          className="gate-overlay"
          style={
            gateFading
              ? { transition: "opacity .4s ease", opacity: 0 }
              : undefined
          }
        >
          <div className="gate-box">
            <div className="gate-logo-row">
              <div className="gate-pill">HR Playhouse</div>
              <div className="gate-logo-text">Hub</div>
            </div>
            <div className="gate-title">Team access only</div>
            <div className="gate-sub">
              This tool is for the HR Playhouse Hub team. Enter the password to
              continue.
            </div>
            <input
              className={`gate-field${gateShake ? " error" : ""}`}
              ref={gateInputRef}
              type="password"
              value={gateValue}
              onChange={(e) => setGateValue(e.target.value)}
              placeholder="Enter password"
              onKeyDown={(e) => {
                if (e.key === "Enter") checkGate();
              }}
            />
            <button className="gate-btn" onClick={checkGate}>
              Enter →
            </button>
            <div className="gate-error">{gateError}</div>
            <div className="gate-footer">
              HR Playhouse Hub Limited · RC 8387672
            </div>
          </div>
        </div>
      )}
    </>
  );
}
