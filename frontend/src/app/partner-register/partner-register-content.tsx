"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./partner-register.css";

/**
 * Partner-register / register-interest page.
 *
 * Faithful port of partner-register.html. This page ships its OWN nav, footer
 * and design system (distinct from the shared marketing components), so they
 * are ported inline rather than using <Nav />/<Footer />.
 *
 * The original imperative script handled four things, all reproduced here as
 * React state with identical behaviour:
 *  - selectTrack(): keeps the hero pills, the track cards and the form <select>
 *    in sync, scrolling the chosen card into view; driven here by a single
 *    `track` state value.
 *  - file upload: 5MB size guard (same alert text), filename preview, remove,
 *    and drag-and-drop onto the upload zone.
 *  - handleSubmit(): disables the button + swaps to a "Sending..." label, then
 *    tries a global `emailjs` send (never present in the original markup, so it
 *    always falls back) to a prefilled mailto, then reveals the success state.
 *  - URL ?track= param pre-selection on load (useEffect).
 *
 * The "/" links are kept as in the original; "/" maps to the local home route.
 */

const TRACK_VALUES = [
  "cpd",
  "institutional",
  "academic",
  "consulting",
  "other",
] as const;

type TrackValue = (typeof TRACK_VALUES)[number];

interface PartnerEmailJs {
  send: (
    serviceId: string,
    templateId: string,
    params: Record<string, unknown>,
  ) => Promise<unknown>;
}

/** Access a (potentially) globally-present EmailJS without a global Window
 * augmentation (other pages augment Window.emailjs with a different shape). */
function getEmailJs(): PartnerEmailJs | undefined {
  return (window as unknown as { emailjs?: PartnerEmailJs }).emailjs;
}

export default function PartnerRegisterContent() {
  const [track, setTrack] = useState<TrackValue>("cpd");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Pre-select from URL param e.g. ?track=cpd
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preTrack = params.get("track");
    if (preTrack && (TRACK_VALUES as readonly string[]).includes(preTrack)) {
      selectTrack(preTrack as TrackValue);
    }
  }, []);

  function selectTrack(trackId: TrackValue) {
    setTrack(trackId);
    // Scroll the matching card into view, mirroring the original behaviour.
    const card = cardRefs.current[trackId];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFileName(file.name);
  }

  function handleFileChange(input: HTMLInputElement) {
    handleFile(input.files?.[0]);
  }

  function removeFile() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFileName(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const get = (id: string) =>
      (form.elements.namedItem(id) as HTMLInputElement | null)?.value ?? "";

    const data = {
      firstName: get("f-first").trim(),
      lastName: get("f-last").trim(),
      title: get("f-title").trim(),
      org: get("f-org").trim(),
      orgType: get("f-orgtype"),
      email: get("f-email").trim(),
      phone: get("f-phone").trim(),
      country: get("f-country"),
      track: get("f-track"),
      message: get("f-message").trim(),
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    // EmailJS integration (same service as main site)
    // Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with actual values
    try {
      const emailjs = getEmailJs();
      if (typeof emailjs !== "undefined") {
        await emailjs.send("YOUR_SERVICE_ID", "YOUR_PARTNER_TEMPLATE_ID", {
          to_email: "contact@thehrplayhousehub.org",
          reply_to: data.email,
          ...data,
        });
      } else {
        // Fallback: open mailto
        const body = Object.entries(data)
          .map(([k, v]) => k + ": " + v)
          .join("%0A");
        window.open(
          "mailto:contact@thehrplayhousehub.org?subject=Partnership Enquiry — " +
            encodeURIComponent(data.org) +
            "&body=" +
            body,
        );
      }
    } catch (err) {
      console.error(err);
      const body = Object.entries(data)
        .map(([k, v]) => k + ": " + v)
        .join("%0A");
      window.open(
        "mailto:contact@thehrplayhousehub.org?subject=Partnership Enquiry — " +
          encodeURIComponent(data.org) +
          "&body=" +
          body,
      );
    }

    setSubmitted(true);
  }

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <Link className="nav-logo" href="/">
          HR Playhouse Hub
        </Link>
        <Link className="nav-back" href="/">
          ← Back to homepage
        </Link>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-pill">
            <div className="hero-pill-dot" />
            Partnership Enquiries Open
          </div>
          <h1 className="hero-title">
            Partner with
            <br />
            <em>HR Playhouse Hub.</em>
          </h1>
          <p className="hero-sub">
            Whether you are a professional body seeking CPD recognition, an
            institution looking for sponsored access, or an organisation that
            wants to advance HR capacity — there is a partnership track for you.
          </p>
          <div className="hero-tracks">
            <div
              className={`track-pill${track === "cpd" ? " active" : ""}`}
              onClick={() => selectTrack("cpd")}
            >
              CPD Recognition
            </div>
            <div
              className={`track-pill${
                track === "institutional" ? " active" : ""
              }`}
              onClick={() => selectTrack("institutional")}
            >
              Institutional Partner
            </div>
            <div
              className={`track-pill${track === "academic" ? " active" : ""}`}
              onClick={() => selectTrack("academic")}
            >
              Academic Partner
            </div>
            <div
              className={`track-pill${
                track === "consulting" ? " active" : ""
              }`}
              onClick={() => selectTrack("consulting")}
            >
              Consulting &amp; Delivery
            </div>
            <div
              className={`track-pill${track === "other" ? " active" : ""}`}
              onClick={() => selectTrack("other")}
            >
              Other
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="page-body">
        {/* LEFT: TRACKS */}
        <div className="tracks-section">
          <div className="section-label">Partnership tracks</div>

          <div className="tracks-grid">
            <div
              className={`track-card${track === "cpd" ? " selected" : ""}`}
              ref={(el) => {
                cardRefs.current.cpd = el;
              }}
              onClick={() => selectTrack("cpd")}
            >
              <div className="track-icon">🏆</div>
              <div className="track-name">CPD Recognition Partner</div>
              <div className="track-desc">
                For HR professional bodies — offer your members verified CPD
                hours for completing HR Playhouse Hub learning levels. We handle
                the learning, you validate the credit. A co-branded certificate
                is issued to every completer.
              </div>
              <div className="track-tag">
                ● In active discussion — announce before Sept 2026
              </div>
            </div>

            <div
              className={`track-card${
                track === "institutional" ? " selected" : ""
              }`}
              ref={(el) => {
                cardRefs.current.institutional = el;
              }}
              onClick={() => selectTrack("institutional")}
            >
              <div className="track-icon">🏛️</div>
              <div className="track-name">Institutional Partner</div>
              <div className="track-desc">
                For universities, government bodies, and corporations — sponsor
                professional platform access for your HR team or staff. Includes
                a dedicated onboarding session, quarterly usage reporting, and
                certificates for all completers.
              </div>
              <div className="track-tag">
                ● Founding Partner rate: 40% off for 2 years (until March 2027)
              </div>
            </div>

            <div
              className={`track-card${
                track === "academic" ? " selected" : ""
              }`}
              ref={(el) => {
                cardRefs.current.academic = el;
              }}
              onClick={() => selectTrack("academic")}
            >
              <div className="track-icon">🎓</div>
              <div className="track-name">Academic Partner</div>
              <div className="track-desc">
                For business schools and HR departments — integrate HR Playhouse
                Hub into taught programmes. Includes curriculum mapping, student
                analytics, co-developed case studies, and a white-label option
                for your institution.
              </div>
              <div className="track-tag">
                ● Joint research collaboration also available
              </div>
            </div>

            <div
              className={`track-card${
                track === "consulting" ? " selected" : ""
              }`}
              ref={(el) => {
                cardRefs.current.consulting = el;
              }}
              onClick={() => selectTrack("consulting")}
            >
              <div className="track-icon">🤝</div>
              <div className="track-name">
                Consulting &amp; Delivery Partner
              </div>
              <div className="track-desc">
                For consulting firms and HR practitioners — deliver HR Playhouse
                Hub workshops and the HR Challenge Sprint for your clients.
                Referral fees, co-branding and joint marketing arrangements
                available.
              </div>
              <div className="track-tag">
                ● Pilot delivery partner programme launching Sept 2026
              </div>
            </div>

            <div
              className={`track-card${track === "other" ? " selected" : ""}`}
              ref={(el) => {
                cardRefs.current.other = el;
              }}
              onClick={() => selectTrack("other")}
            >
              <div className="track-icon">💡</div>
              <div className="track-name">Something else in mind?</div>
              <div className="track-desc">
                If you have a partnership idea that does not fit neatly into one
                of the tracks above, we want to hear it. We are open to creative
                arrangements that advance HR professional development.
              </div>
              <div className="track-tag">
                ● All enquiries reviewed within 5 working days
              </div>
            </div>
          </div>

          <div className="offer-box">
            <div className="offer-title">What every partner receives</div>
            <div className="offer-list">
              <div className="offer-item">
                <div className="offer-dot" />
                Named partner status on the HR Playhouse Hub website and platform
              </div>
              <div className="offer-item">
                <div className="offer-dot" />
                Co-branded certificates and programme materials where applicable
              </div>
              <div className="offer-item">
                <div className="offer-dot" />
                Dedicated account contact — direct access to the Founder and
                Director
              </div>
              <div className="offer-item">
                <div className="offer-dot" />
                Quarterly impact report — usage data, completion rates and
                outcomes
              </div>
              <div className="offer-item">
                <div className="offer-dot" />
                Priority access to new content, features and pilot programmes
              </div>
              <div className="offer-item">
                <div className="offer-dot" />
                Joint communications opportunities — press releases, case
                studies, events
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div className="form-panel">
          <div className="form-card">
            {!submitted && (
              <div id="form-wrap">
                <div className="form-title">Register your interest</div>
                <div className="form-sub">
                  Complete this form and we will be in touch within 5 working
                  days to discuss next steps.
                </div>

                <form className="form" onSubmit={handleSubmit}>
                  <input type="hidden" name="track" value={track} readOnly />

                  <div className="form-row">
                    <div className="field">
                      <label>
                        First name <span>*</span>
                      </label>
                      <input
                        type="text"
                        name="f-first"
                        placeholder="e.g. Adaeze"
                        required
                      />
                    </div>
                    <div className="field">
                      <label>
                        Last name <span>*</span>
                      </label>
                      <input
                        type="text"
                        name="f-last"
                        placeholder="e.g. Okafor"
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      Job title <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="f-title"
                      placeholder="e.g. Director of HR &amp; Learning"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>
                      Organisation name <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="f-org"
                      placeholder="e.g. CIPM Nigeria"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>
                      Organisation type <span>*</span>
                    </label>
                    <select name="f-orgtype" required defaultValue="">
                      <option value="" disabled>
                        Select type
                      </option>
                      <option>HR Professional Body</option>
                      <option>University / Higher Education</option>
                      <option>Government Agency</option>
                      <option>Corporation / SME</option>
                      <option>NGO / Non-profit</option>
                      <option>Consulting Firm</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>
                      Work email address <span>*</span>
                    </label>
                    <input
                      type="email"
                      name="f-email"
                      placeholder="you@organisation.com"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Phone number</label>
                    <input
                      type="tel"
                      name="f-phone"
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  <div className="field">
                    <label>Country</label>
                    <select name="f-country" defaultValue="">
                      <option value="" disabled>
                        Select country
                      </option>
                      <option>Nigeria</option>
                      <option>United Kingdom</option>
                      <option>Ghana</option>
                      <option>Kenya</option>
                      <option>South Africa</option>
                      <option>Singapore</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>
                      Partnership track <span>*</span>
                    </label>
                    <select
                      name="f-track"
                      required
                      value={track}
                      onChange={(e) =>
                        selectTrack(e.target.value as TrackValue)
                      }
                    >
                      <option value="cpd">CPD Recognition Partner</option>
                      <option value="institutional">
                        Institutional Partner
                      </option>
                      <option value="academic">Academic Partner</option>
                      <option value="consulting">
                        Consulting &amp; Delivery Partner
                      </option>
                      <option value="other">Other / Not sure yet</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>
                      Tell us about your organisation and what you have in mind{" "}
                      <span>*</span>
                    </label>
                    <textarea
                      name="f-message"
                      placeholder="A brief description of your organisation, your interest in partnering with HR Playhouse Hub, and any specific outcomes you are hoping for..."
                      required
                    />
                  </div>

                  {/* Logo / document upload */}
                  <div className="field">
                    <label>
                      Upload your logo or a supporting document (optional)
                    </label>
                    <div
                      className={`upload-zone${dragOver ? " drag-over" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file && fileInputRef.current) {
                          fileInputRef.current.files = e.dataTransfer.files;
                          handleFile(file);
                        }
                      }}
                    >
                      <input
                        type="file"
                        name="f-file"
                        ref={fileInputRef}
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e.currentTarget)}
                      />
                      <div className="upload-icon">📎</div>
                      <div className="upload-label">
                        Click to upload or drag and drop
                      </div>
                      <div className="upload-sub">
                        PNG, JPG, PDF or Word · Max 5MB
                      </div>
                    </div>
                    <div
                      className={`file-preview${fileName ? " show" : ""}`}
                    >
                      <span className="file-name">{fileName}</span>
                      <span
                        className="file-remove"
                        onClick={removeFile}
                        title="Remove"
                      >
                        ✕
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span>Sending...</span>
                    ) : (
                      <span>Submit partnership enquiry →</span>
                    )}
                  </button>
                  <div className="form-note">
                    We respond to all enquiries within 5 working days. Your
                    details are kept strictly confidential.
                  </div>
                </form>
              </div>
            )}

            <div className={`success-state${submitted ? " show" : ""}`}>
              <div className="success-icon">✅</div>
              <div className="success-title">Enquiry received!</div>
              <div className="success-sub">
                Thank you for reaching out. We will review your enquiry and be
                in touch within 5 working days at the email address you
                provided.
                <br />
                <br />
                In the meantime, you are welcome to explore the platform at{" "}
                <a
                  href="https://learn.thehrplayhousehub.org"
                  style={{ color: "var(--accent)", fontWeight: 600 }}
                >
                  learn.thehrplayhousehub.org
                </a>
                .
              </div>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  marginTop: 24,
                  height: 44,
                  padding: "0 24px",
                  background: "var(--navy)",
                  color: "#fff",
                  borderRadius: 100,
                  fontFamily: "var(--fb)",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                ← Back to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-text">
          The HR Playhouse Hub Limited · RC 8387672 ·{" "}
          <Link className="footer-link" href="/">
            thehrplayhousehub.org
          </Link>{" "}
          ·{" "}
          <a
            className="footer-link"
            href="mailto:contact@thehrplayhousehub.org"
          >
            contact@thehrplayhousehub.org
          </a>
        </div>
      </footer>
    </>
  );
}
