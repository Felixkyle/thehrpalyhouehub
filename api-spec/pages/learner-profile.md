# Page — Learner Profile

**Frontend file:** `frontend/src/app/learner-profile/learner-profile-content.tsx`
**Page route:** `/learn/learner-profile`
**Auth required:** Yes

User account settings: personal info, password, notification prefs, privacy prefs, avatar, account deletion.

---

## What the page displays

Tabbed UI with 4 sections:

1. **Personal Info** — editable: first/last name, email, job title, organisation, country, LinkedIn URL, bio + avatar upload.
2. **Password** — current / new / confirm + password strength bar (5-point scale, client-side scoring).
3. **Notifications** — 6 toggles (see `NotificationPrefs` in data-models.md).
4. **Privacy** — 3 toggles (see `PrivacyPrefs`) + danger-zone delete account.

Sidebar always shows: avatar, display name, role + country, three quick stats.

---

## Endpoints

All endpoints for this page already live under auth/session:

- **Load page data:** `GET /api/users/me` + `GET /api/users/me/preferences` → see `auth/session.md`.
- **Save personal info:** `PATCH /api/users/me`.
- **Change password:** `POST /api/users/me/password`.
- **Upload avatar:** `POST /api/users/me/avatar` (multipart).
- **Save notification/privacy prefs:** `PATCH /api/users/me/preferences`.
- **Delete account:** `DELETE /api/users/me`.

Refer to [auth/session.md](../auth/session.md) for the full request/response schemas.

---

## Notes for backend

- The frontend currently has placeholder comments referencing `/wp-json/wp/v2/users/me` (WordPress prototype). Replace with the `/api/users/me` endpoints above.
- Avatar today is base64-stored in `localStorage` under key `hrph_profile_photo`. After backend ships, the frontend will:
  1. POST the file to `/api/users/me/avatar`.
  2. Store the returned URL in component state (not localStorage).
  3. Migrate any existing localStorage avatars by re-uploading on next visit.
- Country dropdown options used on this page: `Nigeria, UK, Ghana, Kenya, South Africa, Other`. The signup page has a wider list — the backend should accept any non-empty string and trust the frontend for option curation.
- The "Go to password reset →" link inside the Password tab points to the public `/password-reset` page (the email-link flow) — keep both flows available.
