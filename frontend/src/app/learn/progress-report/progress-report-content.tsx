"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./progress-report.css";

/**
 * Progress report.
 *
 * Faithful port of progress-report.html. The page is static markup; the only
 * scripts were `downloadPDF()` (a `window.print()` wrapper) and
 * `printCert(level,name,date)` which opened a printable certificate popup.
 * Both are kept verbatim as plain functions wired to React `onClick`
 * handlers — the generated certificate string is unchanged.
 *
 * This page uses the standard marketing nav/footer, so the shared components
 * are used. The certificate-verify link maps to the local route.
 */

function downloadPDF() {
  window.print();
}

function printCert(level: string, name: string, date: string) {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(
    "<!DOCTYPE html><html><head><meta charset=UTF-8><title>Certificate</title>" +
      '<link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600&display=swap" rel=stylesheet>' +
      "<style>body{margin:0;background:#f8f9fc;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;padding:40px}" +
      ".c{background:#fff;width:720px;padding:56px 64px;border:2.5px solid #C4830A;border-radius:4px;text-align:center;box-shadow:0 8px 40px rgba(10,22,40,.12)}" +
      ".brand{font-size:10px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:#C9501E;margin-bottom:8px}" +
      ".head{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#9BABC0;margin-bottom:18px}" +
      ".cname{font-size:38px;font-weight:900;color:#0A1628;letter-spacing:-1px;margin-bottom:14px;font-family:Cabinet Grotesk,sans-serif}" +
      ".clevel{font-size:20px;font-weight:900;color:#C4830A;margin-bottom:4px;font-family:Cabinet Grotesk,sans-serif}" +
      ".csub{font-size:15px;font-weight:600;color:#0A1628;margin-bottom:18px}" +
      ".divider{height:1px;background:linear-gradient(90deg,transparent,#E8ECF4,transparent);margin:24px 0}" +
      ".foot{display:flex;justify-content:space-between;font-size:11px;color:#9BABC0}" +
      ".sig{font-weight:700;color:#0A1628;font-size:13px;margin-bottom:2px}" +
      "@media print{body{background:#fff;padding:0}.c{box-shadow:none}}" +
      "</style></head><body><div class=c>" +
      "<div class=brand>HR Playhouse Hub</div>" +
      "<div class=head>Certificate of Level Completion</div>" +
      "<div style=font-size:32px;margin-bottom:12px>🏅</div>" +
      "<div style=font-size:14px;color:#9BABC0;margin-bottom:8px>This certifies that</div>" +
      "<div class=cname>" +
      name +
      "</div>" +
      "<div style=font-size:14px;color:#9BABC0;margin-bottom:8px>has successfully completed</div>" +
      "<div class=clevel>" +
      level +
      "</div>" +
      "<div class=csub>HR Playhouse Hub Professional Development Programme</div>" +
      "<div style=font-size:12px;color:#9BABC0;margin-bottom:18px>ACU Commonwealth Universities Grant · Cohort 2026</div>" +
      "<div class=divider></div>" +
      "<div class=foot><div><div class=sig>Dr. Marvellous Gberevbie</div><div>Founder &amp; CEO · HR Playhouse Hub</div></div>" +
      "<div><div style=font-weight:600;color:#0A1628>" +
      date +
      "</div><div>Date of Issue</div></div></div>" +
      "</div><scr" +
      "ipt>window.onload=function(){window.print()}<\/scr" +
      "ipt></body></html>",
  );
  win.document.close();
}

export default function ProgressReportContent() {
  return (
    <>
      <Nav />
      <main>
        <div className="pr-hero-strip">
          <div className="pr-hero-left">
            <div className="pr-hero-name">Ada Okonkwo</div>
            <div className="pr-hero-sub">
              HR Playhouse Hub · Professional Development Programme · Progress
              Report
            </div>
          </div>
          <div className="pr-hero-right">
            <button
              className="btn btn-outline-white btn-sm"
              onClick={() => window.print()}
            >
              🖨 Print report
            </button>
            <button className="btn btn-accent btn-sm" onClick={downloadPDF}>
              ⬇ Download PDF
            </button>
          </div>
        </div>

        <div className="wrap">
          {/* OVERALL STATS */}
          <div className="pr-overall">
            <div className="pr-stat">
              <div className="pr-stat-n" style={{ color: "var(--green)" }}>
                1
              </div>
              <div className="pr-stat-l">Levels complete</div>
            </div>
            <div className="pr-stat">
              <div className="pr-stat-n">75%</div>
              <div className="pr-stat-l">Current level</div>
            </div>
            <div className="pr-stat">
              <div className="pr-stat-n" style={{ color: "var(--accent)" }}>
                ~6
              </div>
              <div className="pr-stat-l">CPD hrs earned</div>
            </div>
            <div className="pr-stat">
              <div className="pr-stat-n">4</div>
              <div className="pr-stat-l">Badges earned</div>
            </div>
          </div>

          {/* LEVEL CARDS */}
          <div
            className="eyebrow"
            style={{ justifyContent: "flex-start", marginBottom: 20 }}
          >
            Level Progress
          </div>

          {/* L1 COMPLETE */}
          <div className="pr-level-card">
            <div
              className="pr-level-bar"
              style={{ background: "var(--green)" }}
            />
            <div className="pr-level-body">
              <div className="pr-level-top">
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span className="tag tag-green">✓ Complete</span>
                    <span
                      style={{ fontSize: 11, color: "var(--ink-4)" }}
                    >
                      Completed March 2026
                    </span>
                  </div>
                  <div className="pr-level-title">
                    Level 1 — HR Foundations
                  </div>
                  <div className="pr-level-meta">
                    Completed March 2026 · ~6 hrs · 3 topics · 1 case study · 3
                    games
                  </div>
                </div>
                <div
                  className="pr-level-pct"
                  style={{ color: "var(--green)" }}
                >
                  100%
                </div>
              </div>
              <div className="pr-bar">
                <div
                  className="pr-bar-fill"
                  style={{ width: "100%", background: "var(--green)" }}
                />
              </div>
              <div className="pr-activities">
                <div className="pr-activity">
                  <div className="pr-activity-label">Topics covered</div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>The HR Mindset &amp;
                    Function
                  </div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>Employment Relationships
                  </div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>Culture &amp; Engagement
                  </div>
                </div>
                <div className="pr-activity">
                  <div className="pr-activity-label">Case Study</div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>TechStart Culture Clash
                  </div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>Reflection submitted
                  </div>
                </div>
                <div className="pr-activity">
                  <div className="pr-activity-label">Games &amp; Activities</div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>HR Role Matcher
                  </div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>Culture Builder Game
                  </div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>Engagement Audit
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* L2 IN PROGRESS */}
          <div
            className="pr-level-card"
            style={{ borderColor: "var(--navy)" }}
          >
            <div
              className="pr-level-bar"
              style={{ background: "var(--navy)" }}
            />
            <div className="pr-level-body">
              <div className="pr-level-top">
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span className="tag tag-accent">● In Progress</span>
                    <span
                      style={{ fontSize: 11, color: "var(--ink-4)" }}
                    >
                      Started February 2026
                    </span>
                  </div>
                  <div className="pr-level-title">
                    Level 2 — Operational HR
                  </div>
                  <div className="pr-level-meta">
                    In progress · ~4.5 hrs remaining · 2 of 3 topics done
                  </div>
                </div>
                <div
                  className="pr-level-pct"
                  style={{ color: "var(--navy)" }}
                >
                  75%
                </div>
              </div>
              <div className="pr-bar">
                <div
                  className="pr-bar-fill"
                  style={{ width: "75%", background: "var(--navy)" }}
                />
              </div>
              <div className="pr-activities">
                <div className="pr-activity">
                  <div className="pr-activity-label">Topics covered</div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>Recruitment &amp;
                    Selection
                  </div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>Performance Management
                  </div>
                  <div className="pr-activity-item">
                    <div className="pr-dot active">→</div>
                    <span
                      style={{ color: "var(--accent)", fontWeight: 600 }}
                    >
                      Retention &amp; Wellbeing
                    </span>
                  </div>
                </div>
                <div className="pr-activity">
                  <div className="pr-activity-label">Case Study</div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>HealthCo Retention
                    Crisis
                  </div>
                  <div className="pr-activity-item">
                    <div className="pr-dot active">→</div>Reflection pending
                  </div>
                </div>
                <div className="pr-activity">
                  <div className="pr-activity-label">Games &amp; Activities</div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>Hiring Decision Game
                  </div>
                  <div className="pr-activity-item">
                    <div className="pr-dot done">✓</div>Burnout Detective
                  </div>
                  <div className="pr-activity-item">
                    <div className="pr-dot pending">·</div>Wellbeing Sprint
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* L3 + L4 LOCKED */}
          <div className="pr-level-card" style={{ opacity: 0.5 }}>
            <div
              className="pr-level-bar"
              style={{ background: "var(--mist)" }}
            />
            <div className="pr-level-body">
              <div className="pr-level-top">
                <div>
                  <div style={{ marginBottom: 6 }}>
                    <span className="tag tag-navy">🔒 Locked</span>
                  </div>
                  <div className="pr-level-title">
                    Level 3 — Strategic HR
                  </div>
                  <div className="pr-level-meta">
                    Unlocks when Level 2 is complete
                  </div>
                </div>
                <div
                  className="pr-level-pct"
                  style={{ color: "var(--ink-4)" }}
                >
                  0%
                </div>
              </div>
              <div className="pr-bar">
                <div
                  className="pr-bar-fill"
                  style={{ width: "0%", background: "var(--mist)" }}
                />
              </div>
            </div>
          </div>
          <div className="pr-level-card" style={{ opacity: 0.5 }}>
            <div
              className="pr-level-bar"
              style={{ background: "var(--mist)" }}
            />
            <div className="pr-level-body">
              <div className="pr-level-top">
                <div>
                  <div style={{ marginBottom: 6 }}>
                    <span className="tag tag-navy">🔒 Locked</span>
                  </div>
                  <div className="pr-level-title">
                    Level 4 — Future-Forward HR
                  </div>
                  <div className="pr-level-meta">
                    Unlocks when Level 3 is complete
                  </div>
                </div>
                <div
                  className="pr-level-pct"
                  style={{ color: "var(--ink-4)" }}
                >
                  0%
                </div>
              </div>
              <div className="pr-bar">
                <div
                  className="pr-bar-fill"
                  style={{ width: "0%", background: "var(--mist)" }}
                />
              </div>
            </div>
          </div>

          {/* CERTIFICATES */}
          <div
            className="eyebrow"
            style={{ justifyContent: "flex-start", marginBottom: 16 }}
          >
            Certificates Issued
          </div>
          <div className="pr-cert-row" style={{ marginTop: 0 }}>
            <div
              className="pr-cert earned"
              onClick={() =>
                printCert(
                  "Level 1 — HR Foundations",
                  "Ada Okonkwo",
                  "March 2026",
                )
              }
            >
              <div
                className="pr-cert-icon"
                style={{ background: "var(--green-pale)" }}
              >
                🏅
              </div>
              <div className="pr-cert-info">
                <div className="pr-cert-title">Level 1 — HR Foundations</div>
                <div className="pr-cert-date">
                  Issued March 2026 · Click to print
                </div>
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--accent)",
                  fontWeight: 700,
                }}
              >
                Print →
              </span>
            </div>
            <div className="pr-cert locked">
              <div className="pr-cert-icon" style={{ background: "#E8ECF4" }}>
                🏅
              </div>
              <div className="pr-cert-info">
                <div className="pr-cert-title">Level 2 — Operational HR</div>
                <div className="pr-cert-date">
                  Issued when Level 2 is complete
                </div>
              </div>
            </div>
            <div className="pr-cert locked">
              <div className="pr-cert-icon" style={{ background: "#E8ECF4" }}>
                🏅
              </div>
              <div className="pr-cert-info">
                <div className="pr-cert-title">Level 3 — Strategic HR</div>
                <div className="pr-cert-date">
                  Issued when Level 3 is complete
                </div>
              </div>
            </div>
            <div className="pr-cert locked">
              <div className="pr-cert-icon" style={{ background: "#E8ECF4" }}>
                🏆
              </div>
              <div className="pr-cert-info">
                <div className="pr-cert-title">
                  Full Programme Certificate
                </div>
                <div className="pr-cert-date">
                  Issued when all 4 levels are complete
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVITY TIMELINE */}
          <div className="card" style={{ marginTop: 8 }}>
            <div
              className="eyebrow"
              style={{ justifyContent: "flex-start", marginBottom: 20 }}
            >
              Activity Timeline
            </div>
            <div className="timeline">
              <div className="tl-item">
                <div className="tl-dot done">✓</div>
                <div className="tl-content">
                  <div className="tl-title">
                    Level 1 — HR Foundations completed
                  </div>
                  <div className="tl-meta">
                    March 2026 · Certificate issued · 6 hrs
                  </div>
                </div>
              </div>
              <div className="tl-item">
                <div className="tl-dot done">✓</div>
                <div className="tl-content">
                  <div className="tl-title">
                    Level 2 started — Recruitment &amp; Selection
                  </div>
                  <div className="tl-meta">February 2026</div>
                </div>
              </div>
              <div className="tl-item">
                <div className="tl-dot done">✓</div>
                <div className="tl-content">
                  <div className="tl-title">
                    Performance Management topic completed
                  </div>
                  <div className="tl-meta">March 2026</div>
                </div>
              </div>
              <div className="tl-item">
                <div className="tl-dot done">✓</div>
                <div className="tl-content">
                  <div className="tl-title">
                    Burnout Detective game completed
                  </div>
                  <div className="tl-meta">March 2026</div>
                </div>
              </div>
              <div className="tl-item">
                <div
                  className="tl-dot active"
                  style={{
                    background: "var(--accent-pale)",
                    borderColor: "rgba(201,80,30,.3)",
                  }}
                >
                  →
                </div>
                <div className="tl-content">
                  <div
                    className="tl-title"
                    style={{ color: "var(--accent)" }}
                  >
                    Retention &amp; Wellbeing — in progress
                  </div>
                  <div className="tl-meta">
                    Current · Last activity: April 2026
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER NOTE */}
          <div
            style={{
              marginTop: 28,
              padding: "18px 20px",
              background: "var(--canvas-2)",
              borderRadius: 12,
              fontSize: 13,
              color: "var(--ink-4)",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            This progress report was generated by HR Playhouse Hub Limited (RC
            8387672) ·{" "}
            <strong style={{ color: "var(--ink)" }}>Ada Okonkwo</strong> ·
            Generated April 2026 ·{" "}
            <Link
              href="/learn/certificate-verify"
              style={{ color: "var(--accent)", fontWeight: 600 }}
            >
              Verify certificates →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
