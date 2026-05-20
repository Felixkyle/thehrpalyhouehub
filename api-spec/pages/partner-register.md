# Page — Partner Register

**Frontend file:** `frontend/src/app/partner-register/partner-register-content.tsx`
**Page route:** `/partner-register`
**Auth required:** No (public)

A partnership enquiry form for organisations (HR bodies, universities, government agencies, corporations, NGOs, consulting firms) that want to integrate or co-deliver the programme.

---

## What the page displays

- Hero with 5 partnership track pills: CPD, Institutional, Academic, Consulting, Other.
- 5 track cards (one per pill) describing each model.
- Single enquiry form: first name*, last name*, job title*, organisation*, org type*, work email*, phone, country, partnership track*, description*, optional logo/document upload.
- URL param pre-selection: `?track=cpd|institutional|academic|consulting|other`.
- Success state on submit.

---

## Endpoints

### POST `/api/partnerships/enquiry`

Submits a partnership enquiry.

#### Request

`multipart/form-data` (because of the optional file). Fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| `first_name` | string | yes | |
| `last_name` | string | yes | |
| `job_title` | string | yes | |
| `organisation` | string | yes | |
| `org_type` | enum | yes | `hr_body | university | government | corporation | ngo | consulting | other` |
| `email` | string | yes | work email |
| `phone` | string | no | E.164-ish; don't strict-validate |
| `country` | string | no | |
| `track` | enum | yes | `cpd | institutional | academic | consulting | other` |
| `message` | string | yes | max 5000 chars |
| `attachment` | file | no | image/* or pdf/doc/docx; max 5 MB |

#### Response — 200 OK

```json
{ "ok": true }
```

Frontend shows the inline success state.

#### Side effects

- Send email to `contact@thehrplayhousehub.org` with subject `"Partnership Enquiry — {organisation}"` and all fields in the body. Attach the uploaded file if present.
- Store the enquiry in a `partnership_enquiries` table for CRM follow-up.

#### Errors

- `400 VALIDATION_ERROR`.
- `413 PAYLOAD_TOO_LARGE` — attachment > 5 MB.
- `429 RATE_LIMITED` — 5 submissions per IP per 15 minutes.

---

## Notes for backend

- The frontend currently uses EmailJS with a `mailto:` fallback. Replace both with this server endpoint.
- Allowed MIME types for attachment: `image/png`, `image/jpeg`, `image/gif`, `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
- Track values match the URL query param exactly.
