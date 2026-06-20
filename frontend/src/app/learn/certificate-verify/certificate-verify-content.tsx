"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useCertificateVerify } from "@/lib/hooks";
import "./certificate-verify.css";

/**
 * Certificate verification tool.
 *
 * The original kept a `DEMO_CERTS`
 * lookup table and an imperative `verifyCert()`; the lookup is now wired to the
 * real backend via `useCertificateVerify(id)`. The query is enabled only when a
 * submitted id is set, so the controlled input feeds a separate `submittedId`
 * state that is set on submit (trim + uppercase) to trigger the request. The
 * response shape is `{ valid, certificate? }`; we render the valid certificate
 * preview from the returned fields, the not-found card when `valid` is false,
 * and a lightweight loading / error state in between. On a valid result the
 * card is smooth-scrolled into view as before.
 *
 * Standard marketing nav/footer are rendered via the shared components.
 */

/** Map the API numeric/"full" level to the display label used in the preview. */
function levelLabel(level: 1 | 2 | 3 | 4 | "full"): string {
  return level === "full" ? "Full Programme" : `Level ${level}`;
}

/** Format an ISO issue date as e.g. "March 2026". */
function formatIssued(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function CertificateVerifyContent() {
  const [certId, setCertId] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const validRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useCertificateVerify(submittedId);

  function verifyCert() {
    const id = certId.trim().toUpperCase();
    if (!id) {
      alert("Please enter a Certificate ID.");
      return;
    }
    setSubmittedId(id);
  }

  const cert = data?.valid ? data.certificate : undefined;

  // Once a valid certificate renders, smooth-scroll it into view.
  useEffect(() => {
    if (cert) {
      requestAnimationFrame(() => {
        validRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [cert]);

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

          {/* LOADING */}
          {submittedId && isLoading && (
            <div
              className="card"
              style={{
                marginBottom: 24,
                textAlign: "center",
                color: "var(--ink-3)",
              }}
            >
              Verifying certificate…
            </div>
          )}

          {/* ERROR (request failed, not a "not found") */}
          {submittedId && !isLoading && isError && (
            <div className="v-result invalid" style={{ display: "block" }}>
              <div className="v-badge">
                <div className="v-badge-icon">⚠️</div>
                <div>
                  <div
                    className="v-badge-title"
                    style={{ color: "var(--accent)" }}
                  >
                    Something went wrong
                  </div>
                  <div className="v-badge-sub">
                    We couldn&apos;t verify this certificate right now. Please
                    check your connection and try again.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VALID RESULT */}
          {cert && (
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
                <div style={{ fontSize: 32, marginBottom: 10 }}>
                  {cert.badge_emoji}
                </div>
                <div className="cp-certifies">This certifies that</div>
                <div className="cp-name">{cert.learner_name}</div>
                <div className="cp-completed">
                  has successfully completed all requirements of
                </div>
                <div className="cp-level">{levelLabel(cert.level)}</div>
                <div className="cp-course">{cert.course_name}</div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-4)",
                    marginBottom: 18,
                  }}
                >
                  {cert.description}
                </div>
                <div className="cp-divider" />
                <div className="cp-footer">
                  <div>
                    <div className="cp-sig">{cert.signer_name}</div>
                    <div>{cert.signer_role}</div>
                    <div style={{ marginTop: 2 }}>
                      ACU Commonwealth Universities Grant
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>
                      {formatIssued(cert.issued_at)}
                    </div>
                    <div>Date of Issue</div>
                    <div style={{ marginTop: 2 }}>ID: {cert.id}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INVALID RESULT */}
          {submittedId && !isLoading && !isError && data && !data.valid && (
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
                    and try again if you believe this is correct.
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
