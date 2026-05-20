# Page — Email Sender (Admin Tool)

**Frontend file:** `frontend/src/app/email-sender/email-sender-content.tsx`
**Page route:** `/email-sender`
**Auth required:** Admin only

An internal admin tool for sending templated emails (announcements, completion congratulations, nudges, programme intros) to learners. Today it's a password-gated client-side tool that opens `mailto:` links.

---

## What the page displays

- Password gate (SHA-256 hashed password compared client-side).
- 4 template selectors: `announce | complete | nudge | programme`.
- Recipient form: first name*, last name, email*, conditional level dropdown (complete template), conditional progress state (nudge template), personal note.
- Live preview pane.
- Buttons: send via mail client (`mailto:`), copy email text, print preview.
- Sent log (in-memory).

---

## Endpoints

### POST `/api/admin/email-sender/send`

Sends the templated email through the backend mail service (replacing the `mailto:` flow).

#### Request

```json
{
  "template": "complete",
  "recipient": {
    "first_name": "Ada",
    "last_name": "Okonkwo",
    "email": "ada@example.com"
  },
  "context": {
    "level": 2,
    "progress_state": null,
    "personal_note": "Great work this month!"
  }
}
```

**Validation:**

- `template`: one of `announce | complete | nudge | programme`.
- `level`: required when `template === "complete"`, integer 1–4.
- `progress_state`: required when `template === "nudge"`, one of the 6 enum values (e.g. `early-level-1`, `stuck-on-case-study` — exact list lives in the frontend lines 85–95).

#### Response — 200 OK

```json
{
  "ok": true,
  "sent_at": "2026-05-20T14:30:00Z",
  "message_id": "..."
}
```

#### Side effects

- Send the email via the backend mail provider.
- Log to a `sent_emails` table: who sent it (admin user), template, recipient, timestamp.

#### Errors

- `400 VALIDATION_ERROR`.
- `403 FORBIDDEN` — caller isn't admin.
- `502 BAD_GATEWAY` — mail provider failed.

---

### GET `/api/admin/email-sender/log`

Server-side sent log (replaces the in-memory client log).

#### Query

- `limit`, `offset` — pagination.

#### Response — 200 OK

```json
{
  "data": [
    {
      "id": "...",
      "template": "complete",
      "recipient_email": "ada@example.com",
      "recipient_name": "Ada Okonkwo",
      "sent_by": "admin@thehrplayhousehub.org",
      "sent_at": "2026-05-20T14:30:00Z"
    }
  ],
  "pagination": { "total": 142, "limit": 20, "offset": 0 }
}
```

---

## Notes for backend

- **Replace the SHA-256 password gate with real admin RBAC.** Today the password is hardcoded in the frontend as a SHA-256 hash (`6d3b76d3...`). That's not security — anyone reading the source can recompute the original. The backend `/api/admin/*` endpoints must check the JWT's user role.
- Template strings (subject + body for each of the 4 templates) currently live in the frontend. Move them to the backend so non-engineers can edit them without redeploying. Either as DB rows or as a versioned config file.
- "Print preview" stays client-side — no endpoint needed.
- The `Level` and `ProgressState` enums are referenced from the frontend; capture the full enum values into the backend types module when implementing.
