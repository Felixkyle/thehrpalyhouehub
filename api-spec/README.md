# API Specification — thehrplayhouseplay

This folder is the **contract** between the Next.js frontend (`/frontend`) and the Express backend (`/backend`). Every page in the frontend that needs server data has a matching `.md` file here describing the endpoints it expects.

## Who this is for

- **Backend agent / developers** — build endpoints to match these specs exactly. Field names, types, and HTTP verbs are authoritative.
- **Frontend developers** — when adding a new page or API call, add or update the matching spec file in the same PR.

## Folder layout

```
api-spec/
├── README.md                       ← you are here
├── conventions.md                  ← global rules: auth, errors, dates, IDs, pagination
├── data-models.md                  ← shared types (User, Course, Certificate, etc.)
├── auth/
│   ├── signup.md
│   ├── password-reset.md
│   └── session.md
├── pages/
│   ├── dashboard.md
│   ├── my-courses.md
│   ├── progress-report.md
│   ├── learner-profile.md
│   ├── certificate-verify.md
│   ├── cpd-recognition.md
│   ├── ai-support.md
│   ├── case-study-vault.md
│   ├── playbook.md
│   ├── resources.md
│   ├── webinar-booking.md
│   ├── innovation-lab.md
│   ├── partner-register.md
│   ├── pricing.md
│   ├── clockiq.md
│   └── email-sender.md
└── integrations.md                 ← third-party hooks (EmailJS, Paystack, Claude API, etc.)
```

## How to read a page spec

Each `pages/*.md` file has these sections in order:

1. **Frontend file** — the `*-content.tsx` it maps to.
2. **Auth requirement** — public / authenticated / admin.
3. **Endpoints** — list of HTTP routes with method, path, request schema, response schema, errors.
4. **Data displayed** — what the page renders, so backend knows what to return.
5. **Open questions** — anything ambiguous the frontend can't answer.

## Conventions in one line

- **Base URL:** `${API_BASE}` — set via `NEXT_PUBLIC_API_BASE` env var on the frontend, defaults to `http://localhost:4000`. Today the frontend code references `/wp-json/...` paths (legacy from a WordPress prototype) — **the new Express backend should expose `/api/...` paths and the frontend will be updated to match.**
- **Auth:** JWT in `Authorization: Bearer <token>` header. Token stored in `localStorage.hrph_token`.
- **Content type:** `application/json` for everything except file uploads (`multipart/form-data`).
- **Errors:** see `conventions.md`.

See `conventions.md` for the full set.

## Build order suggestion (for the backend agent)

1. `conventions.md` + `data-models.md` — read first.
2. `auth/*` — signup, login (implicit), password reset. Nothing else works without these.
3. `pages/dashboard.md`, `pages/my-courses.md`, `pages/learner-profile.md`, `pages/progress-report.md` — the authenticated learner experience.
4. `pages/certificate-verify.md` — public, simple.
5. `pages/ai-support.md` — Claude API proxy.
6. `pages/innovation-lab.md`, `pages/webinar-booking.md` — community + events.
7. Everything else (forms that today only send mailto: can become real backend submissions).
