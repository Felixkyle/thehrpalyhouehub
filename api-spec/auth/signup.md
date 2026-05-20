# Auth — Signup

**Frontend file:** `frontend/src/app/signup/signup-content.tsx`
**Page route:** `/signup`
**Auth required:** No (public)

---

## POST `/api/auth/signup`

Creates a new user account. On success, returns a JWT and the user object so the frontend can immediately set the session.

### Request

```json
{
  "first_name": "Ada",
  "last_name": "Okonkwo",
  "email": "ada@example.com",
  "password": "min8chars",
  "role": "HR Business Partner",
  "country": "Nigeria",
  "how_heard": "Social media",
  "consent_accepted": true
}
```

**Validation:**

- `first_name`, `last_name`: required, 1–100 chars, trimmed.
- `email`: required, matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- `password`: required, min 8 chars.
- `role`: required. One of: `"Early-Career HR Professional" | "HR Generalist / Advisor" | "HR Business Partner" | "HR Manager" | "HR Director / CHRO" | "People Operations" | "Manager with HR responsibilities" | "Student / Career Changer" | "HR Consultant"`.
- `country`: optional. One of: `"UK" | "Nigeria" | "USA" | "Singapore" | "Ghana" | "Kenya" | "South Africa" | "Canada" | "Australia" | "India" | "Hong Kong" | "Other"`.
- `how_heard`: optional. One of: `"Social media" | "Word of mouth" | "Google search" | "Professional network" | "CIPD / SHRM community" | "Other"`.
- `consent_accepted`: required, must be `true`.

### Response — 201 Created

```json
{
  "token": "eyJhbGc...",
  "expires_at": "2026-05-26T14:30:00Z",
  "user": { /* User, see data-models.md */ }
}
```

### Errors

- `409 CONFLICT` — email already registered (`fields.email = "An account with this email already exists"`).
- `400 VALIDATION_ERROR` — any field validation failure.

### Side effects

- Send a **welcome / verification email** to the registered address. The frontend success screen says: _"Your account details have been received… check your email."_
- Record `consent_accepted_at = now()`.

### Notes for backend

- The frontend currently submits via EmailJS as a stopgap; replace that flow entirely with this endpoint.
- The success screen has a link to `/register-2/` — that page does not exist in the new frontend yet. For now, after signup the frontend will redirect to `/dashboard`.
- Email verification is **not** blocking — the user can use the app immediately, but mark `email_verified=false` on the User record so we can enforce verification later if needed.

---

## POST `/api/auth/login`

Not present on a dedicated page in the current frontend, but required for the JWT flow to work end-to-end (token expiry, returning users). Build it alongside signup.

### Request

```json
{ "email": "ada@example.com", "password": "..." }
```

### Response — 200 OK

Same shape as signup response (`token`, `expires_at`, `user`).

### Errors

- `401 UNAUTHENTICATED` — bad email or password. Use a single message (`"Invalid email or password"`) — don't reveal which field was wrong.
- `429 RATE_LIMITED` — after 5 failed attempts in 15 minutes per IP.
