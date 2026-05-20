# Page — CPD Recognition

**Frontend file:** `frontend/src/app/cpd-recognition/cpd-recognition-content.tsx`
**Page route:** `/cpd-recognition`
**Auth required:** No (public marketing page)

---

## What the page displays

- Hero + 4 stats (mostly static: 4 levels, 32 case studies, ~30 CPD hours, 56 Commonwealth nations).
- 4 benefit cards (static content).
- 4-step partnership progress timeline (static state badges).
- An enquiry form at the bottom.

Everything except the enquiry form is static marketing content — no backend needed for those sections.

---

## Endpoints

### POST `/api/enquiries/cpd`

Sends a CPD partnership enquiry email to `contact@thehrplayhousehub.org`.

#### Request

```json
{
  "name": "Ada Okonkwo",
  "organisation": "CIPM Nigeria",
  "email": "ada@cipmnigeria.org",
  "message": "We're interested in formally recognising your programme for CPD hours..."
}
```

**Validation:**

- `name`, `organisation`, `email`: required.
- `email`: must match email regex.
- `message`: optional, max 5000 chars.

#### Response — 200 OK

```json
{ "ok": true }
```

Frontend shows the success message: _"✓ Thank you. We will be in touch within 2 working days."_

#### Side effects

- Send email to `contact@thehrplayhousehub.org` with subject `"CPD Partnership Enquiry — {organisation}"` and body containing all submitted fields.
- Optionally store the enquiry in a `cpd_enquiries` table for follow-up tracking.

#### Errors

- `400 VALIDATION_ERROR`.
- `429 RATE_LIMITED` — 5 submissions per IP per 15 minutes.

---

## Notes for backend

- The frontend currently opens a `mailto:` link as a stopgap. Once this endpoint exists, the frontend will switch to a real `fetch` and show the inline success state without leaving the page.
