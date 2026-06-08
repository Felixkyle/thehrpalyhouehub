"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useProgressReport } from "@/lib/hooks";
import { useAuth } from "@/lib/stores/auth";
import { ApiError } from "@/lib/api/client";
import type { CourseLevel } from "@/lib/api/types";
import "./progress-report.css";

/**
 * Progress report.
 *
 * Port of progress-report.html, now data-driven from the real API via
 * `useProgressReport()` (auth-gated). The two original imperative scripts are
 * kept verbatim:
 *  - `downloadPDF()` — a `window.print()` wrapper.
 *  - `printCert(level,name,date)` — opens a printable certificate popup; the
 *    generated certificate string is unchanged, only its inputs now come from
 *    the API.
 *
 * The page uses the standard marketing nav/footer. The certificate-verify
 * link maps to the local route.
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

/** Format an ISO timestamp as e.g. "March 2026". Empty/invalid → "". */
function fmtMonthYear(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

/** Map an activity-item status to the `.pr-dot` modifier + glyph. */
function dotFor(status: string): { cls: string; glyph: string } {
  if (status === "complete" || status === "done")
    return { cls: "done", glyph: "✓" };
  if (status === "current" || status === "active" || status === "in_progress")
    return { cls: "active", glyph: "→" };
  return { cls: "pending", glyph: "·" };
}

/** Accent colour + percent label colour for a level by status. */
function levelAccent(level: CourseLevel): string {
  if (level.status === "complete") return "var(--green)";
  if (level.status === "current") return "var(--navy)";
  return "var(--mist)";
}

export default function ProgressReportContent() {
  const authed = useAuth((s) => !!s.token);
  const { data, isLoading, isError, error } = useProgressReport();

  // ── Not signed in ────────────────────────────────────────────────
  if (!authed) {
    return (
      <>
        <Nav />
        <main>
          <div className="wrap">
            <div className="card" style={{ textAlign: "center", marginTop: 40 }}>
              <div
                className="eyebrow"
                style={{ justifyContent: "center", marginBottom: 12 }}
              >
                Progress Report
              </div>
              <p style={{ color: "var(--ink-4)", marginBottom: 20 }}>
                Sign in to view your personalised progress report, level
                completion and certificates.
              </p>
              <Link href="/login" className="btn btn-accent btn-sm">
                Sign in →
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <Nav />
        <main>
          <div className="wrap">
            <div className="card" style={{ textAlign: "center", marginTop: 40 }}>
              <div
                className="eyebrow"
                style={{ justifyContent: "center", marginBottom: 12 }}
              >
                Progress Report
              </div>
              <p style={{ color: "var(--ink-4)" }}>Loading your progress…</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Error ────────────────────────────────────────────────────────
  if (isError || !data) {
    const msg =
      error instanceof ApiError
        ? error.message
        : "We couldn't load your progress report. Please try again.";
    return (
      <>
        <Nav />
        <main>
          <div className="wrap">
            <div className="card" style={{ textAlign: "center", marginTop: 40 }}>
              <div
                className="eyebrow"
                style={{ justifyContent: "center", marginBottom: 12 }}
              >
                Progress Report
              </div>
              <p style={{ color: "var(--accent)", fontWeight: 600 }}>
                ⚠ {msg}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { user, stats, levels, certificates, timeline, report_generated_at } =
    data;

  return (
    <>
      <Nav />
      <main>
        <div className="pr-hero-strip">
          <div className="pr-hero-left">
            <div className="pr-hero-name">{user.display_name}</div>
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
                {stats.levels_completed}
              </div>
              <div className="pr-stat-l">Levels complete</div>
            </div>
            <div className="pr-stat">
              <div className="pr-stat-n">{stats.current_level_progress}%</div>
              <div className="pr-stat-l">Current level</div>
            </div>
            <div className="pr-stat">
              <div className="pr-stat-n" style={{ color: "var(--accent)" }}>
                {stats.cpd_hours}
              </div>
              <div className="pr-stat-l">CPD hrs earned</div>
            </div>
            <div className="pr-stat">
              <div className="pr-stat-n">{stats.badges_earned}</div>
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

          {levels.map((level) => {
            const accent = levelAccent(level);
            const locked = level.status === "locked";
            const pctColor =
              level.status === "complete"
                ? "var(--green)"
                : level.status === "current"
                  ? "var(--navy)"
                  : "var(--ink-4)";

            // Status tag + sub-meta line
            let tag: React.ReactNode;
            let metaWhen: string | null = null;
            if (level.status === "complete") {
              const when = fmtMonthYear(level.completed_at);
              tag = <span className="tag tag-green">✓ Complete</span>;
              metaWhen = when ? `Completed ${when}` : "Completed";
            } else if (level.status === "current") {
              const when = fmtMonthYear(level.started_at);
              tag = <span className="tag tag-accent">● In Progress</span>;
              metaWhen = when ? `Started ${when}` : "In progress";
            } else {
              tag = <span className="tag tag-navy">🔒 Locked</span>;
            }

            return (
              <div
                key={level.id}
                className="pr-level-card"
                style={{
                  ...(level.status === "current"
                    ? { borderColor: "var(--navy)" }
                    : {}),
                  ...(locked ? { opacity: 0.5 } : {}),
                }}
              >
                <div className="pr-level-bar" style={{ background: accent }} />
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
                        {tag}
                        {metaWhen && (
                          <span
                            style={{ fontSize: 11, color: "var(--ink-4)" }}
                          >
                            {metaWhen}
                          </span>
                        )}
                      </div>
                      <div className="pr-level-title">
                        Level {level.level_number} — {level.title}
                      </div>
                      <div className="pr-level-meta">
                        {locked
                          ? `Unlocks when Level ${level.level_number - 1} is complete`
                          : level.description}
                      </div>
                    </div>
                    <div className="pr-level-pct" style={{ color: pctColor }}>
                      {level.progress_percent}%
                    </div>
                  </div>
                  <div className="pr-bar">
                    <div
                      className="pr-bar-fill"
                      style={{
                        width: `${level.progress_percent}%`,
                        background: accent,
                      }}
                    />
                  </div>

                  {!locked && (
                    <div className="pr-activities">
                      <div className="pr-activity">
                        <div className="pr-activity-label">Topics covered</div>
                        {level.topics.map((t) => {
                          const d = dotFor(t.status);
                          return (
                            <div className="pr-activity-item" key={t.id}>
                              <div className={`pr-dot ${d.cls}`}>{d.glyph}</div>
                              {d.cls === "active" ? (
                                <span
                                  style={{
                                    color: "var(--accent)",
                                    fontWeight: 600,
                                  }}
                                >
                                  {t.name}
                                </span>
                              ) : (
                                t.name
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="pr-activity">
                        <div className="pr-activity-label">Case Study</div>
                        {level.case_studies.map((c) => {
                          const d = dotFor(c.status);
                          return (
                            <div className="pr-activity-item" key={c.id}>
                              <div className={`pr-dot ${d.cls}`}>{d.glyph}</div>
                              {c.name}
                            </div>
                          );
                        })}
                      </div>
                      <div className="pr-activity">
                        <div className="pr-activity-label">
                          Games &amp; Activities
                        </div>
                        {level.games.map((g) => {
                          const d = dotFor(g.status);
                          return (
                            <div className="pr-activity-item" key={g.id}>
                              <div className={`pr-dot ${d.cls}`}>{d.glyph}</div>
                              {g.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* CERTIFICATES */}
          <div
            className="eyebrow"
            style={{ justifyContent: "flex-start", marginBottom: 16 }}
          >
            Certificates Issued
          </div>
          <div className="pr-cert-row" style={{ marginTop: 0 }}>
            {certificates.map((cert, i) => {
              const earned = cert.status === "earned";
              const issued = fmtMonthYear(cert.issued_at);
              const lockedNote =
                cert.level === "full"
                  ? "Issued when all 4 levels are complete"
                  : `Issued when Level ${cert.level} is complete`;
              return (
                <div
                  key={cert.id ?? `${cert.level}-${i}`}
                  className={`pr-cert ${earned ? "earned" : "locked"}`}
                  onClick={
                    earned
                      ? () =>
                          printCert(
                            `Level ${cert.level} — ${cert.title}`,
                            cert.learner_name || user.display_name,
                            issued,
                          )
                      : undefined
                  }
                >
                  <div
                    className="pr-cert-icon"
                    style={{
                      background: earned ? "var(--green-pale)" : "#E8ECF4",
                    }}
                  >
                    {cert.badge_emoji || "🏅"}
                  </div>
                  <div className="pr-cert-info">
                    <div className="pr-cert-title">
                      {cert.level === "full"
                        ? cert.title
                        : `Level ${cert.level} — ${cert.title}`}
                    </div>
                    <div className="pr-cert-date">
                      {earned
                        ? `Issued ${issued} · Click to print`
                        : lockedNote}
                    </div>
                  </div>
                  {earned && (
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--accent)",
                        fontWeight: 700,
                      }}
                    >
                      Print →
                    </span>
                  )}
                </div>
              );
            })}
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
              {timeline.map((item, i) => {
                const when = fmtMonthYear(item.occurred_at);
                const metaParts = [when, item.context].filter(Boolean);
                if (item.hours != null)
                  metaParts.push(`${item.hours} hrs`);
                return (
                  <div className="tl-item" key={`${item.title}-${i}`}>
                    <div className="tl-dot done">✓</div>
                    <div className="tl-content">
                      <div className="tl-title">{item.title}</div>
                      <div className="tl-meta">{metaParts.join(" · ")}</div>
                    </div>
                  </div>
                );
              })}
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
            <strong style={{ color: "var(--ink)" }}>{user.display_name}</strong>{" "}
            · Generated {fmtMonthYear(report_generated_at)} ·{" "}
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
