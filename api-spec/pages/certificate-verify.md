# Page — Certificate Verify

**Frontend file:** `frontend/src/app/certificate-verify/certificate-verify-content.tsx`
**Page route:** `/certificate-verify`
**Auth required:** No (public — designed for employers to verify a learner's certificate)

---

## What the page displays

- Text input for a certificate ID (format: `HRPH-2026-L1-00142`).
- "Verify →" button.
- On valid: green badge + full certificate preview (learner name, level, course, description, issue date, signer, certificate ID).
- On invalid: red "Certificate not found" card.
- Footer with 3-step "how it works" explainer.

---

## Endpoints

### GET `/api/certificates/verify`

Looks up a certificate by its human-readable ID. No auth.

#### Query

```
GET /api/certificates/verify?id=HRPH-2026-L1-00142
```

#### Response — 200 OK (found)

```json
{
  "valid": true,
  "certificate": {
    "id": "HRPH-2026-L1-00142",
    "learner_name": "Ada Okonkwo",
    "level": 1,
    "course_name": "Foundations of HR",
    "description": "...",
    "badge_emoji": "🥇",
    "issued_at": "2026-03-12T00:00:00Z",
    "signer_name": "Dr. Marvellous Gberevbie",
    "signer_role": "Programme Director"
  }
}
```

This is a **privacy-minimal subset** of the full `Certificate` type — no user_id, no PDF URL, no signed asset links. Verification is meant to confirm authenticity, not leak account data.

#### Response — 200 OK (not found)

```json
{ "valid": false }
```

Return 200 (not 404) — the lookup itself succeeded; the cert just doesn't exist. Frontend uses the `valid` field to switch UI state.

#### Errors

- `400 VALIDATION_ERROR` — `id` missing or doesn't match the format `HRPH-YYYY-L[1-4]-NNNNN` or `HRPH-YYYY-FULL-NNNNN`.
- `429 RATE_LIMITED` — protect against scraping; 60 verifications per IP per minute is a reasonable cap.

---

## Notes for backend

- Rate-limit aggressively — this endpoint is public and would otherwise let someone enumerate the certificate space.
- Certificate IDs are auto-issued sequentially per (year, level) — don't include user IDs in them.
- The frontend currently has a hardcoded `DEMO_CERTS` lookup table; that's a stub. Once this endpoint ships, remove the demo table.
