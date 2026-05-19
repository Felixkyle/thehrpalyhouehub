import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./clockiq.css";

/**
 * ClockIQ product page.
 *
 * Faithful port of clockiq.html. The page is fully static (the only inline
 * script was the shared mobile-nav toggle, which now lives in the shared
 * <Nav /> component), so no client directive is needed. Standard marketing
 * nav/footer are rendered via the shared components. All ClockIQ links point
 * at the live Netlify app and stay plain anchors, matching the original
 * link-rewrite rules.
 */
export default function ClockiqContent() {
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
              <a
                className="btn btn-lg btn-outline-white"
                href="mailto:contact@thehrplayhousehub.org?subject=ClockIQ Demo Request"
              >
                Request a demo
              </a>
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
