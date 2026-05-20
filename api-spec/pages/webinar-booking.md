# Page — Webinar Booking

**Frontend file:** `frontend/src/app/webinar-booking/webinar-booking-content.tsx`
**Page route:** `/webinar-booking`
**Auth required:** Yes (for registration); session list is also visible without auth (TBD — see open questions).

---

## What the page displays

- List of webinar sessions (live, upcoming, recorded). Each card: title, date/time, platform, speaker, registered count, description.
- Click a card → scrolls to registration form pre-filled with that session.
- Registration form: first name*, last name*, email*, organisation, HR level dropdown.
- Recording link visible on `type=recorded` sessions.
- Admin mode (toggled by hidden "Manage sessions" button): add/edit/delete sessions, reorder, export JSON.

---

## Endpoints

### GET `/api/webinars`

Lists all sessions, newest scheduled first.

#### Query (optional)

- `type` — `live | recorded | upcoming` filter.
- `include_past` — default `false`.

#### Response — 200 OK

```json
{ "webinars": [ /* WebinarSession[] — see data-models.md */ ] }
```

For authenticated users, each item includes `is_registered: boolean`. For unauthenticated (if we expose this publicly), omit that field.

---

### POST `/api/webinars/:id/register`

Registers the authenticated user for a session.

#### Request

```json
{
  "first_name": "Ada",
  "last_name": "Okonkwo",
  "email": "ada@example.com",
  "organisation": "TechStart Nigeria",
  "hr_level": "HR Business Partner"
}
```

Fields beyond `id` are optional if the user already has them on their profile — the backend should fall back to `User` data. The frontend still collects them in case the user wants to register with a different email.

#### Response — 200 OK

```json
{
  "ok": true,
  "webinar": { /* WebinarSession with is_registered=true, meeting_link populated */ }
}
```

#### Side effects

- Send confirmation email with the calendar invite and meeting link.
- Increment `registered_count`.

#### Errors

- `400 VALIDATION_ERROR`.
- `404 NOT_FOUND`.
- `409 CONFLICT` — already registered.

---

### DELETE `/api/webinars/:id/register`

Unregister.

#### Response — 200 OK

```json
{ "ok": true }
```

---

## Admin endpoints

Gated behind admin role (RBAC TBD — for v1, treat any user with `is_admin=true` flag as admin).

### POST `/api/admin/webinars`

Create a new session. Body: full `WebinarSession` minus `id` and `registered_count`.

### PATCH `/api/admin/webinars/:id`

Update a session. Body: partial `WebinarSession`.

### DELETE `/api/admin/webinars/:id`

Delete.

### POST `/api/admin/webinars/:id/reorder`

Body: `{ "direction": "up" | "down" }` — or move to absolute position via PATCH with an `order` field.

### GET `/api/admin/webinars/export`

Returns the full session list as JSON for backup (replaces the current localStorage export).

---

## Notes for backend

- Sessions today live in `localStorage` under `hrph_webinars` — a stub. Migrate to a real DB table.
- Frontend "register" currently opens a `mailto:` — replace with the real endpoint above.
- Admin panel auth: today there's no real gate. Backend must enforce admin role on all `/api/admin/*` routes.
- The "Move Up / Down" UI implies sessions have an explicit display order; backend should expose an `order` integer.
