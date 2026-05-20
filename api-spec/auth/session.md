# Auth — Session / Current User

These endpoints serve the logged-in user's own profile and session.

**Frontend files referencing these:**
- `frontend/src/app/learner-profile/learner-profile-content.tsx`
- `frontend/src/app/dashboard/dashboard-content.tsx`
- `frontend/src/app/my-courses/my-courses-content.tsx`

**Auth required:** Yes (Bearer token)

---

## GET `/api/users/me`

Returns the authenticated user's profile + stats. Called on every authenticated page load to populate sidebars and headers.

### Response — 200 OK

```json
{
  "user": { /* User, see data-models.md */ },
  "stats": { /* UserStats, see data-models.md */ }
}
```

### Errors

- `401 UNAUTHENTICATED` — missing/invalid token → frontend clears token and redirects to `/signup`.

---

## PATCH `/api/users/me`

Updates the editable profile fields. Used by the Personal Info tab on `/learner-profile`.

### Request

All fields optional; only present fields are updated.

```json
{
  "first_name": "Ada",
  "last_name": "Okonkwo",
  "email": "ada@example.com",
  "job_title": "HR Business Partner",
  "organisation": "TechStart Nigeria",
  "country": "Nigeria",
  "linkedin_url": "https://linkedin.com/in/ada",
  "bio": "..."
}
```

**Validation:**

- `email`: if changed, must be unique → `409 CONFLICT` on duplicate.
- `linkedin_url`: if present, must start with `https://`.
- `bio`: max 1000 chars.

### Response — 200 OK

Returns the updated `User` object.

### Errors

- `400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `409 CONFLICT` (duplicate email).

---

## POST `/api/users/me/password`

Changes the authenticated user's password (in-app, while logged in — separate from the public reset flow).

### Request

```json
{
  "current_password": "...",
  "new_password": "min8chars"
}
```

### Response — 200 OK

```json
{ "ok": true }
```

After success, the existing token remains valid (user is still in their session). Frontend just clears the form.

### Errors

- `400 VALIDATION_ERROR` — `new_password` < 8 chars, or `new_password` matches `current_password`.
- `401 UNAUTHENTICATED` — `current_password` is wrong → `fields.current_password = "Current password is incorrect"`.

---

## POST `/api/users/me/avatar`

Uploads a new profile photo.

### Request

`multipart/form-data` with a single `file` field.

**Validation:**

- Max size: **3 MB**.
- MIME type: `image/jpeg`, `image/png`, `image/webp`.

### Response — 200 OK

```json
{ "avatar_url": "https://cdn.example.com/avatars/abc.jpg" }
```

The frontend updates the `User.avatar_url` field. Today the frontend stores avatars in `localStorage` as base64 — once this endpoint exists, remove that fallback.

### Errors

- `413 PAYLOAD_TOO_LARGE`, `400 VALIDATION_ERROR` (wrong MIME).

---

## GET `/api/users/me/preferences`

Returns notification + privacy preferences for the Notifications and Privacy tabs.

### Response — 200 OK

```json
{
  "notifications": { /* NotificationPrefs */ },
  "privacy": { /* PrivacyPrefs */ }
}
```

Defaults (for new accounts): all notifications `true` except `new_content_emails`. Privacy: `show_profile_in_lab=true`, others `false`.

---

## PATCH `/api/users/me/preferences`

Updates either or both preference blocks. All sub-fields optional.

### Request

```json
{
  "notifications": { "webinar_announcements": false },
  "privacy": { "anonymous_posts": true }
}
```

### Response — 200 OK

Returns the updated full preferences object (same shape as GET response).

---

## DELETE `/api/users/me`

Marks the account for deletion. Today the frontend opens a `mailto:` to request manual deletion — replace with this endpoint.

### Request

No body.

### Response — 202 Accepted

```json
{ "ok": true, "deletion_scheduled_for": "2026-06-18T00:00:00Z" }
```

### Side effects

- Soft-delete: mark `deleted_at = now()`, schedule hard delete after 30 days.
- Immediately invalidate all JWTs for the user.
- Send confirmation email with instructions to cancel within 30 days.

### Errors

- `401 UNAUTHENTICATED`.
