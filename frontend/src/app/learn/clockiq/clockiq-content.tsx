"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useClockiqEnquiry } from "@/lib/hooks";
import { ApiError } from "@/lib/api/client";
import "./clockiq.css";

/**
 * ClockIQ product page.
 *
 * Standard marketing nav/footer are rendered
 * via the shared components. All ClockIQ product links point at the live
 * Netlify app and stay plain anchors, matching the original link-rewrite
 * rules.
 *
 * The "Request a demo" mailto link has been replaced with a real enquiry form
 * wired to the backend via useClockiqEnquiry(). On submit it POSTs
 * { name, email, organisation?, team_size?, message? } and shows success or
 * error states inline. The Enterprise "Contact us" mailto remains as a plain
 * mail link (it is a generic contact affordance, not a tracked enquiry).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_STYLE: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.18)",
  background: "rgba(255,255,255,.06)",
  color: "#fff",
  fontSize: 14,
  outline: "none",
};

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: ".08em",
  color: "rgba(255,255,255,.6)",
  marginBottom: 6,
};

export default function ClockiqContent() {
  const enquiry = useClockiqEnquiry();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name: boolean;
    email: boolean;
  }>({ name: false, email: false });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nm = name.trim();
    const em = email.trim();
    const errs = { name: nm === "", email: !EMAIL_RE.test(em) };
    setFieldErrors(errs);
    if (errs.name || errs.email) return;

    try {
      await enquiry.mutateAsync({
        name: nm,
        email: em,
        organisation: organisation.trim() || undefined,
        team_size: teamSize || undefined,
        message: message.trim() || undefined,
      });
    } catch {
      // Error surfaced via enquiry.isError below.
    }
  }

  const errorMessage =
    enquiry.error instanceof ApiError
      ? enquiry.error.message
      : "Something went wrong. Please try again or email contact@thehrplayhousehub.org.";

  return (
    <>
      <Nav />
      <main>
        {/* HERO */}
        <div className="cq-hero">
          <div className="cq-badge">
            🟢 Live at thehrplayhousehub-clockiq.netlify.app
          </div>
          <div className="cq-logo">
            Clock<span>IQ</span>
          </div>
          <div className="cq-tagline">
            Work tracking &amp; HR intelligence for African organisations
          </div>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,.5)",
              lineHeight: 1.75,
              maxWidth: 580,
              margin: "0 auto 28px",
            }}
          >
            Browser-based. No installs. No subscription traps. Built for the
            reality of how organisations actually work in Nigeria and across
            Africa — with or without reliable infrastructure.
          </p>
          <div className="cq-hero-actions">
            <a
              className="btn btn-lg"
              style={{ background: "var(--green)", color: "#fff" }}
              href="https://thehrplayhousehub-clockiq.netlify.app/"
              target="_blank"
              rel="noopener"
            >
              Launch ClockIQ →
            </a>
            <a className="btn btn-outline-white btn-lg" href="#clockiq-features">
              See what it does
            </a>
          </div>

          {/* UI MOCKUP */}
          <div className="cq-screenshot">
            <div className="cq-mockup">
              <div className="cq-mockup-bar">
                <div
                  className="cq-mock-dot"
                  style={{ background: "#ff5f57" }}
                />
                <div
                  className="cq-mock-dot"
                  style={{ background: "#ffbd2e" }}
                />
                <div
                  className="cq-mock-dot"
                  style={{ background: "#28c840" }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,.4)",
                    marginLeft: 8,
                  }}
                >
                  ClockIQ — HR Intelligence Dashboard
                </span>
              </div>
              <div className="cq-mockup-body">
                <div className="cq-mock-card">
                  <div
                    className="cq-mock-n"
                    style={{ color: "var(--green)" }}
                  >
                    98.2%
                  </div>
                  <div className="cq-mock-l">Attendance rate</div>
                </div>
                <div className="cq-mock-card">
                  <div className="cq-mock-n">14</div>
                  <div className="cq-mock-l">Active staff</div>
                </div>
                <div className="cq-mock-card">
                  <div
                    className="cq-mock-n"
                    style={{ color: "var(--accent)" }}
                  >
                    2
                  </div>
                  <div className="cq-mock-l">Alerts today</div>
                </div>
                <div
                  className="cq-mock-card"
                  style={{
                    gridColumn: "span 3",
                    textAlign: "left",
                    padding: "16px 20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      color: "var(--ink-4)",
                      marginBottom: 12,
                    }}
                  >
                    Today&apos;s Clock-ins
                  </div>
                  <div
                    style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        background: "var(--green-pale)",
                        color: "var(--green)",
                        padding: "4px 12px",
                        borderRadius: 100,
                        fontWeight: 600,
                      }}
                    >
                      Ada — 08:42 ✓
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        background: "var(--green-pale)",
                        color: "var(--green)",
                        padding: "4px 12px",
                        borderRadius: 100,
                        fontWeight: 600,
                      }}
                    >
                      Chidera — 09:01 ✓
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        background: "var(--accent-pale)",
                        color: "var(--accent)",
                        padding: "4px 12px",
                        borderRadius: 100,
                        fontWeight: 600,
                      }}
                    >
                      Emeka — Late (09:45)
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        background: "var(--mist)",
                        color: "var(--ink-4)",
                        padding: "4px 12px",
                        borderRadius: 100,
                      }}
                    >
                      Ngozi — Not yet
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wrap">
          {/* FEATURES */}
          <div id="clockiq-features">
            <div
              className="eyebrow"
              style={{ justifyContent: "flex-start", marginBottom: 20 }}
            >
              What ClockIQ Does
            </div>
            <div className="feat-grid">
              <div className="feat-card">
                <div className="feat-icon">⏱</div>
                <div className="feat-title">
                  Real-time Clock-in / Clock-out
                </div>
                <div className="feat-body">
                  Staff clock in and out via any browser — no app download
                  needed. Works on phones, tablets and desktops. GPS-optional.
                  Works offline and syncs when connected.
                </div>
              </div>
              <div className="feat-card">
                <div className="feat-icon">📊</div>
                <div className="feat-title">Attendance Analytics</div>
                <div className="feat-body">
                  Live attendance dashboard, punctuality trends, late arrival
                  alerts, and absence tracking. Filter by department, date
                  range, or individual. Export to CSV.
                </div>
              </div>
              <div className="feat-card">
                <div className="feat-icon">💳</div>
                <div className="feat-title">Payroll-Ready Reports</div>
                <div className="feat-body">
                  Generate payroll-ready timesheet reports automatically.
                  Integrated with Paystack for Nigerian organisations. Reduce
                  manual payroll errors by up to 90%.
                </div>
              </div>
              <div className="feat-card">
                <div className="feat-icon">🔔</div>
                <div className="feat-title">Smart HR Alerts</div>
                <div className="feat-body">
                  Automatic alerts for repeated late arrivals, unusual absence
                  patterns, and compliance flags. HR spends time on people, not
                  chasing spreadsheets.
                </div>
              </div>
              <div className="feat-card">
                <div className="feat-icon">📱</div>
                <div className="feat-title">No-install, Works Anywhere</div>
                <div className="feat-body">
                  100% browser-based. No app store, no IT department, no VPN.
                  Works on any device, on any network — including 3G. Built for
                  Nigerian infrastructure reality.
                </div>
              </div>
              <div className="feat-card">
                <div className="feat-icon">🔒</div>
                <div className="feat-title">Secure &amp; Private</div>
                <div className="feat-body">
                  Your data stays with you. Role-based access — staff see only
                  their own records, managers see their team, HR sees
                  everything. SOC-2 aligned data handling.
                </div>
              </div>
            </div>
          </div>

          {/* WHO IS IT FOR */}
          <div
            className="eyebrow"
            style={{ justifyContent: "flex-start", marginBottom: 20 }}
          >
            Who ClockIQ is for
          </div>
          <div className="for-who-grid">
            <div className="for-who-card orgs">
              <div className="for-who-title">
                🏢 Nigerian &amp; African Organisations
              </div>
              <div className="for-who-list">
                <div className="for-who-item">
                  <div className="for-who-check">✓</div>SMEs with 5–500 staff
                  who are drowning in manual attendance registers
                </div>
                <div className="for-who-item">
                  <div className="for-who-check">✓</div>Companies with multiple
                  locations or remote/hybrid teams
                </div>
                <div className="for-who-item">
                  <div className="for-who-check">✓</div>Organisations tired of
                  spreadsheet-based HR and payroll errors
                </div>
                <div className="for-who-item">
                  <div className="for-who-check">✓</div>Startups and scale-ups
                  who need HR infrastructure without enterprise costs
                </div>
              </div>
            </div>
            <div className="for-who-card hr">
              <div className="for-who-title">
                👩‍💼 HR Teams &amp; Managers
              </div>
              <div className="for-who-list">
                <div className="for-who-item">
                  <div className="for-who-check">✓</div>HR managers who want to
                  stop manually compiling attendance data every month
                </div>
                <div className="for-who-item">
                  <div className="for-who-check">✓</div>Line managers who need
                  visibility on their team&apos;s attendance without a full
                  HRIS
                </div>
                <div className="for-who-item">
                  <div className="for-who-check">✓</div>Finance teams who want
                  payroll-ready reports, not raw timesheets
                </div>
                <div className="for-who-item">
                  <div className="for-who-check">✓</div>Founders who want HR
                  data intelligence from day one
                </div>
              </div>
            </div>
          </div>

          {/* PRICING */}
          <div
            className="eyebrow"
            style={{ justifyContent: "flex-start", marginBottom: 20 }}
          >
            Simple Pricing
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div
                className="pricing-badge"
                style={{ background: "var(--mist)", color: "var(--navy)" }}
              >
                Starter
              </div>
              <div className="pricing-price">Free</div>
              <div className="pricing-period">
                Up to 10 staff · Always free
              </div>
              <div className="pricing-divider" />
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>Clock-in / clock-out
                for up to 10 staff
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>Basic attendance
                dashboard
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>CSV export
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>Browser-based, no
                install
              </div>
              <a
                className="btn btn-outline btn-sm"
                style={{ width: "100%", marginTop: 20 }}
                href="https://thehrplayhousehub-clockiq.netlify.app/"
                target="_blank"
                rel="noreferrer"
              >
                Get started free →
              </a>
            </div>
            <div className="pricing-card featured">
              <div
                className="pricing-badge"
                style={{
                  background: "var(--green-pale)",
                  color: "var(--green)",
                }}
              >
                ⭐ Most Popular
              </div>
              <div className="pricing-price">
                ₦15,000
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: "var(--ink-4)",
                  }}
                >
                  /mo
                </span>
              </div>
              <div className="pricing-period">
                Up to 50 staff · Billed monthly via Paystack
              </div>
              <div className="pricing-divider" />
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>Everything in Starter
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>Smart HR alerts
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>Payroll-ready reports
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>Department-level
                analytics
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>Priority email support
              </div>
              <a
                className="btn btn-accent btn-sm"
                style={{ width: "100%", marginTop: 20 }}
                href="https://thehrplayhousehub-clockiq.netlify.app/"
                target="_blank"
                rel="noreferrer"
              >
                Start free trial →
              </a>
            </div>
            <div className="pricing-card">
              <div
                className="pricing-badge"
                style={{ background: "var(--navy)", color: "#fff" }}
              >
                Enterprise
              </div>
              <div className="pricing-price" style={{ fontSize: 32 }}>
                Custom
              </div>
              <div className="pricing-period">
                Unlimited staff · SLA included
              </div>
              <div className="pricing-divider" />
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>Everything in Growth
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>Multi-location setup
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>Custom integrations
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>Dedicated account
                manager
              </div>
              <div className="pricing-feature">
                <span className="pricing-check">✓</span>On-site training
                available
              </div>
              <a
                className="btn btn-navy btn-sm"
                style={{ width: "100%", marginTop: 20 }}
                href="mailto:contact@thehrplayhousehub.org?subject=ClockIQ Enterprise Enquiry"
              >
                Contact us →
              </a>
            </div>
          </div>

          {/* FINAL CTA */}
          <div className="cq-cta-section">
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".12em",
                color: "rgba(255,255,255,.5)",
                marginBottom: 14,
              }}
            >
              Get started today
            </div>
            <h2
              style={{
                fontFamily: "var(--f-display)",
                fontSize: "clamp(26px,4vw,38px)",
                fontWeight: 900,
                color: "#fff",
                marginBottom: 12,
                letterSpacing: "-.5px",
              }}
            >
              Your organisation deserves
              <br />
              better than a spreadsheet.
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,.65)",
                lineHeight: 1.7,
                maxWidth: 480,
                margin: "0 auto 28px",
              }}
            >
              ClockIQ gives you HR intelligence in minutes, not months. Free to
              start. Built for Africa.
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                className="btn btn-lg"
                style={{
                  background: "#fff",
                  color: "var(--green)",
                  fontWeight: 800,
                }}
                href="https://thehrplayhousehub-clockiq.netlify.app/"
                target="_blank"
                rel="noopener"
              >
                Launch ClockIQ →
              </a>
              <a className="btn btn-lg btn-outline-white" href="#clockiq-demo">
                Request a demo
              </a>
            </div>

            {/* DEMO ENQUIRY FORM */}
            <div
              id="clockiq-demo"
              style={{
                maxWidth: 520,
                margin: "40px auto 0",
                textAlign: "left",
              }}
            >
              {enquiry.isSuccess ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "28px 24px",
                    borderRadius: 16,
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.14)",
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
                  <div
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#fff",
                      marginBottom: 8,
                    }}
                  >
                    Thank you — we&apos;ll be in touch
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,.6)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    Your enquiry has been received. A member of the ClockIQ team
                    will reach out shortly to arrange your demo.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".12em",
                      color: "rgba(255,255,255,.5)",
                      marginBottom: 16,
                      textAlign: "center",
                    }}
                  >
                    Request a demo
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={LABEL_STYLE} htmlFor="cq-name">
                      Name *
                    </label>
                    <input
                      id="cq-name"
                      type="text"
                      placeholder="Ada Okonkwo"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        ...FIELD_STYLE,
                        borderColor: fieldErrors.name
                          ? "var(--accent)"
                          : undefined,
                      }}
                    />
                    {fieldErrors.name && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--accent)",
                          marginTop: 6,
                        }}
                      >
                        Please enter your name
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={LABEL_STYLE} htmlFor="cq-email">
                      Email *
                    </label>
                    <input
                      id="cq-email"
                      type="email"
                      placeholder="ada@company.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        ...FIELD_STYLE,
                        borderColor: fieldErrors.email
                          ? "var(--accent)"
                          : undefined,
                      }}
                    />
                    {fieldErrors.email && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--accent)",
                          marginTop: 6,
                        }}
                      >
                        Please enter a valid email address
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={LABEL_STYLE} htmlFor="cq-org">
                      Organisation
                    </label>
                    <input
                      id="cq-org"
                      type="text"
                      placeholder="Your company"
                      autoComplete="organization"
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      style={FIELD_STYLE}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={LABEL_STYLE} htmlFor="cq-team">
                      Team size
                    </label>
                    <select
                      id="cq-team"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      style={FIELD_STYLE}
                    >
                      <option value="">Select team size</option>
                      <option value="1-10">1–10</option>
                      <option value="11-50">11–50</option>
                      <option value="51-200">51–200</option>
                      <option value="200+">200+</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={LABEL_STYLE} htmlFor="cq-message">
                      Message
                    </label>
                    <textarea
                      id="cq-message"
                      placeholder="Tell us a little about what you need…"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{ ...FIELD_STYLE, resize: "vertical" }}
                    />
                  </div>

                  {enquiry.isError && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#fff",
                        background: "rgba(201,53,30,.18)",
                        border: "1px solid var(--accent)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        marginBottom: 16,
                        textAlign: "left",
                      }}
                      role="alert"
                    >
                      ⚠ {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-lg"
                    style={{
                      width: "100%",
                      background: "#fff",
                      color: "var(--green)",
                      fontWeight: 800,
                      opacity: enquiry.isPending ? 0.7 : 1,
                      cursor: enquiry.isPending ? "wait" : "pointer",
                    }}
                    disabled={enquiry.isPending}
                  >
                    {enquiry.isPending ? "Sending…" : "Request a demo →"}
                  </button>
                </form>
              )}
            </div>

            <div
              style={{
                marginTop: 24,
                fontSize: 13,
                color: "rgba(255,255,255,.4)",
              }}
            >
              A product of HR Playhouse Hub Limited · RC 8387672 · Built for
              Nigeria, ready for the Commonwealth
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
