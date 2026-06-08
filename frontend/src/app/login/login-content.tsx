"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/stores/auth";
import "./login.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only allow same-app relative redirects (prevent open-redirect to ext URLs).
function safeNext(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/learn/dashboard";
}

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const setSession = useAuth((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [banner, setBanner] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBanner(null);

    const em = email.trim();
    const emailOk = EMAIL_RE.test(em);
    const passOk = password.length > 0;
    setErrors({ email: !emailOk, password: !passOk });
    if (!emailOk || !passOk) return;

    setLoading(true);
    try {
      const res = await auth.login({ email: em, password });
      setSession({ token: res.token, user: res.user, expires_at: res.expires_at });
      router.push(next);
    } catch (err) {
      if (err instanceof ApiError) {
        setBanner(err.message || "Invalid email or password.");
      } else {
        setBanner("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <nav className="nav">
        <a className="nav-logo" href="/">
          <span className="nav-logo-pill">HR</span>
          <span className="nav-logo-text">Playhouse Hub</span>
        </a>
        <Link className="nav-back" href="/">
          ← Back to home
        </Link>
      </nav>

      <div className="page">
        <div className="left-panel">
          <div className="lp-glow" />
          <div className="lp-glow-2" />
          <div className="lp-tag">
            <span className="lp-tag-line" />
            Welcome back
          </div>
          <h1 className="lp-title">
            Pick up<br />
            <em>where you left off.</em>
          </h1>
          <p className="lp-sub">
            Sign in to continue your HR learning journey — your courses, certificates, and
            progress are right where you left them.
          </p>
        </div>

        <div className="right-panel">
          <div className="form-header">
            <h2 className="form-title">Sign in</h2>
            <p className="form-sub">
              New here? <Link href="/signup">Create an account</Link>
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {banner && <div className="error-banner">{banner}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className={`form-input${errors.email ? " error" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setErrors((p) => ({ ...p, email: !EMAIL_RE.test(email.trim()) }))}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <span className="form-error-msg">Enter a valid email address.</span>}
            </div>

            <div className="form-group">
              <div className="form-row-between">
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
                <Link className="forgot-link" href="/password-reset">
                  Forgot password?
                </Link>
              </div>
              <div className="password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className={`form-input${errors.password ? " error" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <span className="form-error-msg">Enter your password.</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : <span className="btn-text">Sign in</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
