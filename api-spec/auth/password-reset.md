# Auth — Password Reset

**Frontend file:** `frontend/src/app/password-reset/password-reset-content.tsx`
**Page route:** `/password-reset`
**Auth required:** No (public)

---

## Flow

The frontend shows a two-step UI:

1. User enters email → submits → success screen appears.
2. User clicks the reset link in their email → arrives on a "set new password" page (frontend page not yet built; backend must support both endpoints below).

---

## POST `/api/auth/password-reset/request`

Sends a password reset email if the address matches an account.

### Request

```json
{ "email": "ada@example.com" }
```

### Response — 200 OK

```json
{ "ok": true }
```

**Always return 200 OK regardless of whether the email exists** — this prevents account enumeration. Send the email only if the address matches a real user.

### Errors

- `400 VALIDATION_ERROR` — email missing or malformed.
- `429 RATE_LIMITED` — same IP requested >5 resets in 15 minutes.

### Side effects

- If email matches a user: generate a single-use reset token (random 32 bytes, hex-encoded), store it with a 1-hour expiry, and email a link of the form `https://app.thehrplayhousehub.org/password-reset/confirm?token=<token>`.

---

## POST `/api/auth/password-reset/confirm`

Consumes a reset token and sets the new password.

### Request

```json
{
  "token": "abc123...",
  "new_password": "min8chars"
}
```

### Response — 200 OK

```json
{ "ok": true }
```

After success, the frontend redirects to `/signup` (or a future `/login` page) for the user to sign back in. Don't auto-issue a new JWT — forcing fresh login is safer after a reset.

### Errors

- `400 VALIDATION_ERROR` — bad token format or password < 8 chars.
- `404 NOT_FOUND` — token doesn't exist, was already used, or expired. Use a generic message: `"This reset link is invalid or has expired."`

### Side effects

- Mark the token as used (or delete it) so it can't be replayed.
- Invalidate any existing JWTs for that user (rotate the user's signing version, or maintain a "tokens issued before X are invalid" timestamp). This logs out other sessions on password change.
