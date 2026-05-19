"use client";

import { useState } from "react";
import Script from "next/script";
import "./signup.css";

/**
 * Account sign-up page.
 *
 * Faithful port of 01_signup.html. This page ships its OWN nav and design
 * system (and has no site footer at all), so the standard shared
 * <Nav />/<Footer /> components are deliberately NOT used — the original
 * nav (logo + "Already have an account? Sign in") is ported inline.
 *
 * The original imperative script is reproduced exactly:
 *  - EmailJS is loaded from the same CDN via next/script and initialised with
 *    the placeholder public key (DEVELOPER INSTRUCTIONS comment preserved).
 *  - togglePassword(): swaps the input type and the 👁 / 🙈 icon.
 *  - validateField()/live blur validation: adds `has-error` to the group and
 *    `error` to the control; the same regex and >=8 password rule are used.
 *  - submit: validates all fields (consent failure outlines the consent row
 *    red), enters the loading state, sends via emailjs.send with the identical
 *    template params (incl. the "Not specified" fallbacks and en-GB date),
 *    then shows the success state — or, on failure, reveals the error banner
 *    and restores the button.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ── EMAILJS SETUP ──────────────────────────────────────────────
   DEVELOPER INSTRUCTIONS:
   1. Go to https://www.emailjs.com/ and create a free account
   2. Add a service (Gmail is easiest — connect contact@thehrplayhousehub.org)
   3. Create an email template with these variables:
      {{firstname}}, {{lastname}}, {{email}}, {{role}}, {{country}}, {{how}}, {{signup_date}}
   4. Replace the three placeholder values below with your real IDs
   ─────────────────────────────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY"; // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // e.g. 'service_xxxxx'
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // e.g. 'template_xxxxx'

interface SignupEmailJs {
  init: (opts: { publicKey: string }) => void;
  send: (
    serviceId: string,
    templateId: string,
    params: Record<string, unknown>,
  ) => Promise<unknown>;
}

/** Access the CDN-loaded EmailJS without a global Window augmentation
 * (other pages augment Window.emailjs with a different shape). */
function getEmailJs(): SignupEmailJs | undefined {
  return (window as unknown as { emailjs?: SignupEmailJs }).emailjs;
}

type FieldId = "firstname" | "lastname" | "email" | "password" | "role";

export default function SignupContent() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [how, setHow] = useState("");
  const [consent, setConsent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<FieldId, boolean>>({
    firstname: false,
    lastname: false,
    email: false,
    password: false,
    role: false,
  });
  const [consentError, setConsentError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function setFieldError(id: FieldId, condition: boolean): boolean {
    setErrors((prev) => ({ ...prev, [id]: !condition }));
    return condition;
  }

  function validateOnBlur(id: FieldId, rawValue: string) {
    const v = rawValue.trim();
    if (id === "email") setFieldError(id, EMAIL_RE.test(v));
    else if (id === "password") setFieldError(id, v.length >= 8);
    else setFieldError(id, v !== "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fn = firstname.trim();
    const ln = lastname.trim();
    const em = email.trim();
    const pw = password;
    const rl = role;
    const co = country;
    const hw = how;

    // Validate
    let valid = true;
    valid = setFieldError("firstname", fn.length > 0) && valid;
    valid = setFieldError("lastname", ln.length > 0) && valid;
    valid = setFieldError("email", EMAIL_RE.test(em)) && valid;
    valid = setFieldError("password", pw.length >= 8) && valid;
    valid = setFieldError("role", rl !== "") && valid;
    if (!consent) {
      setConsentError(true);
      valid = false;
    } else {
      setConsentError(false);
    }
    if (!valid) return;

    // Loading state
    setLoading(true);
    setShowErrorBanner(false);

    const templateParams = {
      to_email: "contact@thehrplayhousehub.org",
      reply_to: em,
      firstname: fn,
      lastname: ln,
      email: em,
      role: rl,
      country: co || "Not specified",
      how: hw || "Not specified",
      signup_date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      const emailjs = getEmailJs();
      if (!emailjs) throw new Error("EmailJS not loaded");
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
      );
      // Show success
      setSubmitted(true);
    } catch (err) {
      console.error("EmailJS error:", err);
      setShowErrorBanner(true);
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          getEmailJs()?.init({ publicKey: EMAILJS_PUBLIC_KEY });
        }}
      />

      <nav className="nav">
        <a className="nav-logo" href="https://www.thehrplayhousehub.org/">
          <div className="nav-logo-pill">HR Playhouse</div>
          <div className="nav-logo-text">Hub</div>
        </a>
        <a
          className="nav-back"
          href="https://learn.thehrplayhousehub.org/courses/"
        >
          ← Already have an account? Sign in
        </a>
      </nav>

      <div className="page">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="lp-glow" />
          <div className="lp-glow-2" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="lp-tag">
              <div className="lp-tag-line" />
              Free to join
            </div>
            <h1 className="lp-title">
              Start your HR
              <br />
              journey <em>today.</em>
            </h1>
            <p className="lp-sub">
              Join HR professionals from the UK, Nigeria, Singapore, and beyond
              who are building genuinely better HR practice.
            </p>
            <div className="lp-benefits">
              <div className="lp-benefit">
                <div className="lp-benefit-icon">🎓</div>
                <div>
                  <div className="lp-benefit-title">
                    Four progressive learning levels
                  </div>
                  <div className="lp-benefit-body">
                    Foundations through to future-forward innovation — at your
                    own pace.
                  </div>
                </div>
              </div>
              <div className="lp-benefit">
                <div className="lp-benefit-icon">📚</div>
                <div>
                  <div className="lp-benefit-title">
                    32+ original case studies
                  </div>
                  <div className="lp-benefit-body">
                    Real decisions, real HR situations, real outcomes to learn
                    from.
                  </div>
                </div>
              </div>
              <div className="lp-benefit">
                <div className="lp-benefit-icon">📖</div>
                <div>
                  <div className="lp-benefit-title">Everyday HR Playbook</div>
                  <div className="lp-benefit-body">
                    Legal checklists for UK, Nigeria, USA, Singapore, China &amp;
                    Hong Kong.
                  </div>
                </div>
              </div>
              <div className="lp-benefit">
                <div className="lp-benefit-icon">🤖</div>
                <div>
                  <div className="lp-benefit-title">AI-powered HR support</div>
                  <div className="lp-benefit-body">
                    Upload documents, ask questions, get research-backed HR
                    guidance.
                  </div>
                </div>
              </div>
            </div>
            <div className="lp-rule" />
            <div className="lp-social-proof">
              Join <em>HR professionals</em> from 20+ countries already learning
              on the platform.
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          {/* FORM STATE */}
          {!submitted && (
            <div id="form-state">
              <div className="form-header">
                <div className="form-title">Create your account</div>
                <div className="form-sub">
                  Already registered?{" "}
                  <a href="https://learn.thehrplayhousehub.org/sign-in/">
                    Sign in here
                  </a>
                </div>
              </div>

              <form id="signup-form" onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                  <div
                    className={`form-group${
                      errors.firstname ? " has-error" : ""
                    }`}
                  >
                    <label className="form-label" htmlFor="firstname">
                      First name <span>*</span>
                    </label>
                    <input
                      className={`form-input${
                        errors.firstname ? " error" : ""
                      }`}
                      type="text"
                      id="firstname"
                      name="firstname"
                      placeholder="Ada"
                      autoComplete="given-name"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      onBlur={(e) =>
                        validateOnBlur("firstname", e.target.value)
                      }
                    />
                    <div className="form-error-msg">
                      Please enter your first name
                    </div>
                  </div>

                  <div
                    className={`form-group${
                      errors.lastname ? " has-error" : ""
                    }`}
                  >
                    <label className="form-label" htmlFor="lastname">
                      Last name <span>*</span>
                    </label>
                    <input
                      className={`form-input${
                        errors.lastname ? " error" : ""
                      }`}
                      type="text"
                      id="lastname"
                      name="lastname"
                      placeholder="Okonkwo"
                      autoComplete="family-name"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      onBlur={(e) => validateOnBlur("lastname", e.target.value)}
                    />
                    <div className="form-error-msg">
                      Please enter your last name
                    </div>
                  </div>

                  <div
                    className={`form-group full${
                      errors.email ? " has-error" : ""
                    }`}
                  >
                    <label className="form-label" htmlFor="email">
                      Email address <span>*</span>
                    </label>
                    <input
                      className={`form-input${errors.email ? " error" : ""}`}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="ada@company.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={(e) => validateOnBlur("email", e.target.value)}
                    />
                    <div className="form-error-msg">
                      Please enter a valid email address
                    </div>
                  </div>

                  <div
                    className={`form-group${
                      errors.password ? " has-error" : ""
                    }`}
                  >
                    <label className="form-label" htmlFor="password">
                      Password <span>*</span>
                    </label>
                    <div className="password-wrap">
                      <input
                        className={`form-input${
                          errors.password ? " error" : ""
                        }`}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={(e) =>
                          validateOnBlur("password", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((v) => !v)}
                        id="pwd-toggle"
                      >
                        {showPassword ? "🙈" : "👁"}
                      </button>
                    </div>
                    <div className="form-hint">At least 8 characters</div>
                    <div className="form-error-msg">
                      Password must be at least 8 characters
                    </div>
                  </div>

                  <div
                    className={`form-group${
                      errors.role ? " has-error" : ""
                    }`}
                  >
                    <label className="form-label" htmlFor="role">
                      Your HR role <span>*</span>
                    </label>
                    <div className="form-select-wrap">
                      <select
                        className={`form-select${
                          errors.role ? " error" : ""
                        }`}
                        id="role"
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="">Select your role</option>
                        <option>Early-Career HR Professional</option>
                        <option>HR Generalist / Advisor</option>
                        <option>HR Business Partner</option>
                        <option>HR Manager</option>
                        <option>HR Director / CHRO</option>
                        <option>People Operations</option>
                        <option>Manager with HR responsibilities</option>
                        <option>Student / Career Changer</option>
                        <option>HR Consultant</option>
                      </select>
                    </div>
                    <div className="form-error-msg">
                      Please select your role
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="country">
                      Country
                    </label>
                    <div className="form-select-wrap">
                      <select
                        className="form-select"
                        id="country"
                        name="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="">Select country</option>
                        <option>United Kingdom</option>
                        <option>Nigeria</option>
                        <option>United States</option>
                        <option>Singapore</option>
                        <option>Ghana</option>
                        <option>Kenya</option>
                        <option>South Africa</option>
                        <option>Canada</option>
                        <option>Australia</option>
                        <option>India</option>
                        <option>Hong Kong</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group full">
                    <label className="form-label" htmlFor="how">
                      How did you hear about us?
                    </label>
                    <div className="form-select-wrap">
                      <select
                        className="form-select"
                        id="how"
                        name="how"
                        value={how}
                        onChange={(e) => setHow(e.target.value)}
                      >
                        <option value="">Select one</option>
                        <option>
                          Social media (LinkedIn, Instagram, Twitter)
                        </option>
                        <option>Word of mouth / colleague</option>
                        <option>Google search</option>
                        <option>Professional network</option>
                        <option>CIPD / SHRM community</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-divider" />

                  <div
                    className="consent-row"
                    id="fg-consent"
                    style={
                      consentError
                        ? { outline: "2px solid #c9351e" }
                        : { outline: "none" }
                    }
                  >
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    <div className="consent-text">
                      I agree to the{" "}
                      <a
                        href="https://learn.thehrplayhousehub.org/terms-of-service/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Terms &amp; Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://learn.thehrplayhousehub.org/privacy-policy/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Privacy Policy
                      </a>
                      . I understand my data will be used to manage my account
                      and improve the platform.
                    </div>
                  </div>

                  <div
                    className={`error-banner${
                      showErrorBanner ? " show" : ""
                    }`}
                    id="error-banner"
                  >
                    ⚠ Something went wrong. Please try again or contact{" "}
                    <strong>contact@thehrplayhousehub.org</strong>
                  </div>

                  <button
                    type="submit"
                    className={`submit-btn${loading ? " loading" : ""}`}
                    id="submit-btn"
                    disabled={loading}
                  >
                    <span className="btn-text">Create account →</span>
                    <div className="btn-spinner" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SUCCESS STATE */}
          <div
            className={`success-state${submitted ? " show" : ""}`}
            id="success-state"
          >
            <div className="success-icon">✓</div>
            <div className="success-title">Welcome to the Hub!</div>
            <div className="success-sub">
              Your account details have been received. Complete your
              registration on the learning platform to access all courses and
              features.
            </div>
            <div className="success-steps">
              <div className="success-step">
                <div className="ss-num">1</div>
                <div className="ss-text">
                  <strong>Check your email</strong> — we&apos;ve sent a
                  confirmation to the address you provided.
                </div>
              </div>
              <div className="success-step">
                <div className="ss-num">2</div>
                <div className="ss-text">
                  <strong>Complete registration</strong> on the learning
                  platform by clicking the button below.
                </div>
              </div>
              <div className="success-step">
                <div className="ss-num">3</div>
                <div className="ss-text">
                  <strong>Start Level 1</strong> — your HR journey begins the
                  moment you enrol in your first course.
                </div>
              </div>
            </div>
            <a
              className="success-cta"
              href="https://learn.thehrplayhousehub.org/register-2/"
              target="_blank"
              rel="noreferrer"
            >
              Complete registration on the platform →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
