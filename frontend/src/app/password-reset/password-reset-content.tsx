"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { usePasswordResetRequest, usePasswordResetConfirm } from "@/lib/hooks";
import { ApiError } from "@/lib/api/client";
import "./password-reset.css";

/**
 * Forgot-password flow.
 *
 * Wired to the real backend:
 *  - Request step: usePasswordResetRequest() POSTs the email. The backend
 *    returns {ok:true} whether or not the address exists, so we always show
 *    the same neutral "check your inbox" confirmation (no account enumeration).
 *  - Confirm step: when the page is opened with a ?token= query param, we show
 *    a "set a new password" form wired to usePasswordResetConfirm().
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PasswordResetContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Confirm step is active when a reset token is present in the URL.
  if (token) {
    return <ConfirmStep token={token} />;
  }
  return <RequestStep />;
}

/* --------------------------------------------------------------------- */
/* Request step — enter email, send reset link                           */
/* --------------------------------------------------------------------- */

function RequestStep() {
  const requestReset = usePasswordResetRequest();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function sendLink() {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    try {
      await requestReset.mutateAsync(value);
    } catch (err) {
      // Surface only genuine transport/server failures; a non-existent
      // account still resolves to {ok:true} so we never reveal that here.
      if (err instanceof ApiError && err.status >= 500) {
        setError("Something went wrong. Please try again in a moment.");
        return;
      }
    }
    // Always the same neutral message regardless of whether the email exists.
    setSent(true);
  }

  async function resendLink() {
    if (requestReset.isPending) return;
    const value = email.trim();
    if (!EMAIL_RE.test(value)) return;
    try {
      await requestReset.mutateAsync(value);
    } catch {
      // Swallow — neutral resend, no enumeration.
    }
  }

  return (
    <Shell>
      {!sent ? (
        <div>
          <div className="step-bar">
            <div className="step-dot on" />
            <div className="step-dot" />
            <div className="step-dot" />
          </div>
          <h1 className="auth-title">Forgot your password?</h1>
          <p className="auth-sub">
            Enter your account email address and we will send you a link to
            reset your password.
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
          {error && (
            <p
              style={{
                color: "#c9351e",
                fontSize: 13,
                margin: "8px 0 0",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
          <button
            className="btn btn-accent"
            style={{ width: "100%", marginTop: 12 }}
            onClick={sendLink}
            disabled={requestReset.isPending}
          >
            {requestReset.isPending ? "Sending…" : "Send reset link →"}
          </button>
          <div className="auth-divider">
            <a href="/login">← Back to sign in</a>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div className="step-bar">
            <div className="step-dot" />
            <div className="step-dot on" />
            <div className="step-dot" />
          </div>
          <div style={{ fontSize: 52, marginBottom: 16 }}>📬</div>
          <h2 className="auth-title">Check your inbox</h2>
          <p className="auth-sub">
            If an account exists for that email address, we have sent a link to
            reset your password. Click the link in that email to set a new
            password.
          </p>
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
              disabled={requestReset.isPending}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                fontWeight: 600,
                cursor: requestReset.isPending ? "default" : "pointer",
                fontSize: 13,
                padding: 0,
                fontFamily: "var(--f-body)",
              }}
            >
              {requestReset.isPending ? "resending…" : "click here to resend"}
            </button>
            .
          </div>
          <div className="auth-divider">
            <a href="/login">← Back to sign in</a>
          </div>
        </div>
      )}
    </Shell>
  );
}

/* --------------------------------------------------------------------- */
/* Confirm step — token from URL, set a new password                     */
/* --------------------------------------------------------------------- */

function ConfirmStep({ token }: { token: string }) {
  const confirmReset = usePasswordResetConfirm();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit() {
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    try {
      await confirmReset.mutateAsync({ token, newPassword: password });
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.message ||
            "This reset link is invalid or has expired. Please request a new one.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <Shell>
      {!done ? (
        <div>
          <div className="step-bar">
            <div className="step-dot" />
            <div className="step-dot" />
            <div className="step-dot on" />
          </div>
          <h1 className="auth-title">Set a new password</h1>
          <p className="auth-sub">
            Choose a new password for your account. It must be at least 8
            characters long.
          </p>
          <div className="field">
            <label>
              New password <span>*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
          </div>
          <div className="field">
            <label>
              Confirm password <span>*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "var(--ink-3)",
              margin: "4px 0 0",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            Show password
          </label>
          {error && (
            <p
              style={{
                color: "#c9351e",
                fontSize: 13,
                margin: "8px 0 0",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
          <button
            className="btn btn-accent"
            style={{ width: "100%", marginTop: 12 }}
            onClick={submit}
            disabled={confirmReset.isPending}
          >
            {confirmReset.isPending ? "Saving…" : "Set new password →"}
          </button>
          <div className="auth-divider">
            <a href="/login">← Back to sign in</a>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div className="step-bar">
            <div className="step-dot" />
            <div className="step-dot" />
            <div className="step-dot on" />
          </div>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✓</div>
          <h2 className="auth-title">Password updated</h2>
          <p className="auth-sub">
            Your password has been changed successfully. You can now sign in
            with your new password.
          </p>
          <a
            className="btn btn-accent"
            href="/login"
            style={{
              display: "inline-block",
              width: "100%",
              marginTop: 12,
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Go to sign in →
          </a>
        </div>
      )}
    </Shell>
  );
}

/* --------------------------------------------------------------------- */
/* Shared card shell (logo + layout) used by both steps                  */
/* --------------------------------------------------------------------- */

function Shell({ children }: { children: React.ReactNode }) {
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
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
