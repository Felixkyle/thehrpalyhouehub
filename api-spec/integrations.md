# Third-Party Integrations

Endpoints in this spec rely on the backend wiring up these external services. Keep API keys in `backend/.env`, never in the frontend.

---

## Google Gemini — for `/api/ai/chat`

- **Used by:** AI Support page (`/learn/ai-support`).
- **Model:** latest Gemini Pro tier (e.g. `gemini-2.5-pro`). Env-configurable via `GEMINI_MODEL`.
- **Auth:** `GEMINI_API_KEY` env var. Get a key from https://aistudio.google.com/apikey.
- **SDK:** `@google/genai` (`npm install @google/genai`).
- **System prompt:** pass via Gemini's `systemInstruction` parameter. Owned by the backend, not the frontend.
- **Context caching:** enable on the system instruction once stable to reduce per-call cost.
- **File handling:** frontend sends base64-encoded PDF/DOC/DOCX as `document` blocks in the normalised shape; backend converts them to Gemini `inline_data` parts (`{ mime_type, data }`) inside the user's `parts` array.
- **Role mapping:** normalised `user` → Gemini `user`; normalised `assistant` → Gemini `model`.
- **Safety:** keep Gemini's default safety thresholds. If a response is blocked, return a friendly `502 AI_BLOCKED` to the frontend rather than the raw block reason.

See `pages/ai-support.md` for the full request/response shape.

---

## Email delivery — for transactional + form-submission emails

Today the frontend uses **EmailJS** from the browser plus `mailto:` fallbacks. The new backend should replace both with server-side email:

- **Recommended service:** Resend, Postmark, or SendGrid (whichever the team has access to).
- **From address:** `contact@thehrplayhousehub.org`.
- **Required transactional emails:**
  - Signup confirmation (with verification link)
  - Password reset link
  - Webinar registration confirmation
  - Forum reply notifications (if user has `lab_activity` pref on)
  - Course/level completion (if `completion_emails` pref on)
- **Required form-submission emails (to `contact@thehrplayhousehub.org`):**
  - Partner enquiry
  - CPD enquiry
  - Mentorship request
  - Resource submission

Each endpoint that triggers an email is noted in the page spec.

---

## Payments — Paystack (Nigerian market) + Stripe (global)

- **Used by:** Pricing page, ClockIQ paid tiers.
- **Paystack:** for NGN transactions (currently referenced for ClockIQ Growth tier at ₦15,000/mo).
- **Stripe:** for GBP/USD transactions (Pricing page Professional + Institutional tiers).
- **Status:** the frontend pricing page is currently marketing-only — no checkout is wired. When the backend adds checkout, add `pages/pricing.md` endpoints for: create checkout session, webhook handler, get subscription status.

---

## File storage — for avatars, resource downloads, certificates

- **Recommended:** S3-compatible storage (AWS S3, Cloudflare R2, or Supabase Storage).
- **Avatars:** uploaded via `POST /api/users/me/avatar`, max 3 MB, images only.
- **Generated certificates:** stored as PDF, served via signed URL.
- **Resource files:** docx/pptx/xlsx downloads — currently shipped as static files; can move to bucket later.

---

## JWT signing

- **Library:** `jsonwebtoken` (Node.js).
- **Secret:** `JWT_SECRET` env var. Minimum 32 random chars.
- **Algorithm:** HS256.
- **Claims:** `{ sub: user_id, email, iat, exp }`.
- **Expiry:** 7 days.

---

## Optional integrations (not blocking)

- **Zoom / Google Meet** — for webinar meeting link generation. Currently meeting links are entered manually in the admin panel. Future: auto-create Zoom meetings when an admin schedules a webinar.
- **LMS integration (Tutor LMS)** — the legacy WordPress prototype uses Tutor LMS for course progress. The new backend should own course progress natively; no Tutor integration needed.
