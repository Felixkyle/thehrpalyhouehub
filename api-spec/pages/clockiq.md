# Page — ClockIQ

**Frontend file:** `frontend/src/app/clockiq/clockiq-content.tsx`
**Page route:** `/learn/clockiq`
**Auth required:** No (marketing page)

---

## What the page displays

- Product marketing for ClockIQ (a separate attendance/payroll product the team also runs).
- Feature list, pricing tiers (Starter / Growth / Enterprise), mock dashboard preview.

---

## Endpoints

### Status: no backend needed

ClockIQ is a **separate product** hosted externally at `https://thehrplayhousehub-clockiq.netlify.app/`. All CTAs on this page either:

- Link to the external Netlify app, or
- Open a `mailto:` for enterprise / demo requests.

If the team eventually wants to gate the external Netlify app behind the HR Playhouse Hub login (single sign-on), that's a separate integration project with its own spec.

If we want to surface demo requests as tracked enquiries instead of `mailto:`:

### POST `/api/enquiries/clockiq` _(optional)_

```json
{
  "name": "...",
  "email": "...",
  "organisation": "...",
  "team_size": "10-50",
  "message": "..."
}
```

Response: `{ "ok": true }`. Side effect: email + DB record. Skip until needed.
