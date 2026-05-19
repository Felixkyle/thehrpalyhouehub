"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./password-reset.css";

/**
 * Forgot-password flow.
 *
 * Faithful port of password-reset.html. The original used two `<div>`s toggled
 * via `style.display` and imperative `sendLink()` / `resendLink()` functions;
 * that is now a `step` state machine with real React handlers. Behaviour is
 * unchanged: it validates the email, opens a prefilled mailto to support
 * (the WP reset endpoint is still a TODO from the original), then shows the
 * "check your inbox" step with the address interpolated into the message.
 */
export default function PasswordResetContent() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [sentMessage, setSentMessage] = useState(
    "We have sent a reset link to your email address. Click the link in that email to create a new password.",
  );

  function sendLink() {
    const value = email.trim();
    if (!value) {
      alert("Please enter your email address.");
      return;
    }
    if (!value.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    // Stephen: replace with POST to /wp-json/bdpwr/v1/reset-password or WP
    // lostpassword endpoint.
    window.location.href =
      "mailto:contact@thehrplayhousehub.org" +
      "?subject=" +
      encodeURIComponent("Password Reset Request") +
      "&body=" +
      encodeURIComponent("Please reset the password for account: " + value);
    setSentMessage(
      `We have sent a reset link to ${value}. Click the link in that email to set a new password.`,
    );
    setStep(2);
  }

  function resendLink() {
    alert(
      "A new reset link has been sent. Please check your inbox and spam folder.",
    );
  }

  return (
    <>
      <Nav />
      <main>
        <div className="auth-bg">
          <div className="auth-card">
            <div className="auth-logo-row">
              <div
                className="nav-logo-pill"
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: 11,
                  fontWeight: 800,
                  background: "var(--accent)",
                  color: "#fff",
                  padding: "4px 11px",
                  borderRadius: 100,
                }}
              >
                HR Playhouse
              </div>
              <div
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--ink-3)",
                }}
              >
                Hub
              </div>
            </div>

            {step === 1 && (
              <div>
                <div className="step-bar">
                  <div className="step-dot on" />
                  <div className="step-dot" />
                  <div className="step-dot" />
                </div>
                <h1 className="auth-title">Forgot your password?</h1>
                <p className="auth-sub">
                  Enter your account email address and we will send you a link
                  to reset your password.
                </p>
                <div className="field">
                  <label>
                    Email address <span>*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendLink();
                    }}
                  />
                </div>
                <button
                  className="btn btn-accent"
                  style={{ width: "100%", marginTop: 4 }}
                  onClick={sendLink}
                >
                  Send reset link →
                </button>
                <div className="auth-divider">
                  <a href="https://learn.thehrplayhousehub.org/sign-in/">
                    ← Back to sign in
                  </a>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ textAlign: "center" }}>
                <div className="step-bar">
                  <div className="step-dot" />
                  <div className="step-dot on" />
                  <div className="step-dot" />
                </div>
                <div style={{ fontSize: 52, marginBottom: 16 }}>📬</div>
                <h2 className="auth-title">Check your inbox</h2>
                <p className="auth-sub">{sentMessage}</p>
                <div
                  style={{
                    background: "var(--canvas-2)",
                    borderRadius: 10,
                    padding: "14px 16px",
                    margin: "20px 0",
                    fontSize: 13,
                    color: "var(--ink-3)",
                    lineHeight: 1.6,
                    textAlign: "left",
                  }}
                >
                  Didn&apos;t receive it? Check your spam folder, or{" "}
                  <button
                    onClick={resendLink}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent)",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 13,
                      padding: 0,
                      fontFamily: "var(--f-body)",
                    }}
                  >
                    click here to resend
                  </button>
                  .
                </div>
                <div className="auth-divider">
                  <a href="https://learn.thehrplayhousehub.org/sign-in/">
                    ← Back to sign in
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
