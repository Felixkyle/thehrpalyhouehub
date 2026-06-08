"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  useMe,
  usePreferences,
  useUpdateProfile,
  useChangePassword,
  useUploadAvatar,
  useUpdatePreferences,
} from "@/lib/hooks";
import { useAuth } from "@/lib/stores/auth";
import { ApiError } from "@/lib/api/client";
import type { NotificationPrefs, PrivacyPrefs } from "@/lib/api/types";
import "./learner-profile.css";

/**
 * Profile & settings.
 *
 * Wired to the real backend:
 *  - useMe() provides the User + UserStats used for the sidebar and to
 *    seed the Personal Info form.
 *  - useUpdateProfile() persists the Personal Info form (PATCH /users/me).
 *  - useChangePassword() drives the password form.
 *  - useUploadAvatar() handles the avatar picker (replaces the old
 *    localStorage/FileReader approach).
 *  - usePreferences()/useUpdatePreferences() back the Notifications and
 *    Privacy toggle tabs.
 *
 * Auth-gated: the queries are disabled until a token exists, so the page
 * shows a sign-in prompt when the user is not logged in and a spinner while
 * the profile loads.
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
  const token = useAuth((s) => s.token);
  const me = useMe();
  const prefsQuery = usePreferences();
  const updateProfile = useUpdateProfile();
  const changePasswordM = useChangePassword();
  const uploadAvatar = useUploadAvatar();
  const updatePrefs = useUpdatePreferences();

  const [tab, setTab] = useState<Tab>("personal");

  // Personal info (controlled). Seeded from useMe once loaded.
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [org, setOrg] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [linkedin, setLinkedin] = useState("");
  const [bio, setBio] = useState("");

  const [personalSaved, setPersonalSaved] = useState(false);
  const [personalError, setPersonalError] = useState<string | null>(null);

  // Password.
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwStrength, setPwStrength] = useState(0);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  // Avatar.
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Preferences (controlled toggles), seeded from usePreferences.
  const [notif, setNotif] = useState<NotificationPrefs | null>(null);
  const [privacy, setPrivacy] = useState<PrivacyPrefs | null>(null);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const user = me.data?.user;
  const stats = me.data?.stats;

  // Seed the personal-info form when the user loads (or changes).
  useEffect(() => {
    if (!user) return;
    setFname(user.first_name ?? "");
    setLname(user.last_name ?? "");
    setEmail(user.email ?? "");
    setJobTitle(user.job_title ?? "");
    setOrg(user.organisation ?? "");
    setCountry(user.country ?? "Nigeria");
    setLinkedin(user.linkedin_url ?? "");
    setBio(user.bio ?? "");
  }, [user]);

  // Seed preference toggles when they load.
  useEffect(() => {
    if (prefsQuery.data) {
      setNotif(prefsQuery.data.notifications);
      setPrivacy(prefsQuery.data.privacy);
    }
  }, [prefsQuery.data]);

  // Derived sidebar display values.
  const displayName =
    user?.display_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    "Your Profile";
  const displayInit =
    ((user?.first_name?.[0] || user?.last_name?.[0] || "?") +
      (user?.last_name?.[0] || "")).toUpperCase();
  const displayRole =
    (user?.job_title || "HR Professional") +
    (user?.country ? " · " + user.country : "");
  const avatarSrc = user?.avatar_url || null;

  async function savePersonal() {
    setPersonalError(null);
    setPersonalSaved(false);
    try {
      await updateProfile.mutateAsync({
        first_name: fname.trim(),
        last_name: lname.trim(),
        email: email.trim(),
        job_title: jobTitle.trim() || null,
        organisation: org.trim() || null,
        country: country || null,
        linkedin_url: linkedin.trim() || null,
        bio: bio.trim() || null,
      });
      setPersonalSaved(true);
      setTimeout(() => setPersonalSaved(false), 3000);
    } catch (err) {
      setPersonalError(
        err instanceof ApiError
          ? err.message
          : "Could not save changes. Please try again.",
      );
    }
  }

  function resetPersonal() {
    if (!user) return;
    setFname(user.first_name ?? "");
    setLname(user.last_name ?? "");
    setEmail(user.email ?? "");
    setJobTitle(user.job_title ?? "");
    setOrg(user.organisation ?? "");
    setCountry(user.country ?? "Nigeria");
    setLinkedin(user.linkedin_url ?? "");
    setBio(user.bio ?? "");
    setPersonalError(null);
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

  async function changePassword() {
    setPwError(null);
    setPwSaved(false);
    if (!pwCurrent || !pwNew || !pwConfirm) {
      setPwError("Please fill in all password fields.");
      return;
    }
    if (pwNew.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pwNew !== pwConfirm) {
      setPwError("New passwords do not match.");
      return;
    }
    try {
      await changePasswordM.mutateAsync({ current: pwCurrent, next: pwNew });
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 3000);
      setPwCurrent("");
      setPwNew("");
      setPwConfirm("");
      setPwStrength(0);
    } catch (err) {
      setPwError(
        err instanceof ApiError
          ? err.message
          : "Could not update password. Please try again.",
      );
    }
  }

  async function savePrefs() {
    if (!notif || !privacy) return;
    setPrefsSaved(false);
    try {
      await updatePrefs.mutateAsync({ notifications: notif, privacy });
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 3000);
    } catch {
      /* swallow — surfaced inline below via updatePrefs.isError */
    }
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

  function uploadAvatarFile(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Photo must be under 3MB.");
      return;
    }
    uploadAvatar.mutate(file);
  }

  function setNotifKey(key: keyof NotificationPrefs, value: boolean) {
    setNotif((prev) => (prev ? { ...prev, [key]: value } : prev));
  }
  function setPrivacyKey(key: keyof PrivacyPrefs, value: boolean) {
    setPrivacy((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  const pwPct = Math.min(100, pwStrength * 20);
  const pwColor = PW_COLORS[pwStrength] || PW_COLORS[0];

  // ── Auth gate ──────────────────────────────────────────────────────
  if (!token) {
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
            <div
              className="card"
              style={{ padding: 40, textAlign: "center", margin: "40px 0" }}
            >
              <div className="settings-title">Please sign in</div>
              <div className="settings-sub" style={{ marginBottom: 20 }}>
                You need to be signed in to view and manage your profile.
              </div>
              <Link className="btn btn-accent btn-sm" href="/login">
                Sign in
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Loading / error for the profile fetch ──────────────────────────
  if (me.isLoading) {
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
            <div
              className="card"
              style={{ padding: 40, textAlign: "center", margin: "40px 0" }}
            >
              <div className="settings-sub">Loading your profile…</div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (me.isError || !user) {
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
            <div
              className="card"
              style={{ padding: 40, textAlign: "center", margin: "40px 0" }}
            >
              <div className="settings-title">Couldn&apos;t load your profile</div>
              <div className="settings-sub" style={{ marginBottom: 20 }}>
                {me.error instanceof ApiError
                  ? me.error.message
                  : "Something went wrong. Please try again."}
              </div>
              <button
                className="btn btn-accent btn-sm"
                onClick={() => me.refetch()}
              >
                Retry
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
                    <span style={{ color: "#fff", fontSize: 20 }}>
                      {uploadAvatar.isPending ? "…" : "📷"}
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => uploadAvatarFile(e.target)}
                />
                <div className="profile-name">{displayName}</div>
                <div className="profile-role">{displayRole}</div>
                <div className="profile-stats">
                  <div className="pstat">
                    <div className="pstat-n">{stats?.levels_completed ?? 0}</div>
                    <div className="pstat-l">Completed</div>
                  </div>
                  <div className="pstat">
                    <div className="pstat-n">
                      {stats?.current_level_progress ?? 0}%
                    </div>
                    <div className="pstat-l">
                      Level {stats?.current_level ?? 1}
                    </div>
                  </div>
                  <div className="pstat">
                    <div className="pstat-n">{stats?.badges_earned ?? 0}</div>
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
                      disabled={updateProfile.isPending}
                    >
                      Reset
                    </button>
                    <button
                      className="btn btn-accent btn-sm"
                      onClick={savePersonal}
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                  {personalError && (
                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 13,
                        color: "var(--accent)",
                        fontWeight: 600,
                      }}
                    >
                      ⚠ {personalError}
                    </div>
                  )}
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
                      disabled={changePasswordM.isPending}
                    >
                      {changePasswordM.isPending
                        ? "Updating…"
                        : "Update password"}
                    </button>
                  </div>
                  {pwError && (
                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 13,
                        color: "var(--accent)",
                        fontWeight: 600,
                      }}
                    >
                      ⚠ {pwError}
                    </div>
                  )}
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
                  {prefsQuery.isLoading || !notif ? (
                    <div className="settings-sub">Loading preferences…</div>
                  ) : (
                    <>
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
                          <input
                            type="checkbox"
                            checked={notif.course_reminders}
                            onChange={(e) =>
                              setNotifKey("course_reminders", e.target.checked)
                            }
                          />
                          <div className="toggle-slider" />
                        </label>
                      </div>
                      <div className="pref-row">
                        <div>
                          <div className="pref-label">
                            Level completion emails
                          </div>
                          <div className="pref-desc">
                            Celebration email + certificate when you finish a
                            level
                          </div>
                        </div>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={notif.completion_emails}
                            onChange={(e) =>
                              setNotifKey("completion_emails", e.target.checked)
                            }
                          />
                          <div className="toggle-slider" />
                        </label>
                      </div>
                      <div className="pref-row">
                        <div>
                          <div className="pref-label">
                            Webinar announcements
                          </div>
                          <div className="pref-desc">
                            Upcoming live sessions and recordings
                          </div>
                        </div>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={notif.webinar_announcements}
                            onChange={(e) =>
                              setNotifKey(
                                "webinar_announcements",
                                e.target.checked,
                              )
                            }
                          />
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
                          <input
                            type="checkbox"
                            checked={notif.new_content_emails}
                            onChange={(e) =>
                              setNotifKey("new_content_emails", e.target.checked)
                            }
                          />
                          <div className="toggle-slider" />
                        </label>
                      </div>
                      <div className="pref-row">
                        <div>
                          <div className="pref-label">
                            Innovation Lab activity
                          </div>
                          <div className="pref-desc">
                            Replies to your posts, new discussions in your topics
                          </div>
                        </div>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={notif.lab_activity}
                            onChange={(e) =>
                              setNotifKey("lab_activity", e.target.checked)
                            }
                          />
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
                          <input
                            type="checkbox"
                            checked={notif.platform_updates}
                            onChange={(e) =>
                              setNotifKey("platform_updates", e.target.checked)
                            }
                          />
                          <div className="toggle-slider" />
                        </label>
                      </div>
                      <div className="save-btn-row">
                        <button
                          className="btn btn-accent btn-sm"
                          onClick={savePrefs}
                          disabled={updatePrefs.isPending}
                        >
                          {updatePrefs.isPending
                            ? "Saving…"
                            : "Save preferences"}
                        </button>
                      </div>
                      {updatePrefs.isError && (
                        <div
                          style={{
                            marginTop: 12,
                            fontSize: 13,
                            color: "var(--accent)",
                            fontWeight: 600,
                          }}
                        >
                          ⚠ Could not save preferences. Please try again.
                        </div>
                      )}
                      {prefsSaved && (
                        <div
                          style={{
                            marginTop: 12,
                            fontSize: 13,
                            color: "var(--green)",
                            fontWeight: 600,
                          }}
                        >
                          ✓ Preferences saved
                        </div>
                      )}
                    </>
                  )}
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
                  {prefsQuery.isLoading || !privacy ? (
                    <div className="settings-sub">Loading settings…</div>
                  ) : (
                    <>
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
                          <input
                            type="checkbox"
                            checked={privacy.show_profile_in_lab}
                            onChange={(e) =>
                              setPrivacyKey(
                                "show_profile_in_lab",
                                e.target.checked,
                              )
                            }
                          />
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
                          <input
                            type="checkbox"
                            checked={privacy.anonymous_posts}
                            onChange={(e) =>
                              setPrivacyKey("anonymous_posts", e.target.checked)
                            }
                          />
                          <div className="toggle-slider" />
                        </label>
                      </div>
                      <div className="pref-row">
                        <div>
                          <div className="pref-label">
                            Share progress with employer
                          </div>
                          <div className="pref-desc">
                            Allow HR Playhouse Hub to share your progress with
                            your registered organisation
                          </div>
                        </div>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={privacy.share_progress_with_employer}
                            onChange={(e) =>
                              setPrivacyKey(
                                "share_progress_with_employer",
                                e.target.checked,
                              )
                            }
                          />
                          <div className="toggle-slider" />
                        </label>
                      </div>
                      <div className="save-btn-row">
                        <button
                          className="btn btn-accent btn-sm"
                          onClick={savePrefs}
                          disabled={updatePrefs.isPending}
                        >
                          {updatePrefs.isPending ? "Saving…" : "Save settings"}
                        </button>
                      </div>
                      {updatePrefs.isError && (
                        <div
                          style={{
                            marginTop: 12,
                            fontSize: 13,
                            color: "var(--accent)",
                            fontWeight: 600,
                          }}
                        >
                          ⚠ Could not save settings. Please try again.
                        </div>
                      )}
                      {prefsSaved && (
                        <div
                          style={{
                            marginTop: 12,
                            fontSize: 13,
                            color: "var(--green)",
                            fontWeight: 600,
                          }}
                        >
                          ✓ Settings saved
                        </div>
                      )}
                    </>
                  )}
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
