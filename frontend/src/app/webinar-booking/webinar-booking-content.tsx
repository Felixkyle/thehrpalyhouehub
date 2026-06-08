"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useWebinars, useRegisterWebinar, useUnregisterWebinar } from "@/lib/hooks";
import { useAuth } from "@/lib/stores/auth";
import { ApiError } from "@/lib/api/client";
import type { WebinarSession } from "@/lib/api/types";
import "./webinar-booking.css";

/**
 * Webinar booking page — wired to the real backend.
 *
 * Sessions now come from `useWebinars()` ({ webinars: WebinarSession[] })
 * instead of the old localStorage 'hrph_webinars' store. The Register action
 * calls `useRegisterWebinar()` ({ id, body }); a registered session can be
 * cancelled with `useUnregisterWebinar()` (id). Registration requires auth —
 * when there is no token we prompt the user to sign in. The registered count
 * and is_registered flag are read straight from the API (no local increment),
 * and TanStack Query re-fetches them after a mutation.
 *
 * The session-card / registration-form / toast markup and CSS classes are
 * preserved. The old browser-only "Edit Mode" admin bar, add/edit modal and
 * JSON export operated purely on the mock localStorage data and have no API
 * counterpart, so they are dropped.
 */

/* ── RENDER HELPERS ─────────────────────────────────── */
function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Build the "time" line shown on cards from the schedule + duration. */
function formatTime(s: WebinarSession): string {
  if (s.type === "recorded") {
    return s.duration_minutes ? `${s.duration_minutes} min` : "";
  }
  if (!s.scheduled_at) return "";
  const start = new Date(s.scheduled_at);
  if (Number.isNaN(start.getTime())) return "";
  const opts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const startStr = start.toLocaleTimeString("en-GB", opts);
  if (s.duration_minutes) {
    const end = new Date(start.getTime() + s.duration_minutes * 60000);
    const endStr = end.toLocaleTimeString("en-GB", opts);
    return `${startStr} — ${endStr} WAT`;
  }
  return `${startStr} WAT`;
}

function getInitials(name: string): string {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function isPast(s: WebinarSession): boolean {
  if (!s.scheduled_at) return false;
  const d = new Date(s.scheduled_at);
  if (Number.isNaN(d.getTime())) return false;
  return d < new Date();
}

export default function WebinarBookingContent() {
  const token = useAuth((st) => st.token);
  const user = useAuth((st) => st.user);

  const { data, isLoading, isError, error, refetch } = useWebinars();
  const registerMut = useRegisterWebinar();
  const unregisterMut = useUnregisterWebinar();

  const sessions: WebinarSession[] = data?.webinars ?? [];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);
  const [reg, setReg] = useState({
    fname: "",
    lname: "",
    email: "",
    org: "",
    level: "",
  });

  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null,
  );
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formCardRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string, type?: string) => {
    setToast({ msg, type: type || "" });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  /* Prefill the registration form from the signed-in user once known. */
  useEffect(() => {
    if (!user) return;
    setReg((prev) => ({
      ...prev,
      fname: prev.fname || user.first_name || "",
      lname: prev.lname || user.last_name || "",
      email: prev.email || user.email || "",
      org: prev.org || user.organisation || "",
    }));
  }, [user]);

  const upcomingCount = sessions.filter(
    (s) => s.type !== "recorded" && !isPast(s),
  ).length;

  /* ── SELECT SESSION ─────────────────────────────────── */
  function selectSession(id: string) {
    setSelectedId(id);
    setRegSuccess(false);
    if (formCardRef.current)
      formCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
  }

  /* ── REGISTER ───────────────────────────────────────── */
  async function registerForWebinar() {
    if (!token) {
      showToast("Please sign in to register for a session", "warning");
      return;
    }
    if (!selectedId) {
      showToast("Please select a session first", "warning");
      return;
    }
    const fname = reg.fname.trim();
    const email = reg.email.trim();
    if (!fname || !email) {
      showToast("Please enter your name and email", "warning");
      return;
    }
    const s = sessions.find((x) => x.id === selectedId);
    if (!s) return;

    try {
      await registerMut.mutateAsync({
        id: s.id,
        body: {
          first_name: fname,
          last_name: reg.lname.trim() || undefined,
          email,
          organisation: reg.org.trim() || undefined,
          hr_level: reg.level || undefined,
        },
      });
      setRegSuccess(true);
      showToast("You're registered ✓", "success");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not register — please try again";
      showToast(msg, "warning");
    }
  }

  /* ── UNREGISTER ─────────────────────────────────────── */
  async function unregisterFromWebinar(id: string) {
    if (!token) {
      showToast("Please sign in first", "warning");
      return;
    }
    try {
      await unregisterMut.mutateAsync(id);
      if (selectedId === id) setRegSuccess(false);
      showToast("Registration cancelled");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not cancel — please try again";
      showToast(msg, "warning");
    }
  }

  const selectedSession = sessions.find((x) => x.id === selectedId);

  return (
    <>
      <Nav />

      <main>
        {/* HERO */}
        <div className="page-hero">
          <div className="eyebrow">Live Learning</div>
          <h1 className="page-title">Webinar Booking</h1>
          <p className="page-sub">
            Free live sessions hosted by Dr. Marvellous and guest HR
            practitioners. Pick a session and register below.
          </p>
        </div>

        <div className="wrap">
          <div className="wb-grid">
            {/* LEFT: SESSION LIST */}
            <div>
              <div className="section-header">
                <div className="section-eyebrow">
                  Upcoming &amp; Recent Sessions
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--ink-4)",
                      fontWeight: 600,
                    }}
                  >
                    {sessions.length
                      ? `${upcomingCount} upcoming session${
                          upcomingCount !== 1 ? "s" : ""
                        }`
                      : ""}
                  </span>
                </div>
              </div>

              {/* LOADING STATE */}
              {isLoading && (
                <div className="empty-state">
                  <div className="empty-state-icon">⏳</div>
                  <div className="empty-state-title">Loading sessions…</div>
                  <div className="empty-state-body">
                    Fetching the latest webinar schedule.
                  </div>
                </div>
              )}

              {/* ERROR STATE */}
              {!isLoading && isError && (
                <div className="empty-state">
                  <div className="empty-state-icon">⚠️</div>
                  <div className="empty-state-title">
                    Could not load sessions
                  </div>
                  <div className="empty-state-body">
                    {error instanceof ApiError
                      ? error.message
                      : "Something went wrong. Please try again."}
                    <br />
                    <button
                      className="register-btn"
                      style={{ marginTop: 12 }}
                      onClick={() => refetch()}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {!isLoading && !isError && (
                <div className="wb-sessions">
                  {sessions.map((s) => {
                    const past = s.type !== "recorded" && isPast(s);
                    const isRec = s.type === "recorded";
                    const isSel = s.id === selectedId;

                    let typePill: React.ReactNode;
                    if (isRec)
                      typePill = (
                        <span className="session-type-pill pill-recorded">
                          📼 Recorded
                        </span>
                      );
                    else if (s.type === "upcoming")
                      typePill = (
                        <span className="session-type-pill pill-upcoming">
                          🔵 Coming Soon
                        </span>
                      );
                    else
                      typePill = (
                        <span className="session-type-pill pill-live">
                          🔴 Live{past ? " — Past" : " — Upcoming"}
                        </span>
                      );

                    const clickable = !isRec;
                    const time = formatTime(s);

                    return (
                      <div
                        key={s.id}
                        className={`wb-session${isSel ? " selected" : ""}${
                          past ? " past" : ""
                        }`}
                        onClick={
                          clickable ? () => selectSession(s.id) : undefined
                        }
                      >
                        <div>
                          {typePill}
                          {s.is_free ? (
                            <span
                              className="session-type-pill pill-free"
                              style={{ marginLeft: 6 }}
                            >
                              Free
                            </span>
                          ) : null}
                        </div>
                        <div className="session-title">{s.title}</div>
                        <div className="session-meta">
                          {s.scheduled_at ? (
                            <span>📅 {formatDate(s.scheduled_at)}</span>
                          ) : null}
                          {time ? <span>🕑 {time}</span> : null}
                          {s.platform ? <span>🎥 {s.platform}</span> : null}
                        </div>
                        <div className="session-desc">{s.description}</div>
                        {s.speaker_name ? (
                          <div className="session-speaker">
                            <div className="speaker-av">
                              {getInitials(s.speaker_name)}
                            </div>
                            <span>
                              {s.speaker_name}
                              {s.speaker_role ? " · " + s.speaker_role : ""}
                            </span>
                          </div>
                        ) : null}

                        {isRec && s.recording_url ? (
                          <div className="session-actions">
                            <a
                              className="register-btn"
                              style={{
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                              href={s.recording_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Watch recording →
                            </a>
                            {s.registered_count ? (
                              <span className="session-count">
                                👥 {s.registered_count} watched
                              </span>
                            ) : null}
                          </div>
                        ) : !past && !isRec ? (
                          <div className="session-actions">
                            {s.is_registered ? (
                              <button
                                className="register-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  unregisterFromWebinar(s.id);
                                }}
                                disabled={
                                  unregisterMut.isPending &&
                                  unregisterMut.variables === s.id
                                }
                              >
                                Registered ✓ — Cancel
                              </button>
                            ) : (
                              <button
                                className="register-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectSession(s.id);
                                }}
                              >
                                {isSel ? "Selected ✓" : "Register →"}
                              </button>
                            )}
                            {s.registered_count ? (
                              <span className="session-count">
                                👥 {s.registered_count} registered
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}

              {!isLoading && !isError && !sessions.length && (
                <div className="empty-state">
                  <div className="empty-state-icon">📅</div>
                  <div className="empty-state-title">No sessions yet</div>
                  <div className="empty-state-body">
                    Check back soon — new webinars are scheduled regularly.
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: REGISTRATION FORM */}
            <div>
              <div className="wb-form-card" ref={formCardRef}>
                <div
                  style={{
                    fontFamily: "var(--f-display)",
                    fontSize: 17,
                    fontWeight: 900,
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  Register for a session
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-4)",
                    marginBottom: 20,
                  }}
                >
                  Select a session on the left, then complete your details.
                </div>

                {/* SIGN-IN PROMPT when not authenticated */}
                {!token && (
                  <div
                    className="error-banner show"
                    style={{
                      marginBottom: 16,
                      padding: 12,
                      borderRadius: 10,
                      fontSize: 13,
                    }}
                  >
                    Please{" "}
                    <a href="/login" style={{ fontWeight: 700 }}>
                      sign in
                    </a>{" "}
                    to register for a webinar.
                  </div>
                )}

                <div
                  className={`selected-session-box${
                    selectedSession ? " show" : ""
                  }`}
                >
                  <div className="ssb-title">
                    {selectedSession ? selectedSession.title : "—"}
                  </div>
                  <div className="ssb-date">
                    {selectedSession
                      ? formatDate(selectedSession.scheduled_at) +
                        (formatTime(selectedSession)
                          ? " · " + formatTime(selectedSession)
                          : "")
                      : "—"}
                  </div>
                </div>

                <div className="field">
                  <label>
                    First name <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={reg.fname}
                    onChange={(e) => setReg({ ...reg, fname: e.target.value })}
                    placeholder="Your first name"
                  />
                </div>
                <div className="field">
                  <label>
                    Last name <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={reg.lname}
                    onChange={(e) => setReg({ ...reg, lname: e.target.value })}
                    placeholder="Your last name"
                  />
                </div>
                <div className="field">
                  <label>
                    Email address <span>*</span>
                  </label>
                  <input
                    type="email"
                    value={reg.email}
                    onChange={(e) => setReg({ ...reg, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="field">
                  <label>Organisation</label>
                  <input
                    type="text"
                    value={reg.org}
                    onChange={(e) => setReg({ ...reg, org: e.target.value })}
                    placeholder="Where do you work?"
                  />
                </div>
                <div className="field">
                  <label>Your HR level</label>
                  <select
                    value={reg.level}
                    onChange={(e) => setReg({ ...reg, level: e.target.value })}
                  >
                    <option value="">Select…</option>
                    <option>New to HR (0–2 years)</option>
                    <option>Developing (3–5 years)</option>
                    <option>Experienced (6–10 years)</option>
                    <option>Senior / Strategic (10+ years)</option>
                  </select>
                </div>

                <button
                  className="btn-full"
                  onClick={registerForWebinar}
                  disabled={registerMut.isPending}
                >
                  {registerMut.isPending
                    ? "Registering…"
                    : "Complete registration →"}
                </button>

                <div
                  className={`register-success${regSuccess ? " show" : ""}`}
                >
                  <div className="register-success-icon">🎉</div>
                  <div className="register-success-title">
                    You&apos;re registered!
                  </div>
                  <div className="register-success-body">
                    Check your email for the Zoom link. We will see you there.
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    fontSize: 12,
                    color: "var(--ink-4)",
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  All sessions are free for HR Playhouse Hub learners.
                  <br />
                  Zoom link sent after registration.
                </div>
              </div>
            </div>
          </div>
          {/* /wb-grid */}
        </div>
        {/* /wrap */}
      </main>

      {/* TOAST */}
      <div
        className={`toast${toast ? " show" : ""}${
          toast && toast.type ? " " + toast.type : ""
        }`}
      >
        {toast ? toast.msg : ""}
      </div>

      <Footer />
    </>
  );
}
