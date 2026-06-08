"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./learner-profile.css";

/**
 * Profile & settings.
 *
 * Faithful port of learner-profile.html. The original used inline `onclick` /
 * `oninput` handlers and id-based DOM mutation:
 *
 *  - `showTab()` toggled `.active` classes; now a `tab` state machine renders
 *    the matching section (the original CSS `.settings-section{display:none}`
 *    rule is dropped accordingly).
 *  - `savePersonal()` / `resetPersonal()` mutated the sidebar avatar/name and
 *    flashed a "saved" message; controlled inputs + derived state reproduce
 *    that exactly (3s auto-hide preserved).
 *  - `checkPwStrength()` drove a coloured strength bar; same scoring, same
 *    colour table, now state.
 *  - `changePassword()` validated and flashed "Password updated".
 *  - `savePrefs()` alert, `confirmDelete()` confirm + mailto.
 *  - `uploadAvatar()` read a file via FileReader and stored it in
 *    localStorage; an IIFE restored it on load. Same behaviour via a ref +
 *    state + a load-time useEffect.
 *
 * This page uses the standard marketing nav/footer, so the shared components
 * are used. The password-reset link maps to the local /password-reset route.
 */

type Tab = "personal" | "password" | "notifications" | "privacy";

const PW_COLORS = [
  "#E8ECF4",
  "#C9501E",
  "#C4830A",
  "#C4830A",
  "#1a7a4a",
  "#1a7a4a",
];

export default function LearnerProfileContent() {
  const [tab, setTab] = useState<Tab>("personal");

  // Personal info (controlled).
  const [fname, setFname] = useState("Ada");
  const [lname, setLname] = useState("Okonkwo");
  const [email, setEmail] = useState("ada.okonkwo@company.com");
  const [jobTitle, setJobTitle] = useState("HR Business Partner");
  const [org, setOrg] = useState("TechStart Nigeria");
  const [country, setCountry] = useState("Nigeria");
  const [linkedin, setLinkedin] = useState("");
  const [bio, setBio] = useState(
    "HR practitioner with 5 years of experience across recruitment, performance management and culture development in Lagos-based tech companies.",
  );

  // Sidebar (updated only on Save, like the original).
  const [displayName, setDisplayName] = useState("Ada Okonkwo");
  const [displayInit, setDisplayInit] = useState("AO");
  const [displayRole, setDisplayRole] = useState("HR Business Partner · Lagos");
  const [personalSaved, setPersonalSaved] = useState(false);

  // Password.
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwStrength, setPwStrength] = useState(0);
  const [pwSaved, setPwSaved] = useState(false);

  // Avatar.
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Restore the saved profile photo on load (original IIFE).
  useEffect(() => {
    const saved = localStorage.getItem("hrph_profile_photo");
    if (saved) setAvatarSrc(saved);
  }, []);

  function savePersonal() {
    const f = fname.trim();
    const l = lname.trim();
    if (f) setDisplayName(f + " " + l);
    setDisplayInit(
      (f[0] || l[0] || "?").toUpperCase() + (l[0] || "").toUpperCase(),
    );
    const t = jobTitle.trim();
    setDisplayRole((t || "HR Professional") + (country ? " · " + country : ""));
    setPersonalSaved(true);
    setTimeout(() => setPersonalSaved(false), 3000);
    /* Stephen: POST to /wp-json/wp/v2/users/me with updated meta */
  }

  function resetPersonal() {
    setFname("Ada");
    setLname("Okonkwo");
  }

  function checkPwStrength(pw: string) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    setPwStrength(score);
  }

  function changePassword() {
    if (!pwCurrent || !pwNew || !pwConfirm) {
      alert("Please fill in all password fields.");
      return;
    }
    if (pwNew.length < 8) {
      alert("New password must be at least 8 characters.");
      return;
    }
    if (pwNew !== pwConfirm) {
      alert("New passwords do not match.");
      return;
    }
    /* Stephen: POST to /wp-json/wp/v2/users/me with {password: nw} */
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
    setPwCurrent("");
    setPwNew("");
    setPwConfirm("");
    setPwStrength(0);
  }

  function savePrefs() {
    alert("Preferences saved.");
    /* Stephen: save toggle states to user meta via /wp-json/wp/v2/users/me */
  }

  function confirmDelete() {
    if (
      confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    ) {
      window.location.href =
        "mailto:contact@thehrplayhousehub.org?subject=Account Deletion Request&body=Please delete my HR Playhouse Hub account.";
    }
  }

  function uploadAvatar(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Photo must be under 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarSrc(result);
      localStorage.setItem("hrph_profile_photo", result);
    };
    reader.readAsDataURL(file);
  }

  const pwPct = Math.min(100, pwStrength * 20);
  const pwColor = PW_COLORS[pwStrength] || PW_COLORS[0];

  return (
    <>
      <Nav />
      <main>
        <div className="page-hero hero-navy" style={{ padding: 40 }}>
          <div className="eyebrow">Account</div>
          <h1
            className="page-title"
            style={{ fontSize: "clamp(26px,4vw,40px)" }}
          >
            Your Profile &amp; Settings
          </h1>
        </div>

        <div className="wrap">
          <div className="profile-layout">
            {/* SIDEBAR */}
            <aside className="profile-sidebar">
              <div className="card profile-avatar-wrap">
                <div
                  className="profile-avatar"
                  onClick={() => avatarInputRef.current?.click()}
                  title="Click to change photo"
                >
                  {avatarSrc && (
                    <img
                      src={avatarSrc}
                      alt="Profile photo"
                      style={{ display: "block" }}
                    />
                  )}
                  {!avatarSrc && <span>{displayInit}</span>}
                  <div className="profile-avatar-overlay">
                    <span style={{ color: "#fff", fontSize: 20 }}>📷</span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => uploadAvatar(e.target)}
                />
                <div className="profile-name">{displayName}</div>
                <div className="profile-role">{displayRole}</div>
                <div className="profile-stats">
                  <div className="pstat">
                    <div className="pstat-n">1</div>
                    <div className="pstat-l">Completed</div>
                  </div>
                  <div className="pstat">
                    <div className="pstat-n">75%</div>
                    <div className="pstat-l">Level 2</div>
                  </div>
                  <div className="pstat">
                    <div className="pstat-n">4</div>
                    <div className="pstat-l">Badges</div>
                  </div>
                </div>
                <div className="profile-nav">
                  <button
                    className={`pnav-item${tab === "personal" ? " active" : ""}`}
                    onClick={() => setTab("personal")}
                  >
                    <div className="pnav-icon">👤</div>Personal Info
                  </button>
                  <button
                    className={`pnav-item${tab === "password" ? " active" : ""}`}
                    onClick={() => setTab("password")}
                  >
                    <div className="pnav-icon">🔐</div>Password
                  </button>
                  <button
                    className={`pnav-item${
                      tab === "notifications" ? " active" : ""
                    }`}
                    onClick={() => setTab("notifications")}
                  >
                    <div className="pnav-icon">🔔</div>Notifications
                  </button>
                  <button
                    className={`pnav-item${tab === "privacy" ? " active" : ""}`}
                    onClick={() => setTab("privacy")}
                  >
                    <div className="pnav-icon">🛡️</div>Privacy
                  </button>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main>
              {/* PERSONAL INFO */}
              {tab === "personal" && (
                <div className="card settings-section active">
                  <div className="settings-header">
                    <div className="settings-title">Personal Information</div>
                    <div className="settings-sub">
                      Update your name, bio and professional details.
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label>
                        First name <span>*</span>
                      </label>
                      <input
                        type="text"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>
                        Last name <span>*</span>
                      </label>
                      <input
                        type="text"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label>
                      Email address <span>*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label>Job title</label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>Organisation</label>
                      <input
                        type="text"
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label>Country / Region</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option>Nigeria</option>
                        <option>United Kingdom</option>
                        <option>Ghana</option>
                        <option>Kenya</option>
                        <option>South Africa</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>LinkedIn profile (optional)</label>
                      <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/…"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label>Bio (optional)</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="A short professional bio — this may appear in community spaces like the Innovation Lab."
                    />
                  </div>
                  <div className="save-btn-row">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={resetPersonal}
                    >
                      Reset
                    </button>
                    <button
                      className="btn btn-accent btn-sm"
                      onClick={savePersonal}
                    >
                      Save changes
                    </button>
                  </div>
                  {personalSaved && (
                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 13,
                        color: "var(--green)",
                        fontWeight: 600,
                      }}
                    >
                      ✓ Changes saved
                    </div>
                  )}
                </div>
              )}

              {/* PASSWORD */}
              {tab === "password" && (
                <div className="card settings-section active">
                  <div className="settings-header">
                    <div className="settings-title">Change Password</div>
                    <div className="settings-sub">
                      Choose a strong password at least 8 characters long.
                    </div>
                  </div>
                  <div className="field">
                    <label>
                      Current password <span>*</span>
                    </label>
                    <input
                      type="password"
                      value={pwCurrent}
                      onChange={(e) => setPwCurrent(e.target.value)}
                      placeholder="Your current password"
                    />
                  </div>
                  <div className="field">
                    <label>
                      New password <span>*</span>
                    </label>
                    <input
                      type="password"
                      value={pwNew}
                      onChange={(e) => {
                        setPwNew(e.target.value);
                        checkPwStrength(e.target.value);
                      }}
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      background: "var(--mist)",
                      margin: "-10px 0 16px",
                      transition: ".3s",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: pwPct + "%",
                        borderRadius: 3,
                        transition: ".4s",
                        background: pwColor,
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>
                      Confirm new password <span>*</span>
                    </label>
                    <input
                      type="password"
                      value={pwConfirm}
                      onChange={(e) => setPwConfirm(e.target.value)}
                      placeholder="Repeat new password"
                    />
                  </div>
                  <div className="save-btn-row">
                    <button
                      className="btn btn-accent btn-sm"
                      onClick={changePassword}
                    >
                      Update password
                    </button>
                  </div>
                  {pwSaved && (
                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 13,
                        color: "var(--green)",
                        fontWeight: 600,
                      }}
                    >
                      ✓ Password updated
                    </div>
                  )}
                  <div className="danger-zone">
                    <div className="danger-title">Forgot your password?</div>
                    <div className="danger-body">
                      If you have forgotten your current password, sign out and
                      use the password reset option on the login page.
                    </div>
                    <Link
                      className="btn btn-outline btn-sm"
                      href="/password-reset"
                    >
                      Go to password reset →
                    </Link>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {tab === "notifications" && (
                <div className="card settings-section active">
                  <div className="settings-header">
                    <div className="settings-title">
                      Notification Preferences
                    </div>
                    <div className="settings-sub">
                      Choose what updates you receive from HR Playhouse Hub.
                    </div>
                  </div>
                  <div className="pref-row">
                    <div>
                      <div className="pref-label">
                        Course progress reminders
                      </div>
                      <div className="pref-desc">
                        Nudges when you haven&apos;t logged in for 7+ days
                      </div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <div className="toggle-slider" />
                    </label>
                  </div>
                  <div className="pref-row">
                    <div>
                      <div className="pref-label">Level completion emails</div>
                      <div className="pref-desc">
                        Celebration email + certificate when you finish a level
                      </div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <div className="toggle-slider" />
                    </label>
                  </div>
                  <div className="pref-row">
                    <div>
                      <div className="pref-label">Webinar announcements</div>
                      <div className="pref-desc">
                        Upcoming live sessions and recordings
                      </div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <div className="toggle-slider" />
                    </label>
                  </div>
                  <div className="pref-row">
                    <div>
                      <div className="pref-label">
                        New case studies &amp; content
                      </div>
                      <div className="pref-desc">
                        When new cases or playbook entries are added
                      </div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" />
                      <div className="toggle-slider" />
                    </label>
                  </div>
                  <div className="pref-row">
                    <div>
                      <div className="pref-label">Innovation Lab activity</div>
                      <div className="pref-desc">
                        Replies to your posts, new discussions in your topics
                      </div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <div className="toggle-slider" />
                    </label>
                  </div>
                  <div className="pref-row">
                    <div>
                      <div className="pref-label">
                        Platform updates &amp; news
                      </div>
                      <div className="pref-desc">
                        Major feature launches and programme announcements
                      </div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <div className="toggle-slider" />
                    </label>
                  </div>
                  <div className="save-btn-row">
                    <button
                      className="btn btn-accent btn-sm"
                      onClick={savePrefs}
                    >
                      Save preferences
                    </button>
                  </div>
                </div>
              )}

              {/* PRIVACY */}
              {tab === "privacy" && (
                <div className="card settings-section active">
                  <div className="settings-header">
                    <div className="settings-title">Privacy Settings</div>
                    <div className="settings-sub">
                      Control how your information is used and who can see your
                      activity.
                    </div>
                  </div>
                  <div className="pref-row">
                    <div>
                      <div className="pref-label">
                        Show profile in Innovation Lab
                      </div>
                      <div className="pref-desc">
                        Other learners can see your name and bio in the
                        community forum
                      </div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <div className="toggle-slider" />
                    </label>
                  </div>
                  <div className="pref-row">
                    <div>
                      <div className="pref-label">
                        Anonymous activity option
                      </div>
                      <div className="pref-desc">
                        Allow posting in the Innovation Lab without your name
                        showing
                      </div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" />
                      <div className="toggle-slider" />
                    </label>
                  </div>
                  <div className="pref-row">
                    <div>
                      <div className="pref-label">
                        Share progress with employer
                      </div>
                      <div className="pref-desc">
                        Allow HR Playhouse Hub to share your progress with your
                        registered organisation
                      </div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" />
                      <div className="toggle-slider" />
                    </label>
                  </div>
                  <div className="save-btn-row">
                    <button
                      className="btn btn-accent btn-sm"
                      onClick={savePrefs}
                    >
                      Save settings
                    </button>
                  </div>
                  <div className="danger-zone" style={{ marginTop: 28 }}>
                    <div className="danger-title">Delete account</div>
                    <div className="danger-body">
                      Permanently delete your account and all learning data.
                      This cannot be undone. Your certificates will no longer be
                      verifiable after deletion.
                    </div>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: "#fff0f0",
                        color: "var(--accent)",
                        border: "1.5px solid rgba(201,80,30,.3)",
                      }}
                      onClick={confirmDelete}
                    >
                      Request account deletion
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
