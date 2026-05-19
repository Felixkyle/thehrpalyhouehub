"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./webinar-booking.css";

/**
 * Webinar booking + editable session manager.
 *
 * Faithful port of webinar-booking.html. The original kept everything in a
 * large imperative script: sessions in `localStorage` ('hrph_webinars'),
 * `renderSessions()` building cards with `innerHTML`, an admin edit mode, an
 * add/edit modal, a toast, JSON export, and a mailto registration. All of that
 * is reproduced with React state while preserving exact behaviour: the same
 * storage key + default data, the same date/initials/`isPast` helpers, the
 * same validation + toast text, the same mailto subject/body, the same
 * registered-count increment + persist, the same export filename, the same
 * char-count thresholds and Escape-to-close.
 *
 * This page uses the standard marketing nav/footer, so the shared `<Nav />`
 * and `<Footer />` components are used. The gold "Edit Mode" admin bar sat
 * above the nav in the original and is kept there.
 */

const STORAGE_KEY = "hrph_webinars";

type Session = {
  id: string;
  type: string;
  free: boolean;
  title: string;
  date: string;
  time: string;
  platform: string;
  count: number;
  desc: string;
  speaker: string;
  speakerRole: string;
  link: string;
  recording: string;
};

/* ── DEFAULT SESSIONS (shown on first load) ─────────── */
const DEFAULT_SESSIONS: Session[] = [
  {
    id: "s1",
    type: "live",
    free: true,
    title:
      "From Compliance to Culture: Rethinking HR in African Organisations",
    date: "2026-05-15",
    time: "2:00 PM — 3:30 PM WAT",
    platform: "Zoom",
    count: 82,
    desc: "A frank conversation about why compliance-first HR is holding African organisations back — and what culture-led HR looks like in practice. Includes live Q&A and a case study from a Nigerian fintech.",
    speaker: "Dr. Marvellous Gberevbie",
    speakerRole: "Founder, HR Playhouse Hub",
    link: "",
    recording: "",
  },
  {
    id: "s2",
    type: "live",
    free: true,
    title:
      "Performance Management That Actually Works: Beyond the Annual Review",
    date: "2026-06-04",
    time: "11:00 AM — 12:30 PM WAT",
    platform: "Zoom",
    count: 54,
    desc: "Most performance management systems are broken. Covers continuous feedback models, OKRs in HR context, and how to have difficult performance conversations without destroying trust.",
    speaker: "Dr. Marvellous Gberevbie",
    speakerRole: "Founder, HR Playhouse Hub",
    link: "",
    recording: "",
  },
  {
    id: "s3",
    type: "live",
    free: true,
    title: "AI in HR: What to Embrace, What to Watch, and What to Push Back On",
    date: "2026-06-26",
    time: "2:00 PM — 3:00 PM WAT",
    platform: "Zoom",
    count: 117,
    desc: "AI is reshaping hiring, L&D, and people analytics. Cuts through the hype — what tools actually work, what the ethics look like from an African HR perspective, and how to build your own AI literacy.",
    speaker: "Dr. Marvellous Gberevbie",
    speakerRole: "Founder, HR Playhouse Hub",
    link: "",
    recording: "",
  },
  {
    id: "s4",
    type: "recorded",
    free: true,
    title: "HR Playhouse Hub: Platform Walkthrough & Q&A",
    date: "2026-03-01",
    time: "58 min",
    platform: "Zoom",
    count: 0,
    desc: "A complete walkthrough of the HR Playhouse Hub platform — all four levels, case study vault, games, and innovation lab. Includes 20-minute live Q&A.",
    speaker: "Dr. Marvellous Gberevbie",
    speakerRole: "Founder, HR Playhouse Hub",
    link: "",
    recording: "https://learn.thehrplayhousehub.org/webinar-library/",
  },
];

/* ── RENDER HELPERS ─────────────────────────────────── */
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function isPast(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr + "T23:59:00");
  return d < new Date();
}

const EMPTY_FORM = {
  type: "live",
  free: "yes",
  title: "",
  date: "",
  time: "",
  platform: "Zoom",
  count: "0",
  desc: "",
  speaker: "",
  speakerRole: "",
  link: "",
  recording: "",
};

type ModalForm = typeof EMPTY_FORM;

export default function WebinarBookingContent() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState<ModalForm>({ ...EMPTY_FORM });

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

  /* ── LOAD / PERSIST ─────────────────────────────────── */
  useEffect(() => {
    let loaded: Session[];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      loaded = saved
        ? JSON.parse(saved)
        : JSON.parse(JSON.stringify(DEFAULT_SESSIONS));
    } catch {
      loaded = JSON.parse(JSON.stringify(DEFAULT_SESSIONS));
    }
    setSessions(loaded);
  }, []);

  const persistSessions = useCallback((next: Session[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      showToast("Could not save — storage full or blocked", "warning");
    }
  }, []);

  function showToast(msg: string, type?: string) {
    setToast({ msg, type: type || "" });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  /* ── CLOSE MODAL ON ESC ─────────────────────────────── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const upcomingCount = sessions.filter(
    (s) => s.type !== "recorded" && !isPast(s.date),
  ).length;

  /* ── SELECT SESSION ─────────────────────────────────── */
  function selectSession(id: string) {
    if (editMode) return;
    const s = sessions.find((x) => x.id === id);
    if (!s) return;
    setSelectedId(id);
    setRegSuccess(false);
    if (formCardRef.current)
      formCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
  }

  /* ── REGISTER ───────────────────────────────────────── */
  function registerForWebinar() {
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
    const lname = reg.lname.trim();
    const org = reg.org.trim();
    const level = reg.level;
    const body =
      "Webinar Registration\n\nSession: " +
      s.title +
      "\nDate: " +
      formatDate(s.date) +
      (s.time ? " · " + s.time : "") +
      "\n\nName: " +
      fname +
      " " +
      lname +
      "\nEmail: " +
      email +
      (org ? "\nOrganisation: " + org : "") +
      (level ? "\nHR level: " + level : "") +
      (s.link ? "\n\nZoom link: " + s.link : "");
    window.location.href =
      "mailto:contact@thehrplayhousehub.org" +
      "?subject=" +
      encodeURIComponent("Webinar Registration — " + s.title) +
      "&body=" +
      encodeURIComponent(body);
    setRegSuccess(true);
    /* Increment registered count */
    const next = sessions.map((x) =>
      x.id === s.id ? { ...x, count: (x.count || 0) + 1 } : x,
    );
    setSessions(next);
    persistSessions(next);
  }

  /* ── EDIT MODE ──────────────────────────────────────── */
  function toggleEditMode() {
    const nextEdit = !editMode;
    setEditMode(nextEdit);
    setSelectedId(null);
    if (nextEdit) showToast("Edit mode on — add, edit or delete sessions");
  }

  function saveAndExit() {
    persistSessions(sessions);
    setEditMode(false);
    showToast("Sessions saved ✓", "success");
  }

  /* ── MODAL ──────────────────────────────────────────── */
  function openAddModal() {
    setEditingId(null);
    setModalForm({
      ...EMPTY_FORM,
      date: new Date().toISOString().split("T")[0],
      speaker: "Dr. Marvellous Gberevbie",
      speakerRole: "Founder, HR Playhouse Hub",
    });
    setModalOpen(true);
  }

  function openEditModal(idx: number) {
    const s = sessions[idx];
    setEditingId(s.id);
    setModalForm({
      type: s.type || "live",
      free: s.free ? "yes" : "no",
      title: s.title || "",
      date: s.date || "",
      time: s.time || "",
      platform: s.platform || "Zoom",
      count: String(s.count || 0),
      desc: s.desc || "",
      speaker: s.speaker || "",
      speakerRole: s.speakerRole || "",
      link: s.link || "",
      recording: s.recording || "",
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
  }

  function saveSession() {
    const title = modalForm.title.trim();
    const date = modalForm.date;
    const desc = modalForm.desc.trim();
    if (!title) {
      showToast("Please enter a session title", "warning");
      return;
    }
    if (!desc) {
      showToast("Please enter a description", "warning");
      return;
    }

    const sessionData: Session = {
      id: "",
      type: modalForm.type,
      free: modalForm.free === "yes",
      title: title,
      date: date,
      time: modalForm.time.trim(),
      platform: modalForm.platform,
      count: parseInt(modalForm.count) || 0,
      desc: desc,
      speaker: modalForm.speaker.trim(),
      speakerRole: modalForm.speakerRole.trim(),
      link: modalForm.link.trim(),
      recording: modalForm.recording.trim(),
    };

    let next: Session[];
    if (editingId) {
      sessionData.id = editingId;
      next = sessions.map((s) => (s.id === editingId ? sessionData : s));
    } else {
      sessionData.id = "s" + Date.now();
      next = [...sessions, sessionData];
    }

    setSessions(next);
    persistSessions(next);
    const wasEditing = editingId;
    closeModal();
    showToast(wasEditing ? "Session updated ✓" : "Session added ✓", "success");
  }

  /* ── DELETE / MOVE ──────────────────────────────────── */
  function deleteSession(idx: number) {
    if (
      !confirm('Delete "' + sessions[idx].title + '"? This cannot be undone.')
    )
      return;
    const next = sessions.filter((_, i) => i !== idx);
    setSessions(next);
    persistSessions(next);
    showToast("Session deleted");
  }

  function moveSession(idx: number, dir: number) {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= sessions.length) return;
    const next = [...sessions];
    const tmp = next[idx];
    next[idx] = next[newIdx];
    next[newIdx] = tmp;
    setSessions(next);
  }

  /* ── EXPORT ─────────────────────────────────────────── */
  function exportJSON() {
    const data = JSON.stringify(sessions, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      "hrph-webinars-" + new Date().toISOString().split("T")[0] + ".json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Sessions exported as JSON ✓", "success");
  }

  /* ── CHAR-COUNT COLOUR ──────────────────────────────── */
  function charCountColor(len: number, max: number) {
    return len > max * 0.9 ? "var(--accent)" : "var(--ink-4)";
  }

  const selectedSession = sessions.find((x) => x.id === selectedId);

  return (
    <>
      {/* ADMIN BANNER — visible when Edit Mode is on */}
      {editMode && (
        <div className="admin-bar">
          <div className="admin-bar-label">⚙️ Edit Mode</div>
          <div className="admin-bar-note">
            You can now add, edit, reorder and delete sessions. Changes are
            saved automatically in your browser.
          </div>
          <button
            className="admin-btn admin-btn-add"
            onClick={openAddModal}
          >
            ＋ Add Session
          </button>
          <button
            className="admin-btn admin-btn-save"
            onClick={saveAndExit}
          >
            ✓ Save &amp; Exit
          </button>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={exportJSON}
          >
            ⬇ Export data
          </button>
        </div>
      )}

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
                <div
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
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
                  <button
                    onClick={toggleEditMode}
                    style={{
                      height: 30,
                      padding: "0 14px",
                      borderRadius: 100,
                      border: "1.5px solid var(--border)",
                      background: "transparent",
                      color: "var(--ink-3)",
                      fontFamily: "var(--f-body)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: ".15s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "var(--navy)";
                      e.currentTarget.style.color = "var(--navy)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--ink-3)";
                    }}
                  >
                    {editMode ? "✕ Exit edit mode" : "⚙️ Manage sessions"}
                  </button>
                </div>
              </div>

              <div className={`wb-sessions${editMode ? " edit-mode" : ""}`}>
                {sessions.map((s, idx) => {
                  const past = s.type !== "recorded" && isPast(s.date);
                  const isRec = s.type === "recorded";
                  const isSel = s.id === selectedId && !editMode;

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

                  const clickable = !editMode && !isRec;

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
                        {s.free ? (
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
                        {s.date ? (
                          <span>📅 {formatDate(s.date)}</span>
                        ) : null}
                        {s.time ? <span>🕑 {s.time}</span> : null}
                        {s.platform ? <span>🎥 {s.platform}</span> : null}
                      </div>
                      <div className="session-desc">{s.desc}</div>
                      {s.speaker ? (
                        <div className="session-speaker">
                          <div className="speaker-av">
                            {getInitials(s.speaker)}
                          </div>
                          <span>
                            {s.speaker}
                            {s.speakerRole ? " · " + s.speakerRole : ""}
                          </span>
                        </div>
                      ) : null}

                      {editMode ? (
                        <div className="session-actions">
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              className="ec-btn ec-edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(idx);
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="ec-btn ec-del"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSession(idx);
                              }}
                            >
                              🗑 Delete
                            </button>
                          </div>
                          <div style={{ display: "flex", gap: 4 }}>
                            {idx > 0 ? (
                              <button
                                className="ec-btn ec-move"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveSession(idx, -1);
                                }}
                                title="Move up"
                              >
                                ↑
                              </button>
                            ) : null}
                            {idx < sessions.length - 1 ? (
                              <button
                                className="ec-btn ec-move"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveSession(idx, 1);
                                }}
                                title="Move down"
                              >
                                ↓
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ) : isRec && s.recording ? (
                        <div className="session-actions">
                          <a
                            className="register-btn"
                            style={{
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                            href={s.recording}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Watch recording →
                          </a>
                          {s.count ? (
                            <span className="session-count">
                              👥 {s.count} watched
                            </span>
                          ) : null}
                        </div>
                      ) : !past ? (
                        <div className="session-actions">
                          <button
                            className="register-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectSession(s.id);
                            }}
                          >
                            {isSel ? "Selected ✓" : "Register →"}
                          </button>
                          {s.count ? (
                            <span className="session-count">
                              👥 {s.count} registered
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {!sessions.length && (
                <div className="empty-state">
                  <div className="empty-state-icon">📅</div>
                  <div className="empty-state-title">No sessions yet</div>
                  <div className="empty-state-body">
                    Click &quot;Manage sessions&quot; then &quot;Add
                    Session&quot; to schedule your first webinar.
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
                      ? formatDate(selectedSession.date) +
                        (selectedSession.time
                          ? " · " + selectedSession.time
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
                    onChange={(e) =>
                      setReg({ ...reg, fname: e.target.value })
                    }
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
                    onChange={(e) =>
                      setReg({ ...reg, lname: e.target.value })
                    }
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
                    onChange={(e) =>
                      setReg({ ...reg, email: e.target.value })
                    }
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
                    onChange={(e) =>
                      setReg({ ...reg, level: e.target.value })
                    }
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
                >
                  Complete registration →
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

      {/* ADD / EDIT SESSION MODAL */}
      <div
        className={`modal-bg${modalOpen ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="modal">
          <div className="modal-header">
            <div className="modal-title">
              {editingId ? "Edit Session" : "Add New Session"}
            </div>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="field-row">
              <div className="field">
                <label>
                  Session type <span>*</span>
                </label>
                <select
                  value={modalForm.type}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, type: e.target.value })
                  }
                >
                  <option value="live">🔴 Live — Upcoming</option>
                  <option value="upcoming">🔵 Coming Soon</option>
                  <option value="recorded">📼 Recorded</option>
                </select>
              </div>
              <div className="field">
                <label>Free session?</label>
                <select
                  value={modalForm.free}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, free: e.target.value })
                  }
                >
                  <option value="yes">Yes — Free</option>
                  <option value="no">No — Paid</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>
                Session title <span>*</span>
              </label>
              <input
                type="text"
                value={modalForm.title}
                maxLength={120}
                onChange={(e) =>
                  setModalForm({
                    ...modalForm,
                    title: e.target.value.slice(0, 120),
                  })
                }
                placeholder="e.g. Performance Management That Actually Works"
              />
              <div
                className="char-count"
                style={{
                  color: charCountColor(modalForm.title.length, 120),
                }}
              >
                {modalForm.title.length} / 120
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>
                  Date <span>*</span>
                </label>
                <input
                  type="date"
                  value={modalForm.date}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, date: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>
                  Time (WAT) <span>*</span>
                </label>
                <input
                  type="text"
                  value={modalForm.time}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, time: e.target.value })
                  }
                  placeholder="e.g. 2:00 PM — 3:30 PM"
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Platform</label>
                <select
                  value={modalForm.platform}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, platform: e.target.value })
                  }
                >
                  <option>Zoom</option>
                  <option>Google Meet</option>
                  <option>Microsoft Teams</option>
                  <option>YouTube Live</option>
                  <option>In-person</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="field">
                <label>Registered attendees</label>
                <input
                  type="number"
                  value={modalForm.count}
                  min={0}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, count: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="field">
              <label>
                Description <span>*</span>
              </label>
              <textarea
                rows={3}
                value={modalForm.desc}
                maxLength={300}
                onChange={(e) =>
                  setModalForm({
                    ...modalForm,
                    desc: e.target.value.slice(0, 300),
                  })
                }
                placeholder="What will this session cover? Be specific — this is what gets people to register."
              />
              <div
                className="char-count"
                style={{ color: charCountColor(modalForm.desc.length, 300) }}
              >
                {modalForm.desc.length} / 300
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Speaker name</label>
                <input
                  type="text"
                  value={modalForm.speaker}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, speaker: e.target.value })
                  }
                  placeholder="e.g. Dr. Marvellous Gberevbie"
                />
              </div>
              <div className="field">
                <label>Speaker role</label>
                <input
                  type="text"
                  value={modalForm.speakerRole}
                  onChange={(e) =>
                    setModalForm({
                      ...modalForm,
                      speakerRole: e.target.value,
                    })
                  }
                  placeholder="e.g. Founder, HR Playhouse Hub"
                />
              </div>
            </div>

            <div className="field">
              <label>Zoom / Meeting link (optional)</label>
              <input
                type="url"
                value={modalForm.link}
                onChange={(e) =>
                  setModalForm({ ...modalForm, link: e.target.value })
                }
                placeholder="https://zoom.us/j/..."
              />
            </div>

            <div className="field">
              <label>Recording link (if already recorded)</label>
              <input
                type="url"
                value={modalForm.recording}
                onChange={(e) =>
                  setModalForm({ ...modalForm, recording: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-modal-save" onClick={saveSession}>
                Save session
              </button>
            </div>
          </div>
        </div>
      </div>

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
