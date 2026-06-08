"use client";

import { useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./certificate-verify.css";

/**
 * Certificate verification tool.
 *
 * Faithful port of certificate-verify.html. The original kept a `DEMO_CERTS`
 * lookup table and a `verifyCert()` function that toggled two result `<div>`s
 * via `style.display` and wrote certificate fields into elements by id. That
 * imperative DOM code is now a `result` state ("none" | "valid" | "invalid")
 * plus a controlled input, with the matched certificate held in state and
 * interpolated into the preview. Behaviour is unchanged: the entered ID is
 * trimmed + uppercased, an empty value alerts, a hit shows the valid preview
 * and smooth-scrolls it into view, a miss shows the not-found card.
 *
 * Standard marketing nav/footer are rendered via the shared components.
 */

interface Cert {
  name: string;
  level: string;
  course: string;
  desc: string;
  date: string;
}

// Stephen: replace DEMO_CERTS with a fetch() call to your certificates database
// e.g. fetch('/wp-json/hrph/v1/verify?id='+id).then(r=>r.json()).then(showResult)
const DEMO_CERTS: Record<string, Cert> = {
  "HRPH-2026-L1-00001": {
    name: "Ada Okonkwo",
    level: "Level 1",
    course: "HR Foundations",
    desc: "Topics: HR Mindset & Function · Employment Relationships · Culture & Engagement",
    date: "March 2026",
  },
  "HRPH-2026-L2-00001": {
    name: "Ada Okonkwo",
    level: "Level 2",
    course: "Operational HR",
    desc: "Topics: Recruitment & Selection · Performance Management · Retention & Wellbeing",
    date: "April 2026",
  },
  "HRPH-2026-L1-00142": {
    name: "Chidera Nwosu",
    level: "Level 1",
    course: "HR Foundations",
    desc: "Topics: HR Mindset & Function · Employment Relationships · Culture & Engagement",
    date: "February 2026",
  },
  "HRPH-2026-PROG-00001": {
    name: "Ada Okonkwo",
    level: "Full Programme",
    course: "HR Playhouse Hub Professional Development Programme",
    desc: "Levels 1–4 · All topics, case studies, games and final HR Strategy Proposal · ACU Grant Cohort 2026",
    date: "June 2026",
  },
};

export default function CertificateVerifyContent() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState<"none" | "valid" | "invalid">("none");
  const [cert, setCert] = useState<Cert | null>(null);
  const [matchedId, setMatchedId] = useState("");
  const validRef = useRef<HTMLDivElement>(null);

  function verifyCert() {
    const id = certId.trim().toUpperCase();
    setResult("none");
    if (!id) {
      alert("Please enter a Certificate ID.");
      return;
    }
    const found = DEMO_CERTS[id];
    if (found) {
      setCert(found);
      setMatchedId(id);
      setResult("valid");
      // Defer until the valid card is rendered, then scroll it into view.
      requestAnimationFrame(() => {
        validRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } else {
      setResult("invalid");
    }
  }

  return (
    <>
      <Nav />
      <main>
        <div className="verify-strip">
          <div className="verify-strip-badge">
            🏛️ Issued by HR Playhouse Hub Limited · RC 8387672
          </div>
          <div className="verify-strip-text">
            ACU Commonwealth Universities Grant Programme · Cohort 2026
          </div>
        </div>

        <div className="wrap-sm">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            Certificate Verification
          </div>
          <h1
            className="page-title"
            style={{ textAlign: "center", marginBottom: 12 }}
          >
            Verify a Certificate
          </h1>
          <p
            className="page-sub"
            style={{ textAlign: "center", marginBottom: 40 }}
          >
            Enter the Certificate ID to confirm it is genuine and view the full
            certificate details.
          </p>

          <div className="card" style={{ marginBottom: 24 }}>
            <div className="v-search-wrap">
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. HRPH-2026-L1-00142"
                onKeyDown={(e) => {
                  if (e.key === "Enter") verifyCert();
                }}
              />
              <button className="btn btn-accent" onClick={verifyCert}>
                Verify →
              </button>
            </div>
            <div className="v-hint">
              The Certificate ID is printed at the bottom of every HR Playhouse
              Hub certificate. Format: HRPH-YYYY-LX-NNNNN
            </div>
            <div
              style={{
                background: "var(--canvas-2)",
                borderRadius: 10,
                padding: "14px 16px",
                fontSize: 13,
                color: "var(--ink-3)",
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: "var(--ink)" }}>
                For employers &amp; HR teams:
              </strong>{" "}
              Use this tool to confirm that a certificate submitted by a
              candidate is genuine. Each certificate is issued with a unique ID
              tied to the learner and their completion record. For bulk
              verification or formal documentation, email{" "}
              <a
                href="mailto:contact@thehrplayhousehub.org"
                style={{ color: "var(--accent)", fontWeight: 600 }}
              >
                contact@thehrplayhousehub.org
              </a>
              .
            </div>
          </div>

          {/* VALID RESULT */}
          {result === "valid" && cert && (
            <div
              className="v-result valid"
              ref={validRef}
              style={{ display: "block" }}
            >
              <div className="v-badge">
                <div className="v-badge-icon">✅</div>
                <div>
                  <div
                    className="v-badge-title"
                    style={{ color: "var(--green)" }}
                  >
                    Certificate verified
                  </div>
                  <div className="v-badge-sub">
                    This certificate is genuine and was issued by HR Playhouse
                    Hub Limited (RC 8387672).
                  </div>
                </div>
              </div>
              <div className="cert-preview">
                <div className="cp-corner tl" />
                <div className="cp-corner tr" />
                <div className="cp-corner bl" />
                <div className="cp-corner br" />
                <div className="cp-brand">HR Playhouse Hub</div>
                <div className="cp-head">Certificate of Level Completion</div>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🏅</div>
                <div className="cp-certifies">This certifies that</div>
                <div className="cp-name">{cert.name}</div>
                <div className="cp-completed">
                  has successfully completed all requirements of
                </div>
                <div className="cp-level">{cert.level}</div>
                <div className="cp-course">{cert.course}</div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-4)",
                    marginBottom: 18,
                  }}
                >
                  {cert.desc}
                </div>
                <div className="cp-divider" />
                <div className="cp-footer">
                  <div>
                    <div className="cp-sig">Dr. Marvellous Gberevbie</div>
                    <div>Founder &amp; CEO · HR Playhouse Hub</div>
                    <div style={{ marginTop: 2 }}>
                      ACU Commonwealth Universities Grant
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>
                      {cert.date}
                    </div>
                    <div>Date of Issue</div>
                    <div style={{ marginTop: 2 }}>ID: {matchedId}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INVALID RESULT */}
          {result === "invalid" && (
            <div className="v-result invalid" style={{ display: "block" }}>
              <div className="v-badge">
                <div className="v-badge-icon">❌</div>
                <div>
                  <div
                    className="v-badge-title"
                    style={{ color: "var(--accent)" }}
                  >
                    Certificate not found
                  </div>
                  <div className="v-badge-sub">
                    We could not find a certificate with that ID. Check the ID
                    and try again, or{" "}
                    <a
                      href="mailto:contact@thehrplayhousehub.org"
                      style={{ color: "var(--accent)", fontWeight: 600 }}
                    >
                      contact us
                    </a>{" "}
                    if you believe this is correct.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="divider" />
          <div className="eyebrow" style={{ marginBottom: 20 }}>
            How it works
          </div>
          <div className="how-grid">
            <div className="how-item">
              <div className="how-n">1</div>
              <div className="how-t">Find the ID</div>
              <div className="how-b">
                The Certificate ID is at the bottom of every HR Playhouse Hub
                certificate, below the date of issue.
              </div>
            </div>
            <div className="how-item">
              <div className="how-n">2</div>
              <div className="how-t">Enter it above</div>
              <div className="how-b">
                Type or paste the ID. Format: HRPH-YYYY-LX-NNNNN. Results appear
                instantly.
              </div>
            </div>
            <div className="how-item">
              <div className="how-n">3</div>
              <div className="how-t">See the details</div>
              <div className="how-b">
                If genuine, the full certificate with the learner name, level,
                and date issued will display.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
