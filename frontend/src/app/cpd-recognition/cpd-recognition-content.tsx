"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./cpd-recognition.css";

/**
 * CPD recognition marketing + enquiry page.
 *
 * Faithful port of cpd-recognition.html. The original collected four inputs
 * by id in a `submitCPD()` function, validated name/org/email, opened a
 * prefilled mailto, then revealed a hidden success banner via `style.display`.
 * That imperative code is now controlled inputs plus a `submitted` flag that
 * conditionally renders the banner. Validation text, mailto subject/body and
 * the redirect behaviour are unchanged.
 *
 * Standard marketing nav/footer are rendered via the shared components.
 */
export default function CpdRecognitionContent() {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submitCPD() {
    const n = name.trim();
    const o = org.trim();
    const e = email.trim();
    const m = msg.trim();
    if (!n || !o || !e) {
      alert("Please fill in your name, organisation and email.");
      return;
    }
    const body =
      "CPD Partnership Enquiry\n\nName: " +
      n +
      "\nOrganisation: " +
      o +
      "\nEmail: " +
      e +
      (m ? "\n\nMessage: " + m : "");
    window.location.href =
      "mailto:contact@thehrplayhousehub.org" +
      "?subject=" +
      encodeURIComponent("CPD Partnership Enquiry — " + o) +
      "&body=" +
      encodeURIComponent(body);
    setSubmitted(true);
  }

  return (
    <>
      <Nav />
      <main>
        <div className="cpd-hero">
          <div className="cpd-badge">🏛️ CPD Recognition Partnership</div>
          <h1
            className="page-title"
            style={{ color: "#fff", maxWidth: 680, margin: "0 auto 14px" }}
          >
            Earn verified{" "}
            <em style={{ color: "var(--gold)", fontStyle: "normal" }}>
              CPD hours
            </em>
            <br />
            with HR Playhouse Hub
          </h1>
          <p
            className="page-sub"
            style={{
              color: "rgba(255,255,255,.55)",
              maxWidth: 560,
              margin: "0 auto 32px",
            }}
          >
            HR Playhouse Hub is in advanced discussions with a leading HR
            professional body to offer verified CPD hours for programme
            completion. Here is everything you need to know.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(196,131,10,.15)",
              border: "1px solid rgba(196,131,10,.3)",
              borderRadius: 100,
              padding: "8px 18px",
              fontSize: 13,
              color: "var(--gold)",
              fontWeight: 600,
            }}
          >
            📣 Announcement expected before September 2026
          </div>
        </div>

        <div className="wrap">
          {/* STATS */}
          <div className="cpd-stats">
            <div className="cpd-stat">
              <div className="cpd-stat-n">
                4<span>+</span>
              </div>
              <div className="cpd-stat-l">
                Learning levels covering all core HR competencies
              </div>
            </div>
            <div className="cpd-stat">
              <div className="cpd-stat-n">
                32<span>+</span>
              </div>
              <div className="cpd-stat-l">
                Original case studies from African &amp; Commonwealth
                organisations
              </div>
            </div>
            <div className="cpd-stat">
              <div className="cpd-stat-n">
                30<span>+</span>
              </div>
              <div className="cpd-stat-l">
                Estimated CPD hours across the full programme
              </div>
            </div>
            <div className="cpd-stat">
              <div className="cpd-stat-n">
                56<span></span>
              </div>
              <div className="cpd-stat-l">
                Commonwealth nations covered by ACU grant recognition
              </div>
            </div>
          </div>

          {/* WHAT IS CPD */}
          <div style={{ marginBottom: 40 }}>
            <div
              className="eyebrow"
              style={{ justifyContent: "flex-start", marginBottom: 16 }}
            >
              What this means for learners
            </div>
            <div className="cpd-grid">
              <div className="cpd-card">
                <div
                  className="cpd-card-icon"
                  style={{ background: "var(--gold-pale)" }}
                >
                  🏅
                </div>
                <div className="cpd-card-title">Verified CPD hours</div>
                <div className="cpd-card-body">
                  Every level you complete will count toward your annual CPD
                  requirement with your professional body. No extra paperwork —
                  your completion record is automatically generated.
                </div>
              </div>
              <div className="cpd-card">
                <div
                  className="cpd-card-icon"
                  style={{ background: "var(--mist)" }}
                >
                  📜
                </div>
                <div className="cpd-card-title">Recognised credentials</div>
                <div className="cpd-card-body">
                  HR Playhouse Hub certificates will carry CPD recognition,
                  making them meaningful credentials for job applications,
                  promotions and professional registration renewals.
                </div>
              </div>
              <div className="cpd-card">
                <div
                  className="cpd-card-icon"
                  style={{ background: "var(--green-pale)" }}
                >
                  🌍
                </div>
                <div className="cpd-card-title">
                  Commonwealth-wide recognition
                </div>
                <div className="cpd-card-body">
                  Backed by the Association of Commonwealth Universities grant,
                  the programme is designed for HR professionals across Nigeria,
                  the UK and all 56 Commonwealth nations.
                </div>
              </div>
              <div className="cpd-card">
                <div
                  className="cpd-card-icon"
                  style={{ background: "var(--accent-pale)" }}
                >
                  ⚡
                </div>
                <div className="cpd-card-title">
                  Practical, applied learning
                </div>
                <div className="cpd-card-body">
                  Every CPD hour is earned through real case studies,
                  simulations and games — not passive video watching. The
                  learning is deep, applied and immediately usable at work.
                </div>
              </div>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="card" style={{ marginBottom: 48 }}>
            <div
              className="eyebrow"
              style={{ justifyContent: "flex-start", marginBottom: 24 }}
            >
              CPD Partnership Progress
            </div>
            <div className="cpd-timeline">
              <div className="cpd-step">
                <div className="cpd-step-dot done">✓</div>
                <div className="cpd-step-content">
                  <div className="cpd-step-title">
                    Platform built &amp; ACU grant awarded
                  </div>
                  <div className="cpd-step-body">
                    HR Playhouse Hub was developed with the support of an ACU HR
                    in Higher Education Community Grant. The platform is live and
                    learners are actively enrolled. ✓ Complete
                  </div>
                </div>
              </div>
              <div className="cpd-step">
                <div className="cpd-step-dot done">✓</div>
                <div className="cpd-step-content">
                  <div className="cpd-step-title">
                    CPD body approached &amp; discussions underway
                  </div>
                  <div className="cpd-step-body">
                    Advanced discussions are ongoing with a leading HR
                    professional body to formally recognise the programme for
                    CPD. ✓ In progress
                  </div>
                </div>
              </div>
              <div className="cpd-step">
                <div className="cpd-step-dot active">→</div>
                <div className="cpd-step-content">
                  <div className="cpd-step-title">
                    Formal CPD accreditation — coming soon
                  </div>
                  <div className="cpd-step-body">
                    Full CPD recognition expected to be announced before
                    September 2026. Learners who complete the programme before
                    the announcement will have their hours backdated. Currently
                    active.
                  </div>
                </div>
              </div>
              <div className="cpd-step" style={{ paddingBottom: 0 }}>
                <div className="cpd-step-dot pending">4</div>
                <div className="cpd-step-content">
                  <div className="cpd-step-title">
                    CPD certificates issued to all completers
                  </div>
                  <div className="cpd-step-body">
                    Once recognition is confirmed, CPD certificates will be
                    issued to all learners who have completed the programme —
                    automatically, with no application needed.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ENQUIRY FORM */}
          <div className="cpd-enquiry">
            <div
              style={{
                fontFamily: "var(--f-display)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.4)",
                marginBottom: 14,
              }}
            >
              CPD Partnership Enquiry
            </div>
            <h2
              style={{
                fontFamily: "var(--f-display)",
                fontSize: 28,
                fontWeight: 900,
                color: "#fff",
                marginBottom: 10,
                letterSpacing: "-.4px",
              }}
            >
              Interested in CPD partnership?
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,.55)",
                lineHeight: 1.7,
                maxWidth: 520,
                margin: "0 auto 28px",
              }}
            >
              If you represent a professional body, employer or institution
              interested in recognising HR Playhouse Hub learning for CPD, get
              in touch.
            </p>
            <div style={{ maxWidth: 520, margin: "0 auto" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div className="field" style={{ marginBottom: 0 }}>
                  <label style={{ color: "rgba(255,255,255,.6)" }}>
                    Your name <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label style={{ color: "rgba(255,255,255,.6)" }}>
                    Organisation <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="Organisation name"
                  />
                </div>
              </div>
              <div className="field" style={{ marginBottom: 12 }}>
                <label style={{ color: "rgba(255,255,255,.6)" }}>
                  Email address <span>*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organisation.com"
                />
              </div>
              <div className="field" style={{ marginBottom: 20 }}>
                <label style={{ color: "rgba(255,255,255,.6)" }}>
                  Your enquiry
                </label>
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Tell us about your organisation and how you'd like to work with HR Playhouse Hub on CPD recognition…"
                />
              </div>
              <button
                className="btn btn-accent btn-lg"
                style={{ width: "100%" }}
                onClick={submitCPD}
              >
                Send enquiry →
              </button>
            </div>
            {submitted && (
              <div
                style={{
                  marginTop: 20,
                  background: "rgba(26,122,74,.2)",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 14,
                  color: "#6ee7a8",
                }}
              >
                ✓ Thank you. We will be in touch within 2 working days.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
