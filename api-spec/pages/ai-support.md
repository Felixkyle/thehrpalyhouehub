# Page — AI Support

**Frontend file:** `frontend/src/app/ai-support/ai-support-content.tsx`
**Page route:** `/ai-support`
**Auth required:** Yes

Chat interface backed by **Google Gemini**. The user asks HR questions, optionally attaches a document (policy, contract, job spec) for the assistant to reference.

---

## What the page displays

- Welcome state with 6 suggested starter questions.
- Message thread (user + assistant bubbles, with file chips on user messages that included attachments).
- Typing indicator while waiting on a response.
- Input area: textarea + file upload (PDF / DOC / DOCX / TXT, max 10 MB) + send button.
- "New chat" button (resets the conversation client-side).

---

## Endpoints

### POST `/api/ai/chat`

Proxy to the Gemini API. The backend owns the API key and the system prompt; the frontend only sends user-supplied content.

#### Request

The frontend sends a normalised, provider-neutral shape — the backend translates it to Gemini's request format.

```json
{
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Help me handle a difficult conversation." },
        {
          "type": "document",
          "source": {
            "type": "base64",
            "media_type": "application/pdf",
            "data": "JVBERi0xLjQK..."
          },
          "title": "performance-review.pdf"
        }
      ]
    },
    { "role": "assistant", "content": "Sure — what's the context?" }
  ]
}
```

**Notes:**

- `messages` is the full conversation so far (the frontend keeps history). Backend must NOT trust this list blindly — cap total tokens, cap message count (e.g. last 20 turns), cap total payload size (e.g. 15 MB).
- `content` can be either a plain string OR an array of blocks (`text` / `document`).
- Allowed `media_type`: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`.
- The backend maps roles: `user` → Gemini `user`, `assistant` → Gemini `model`. The system prompt is added by the backend, not the frontend.
- Files are passed to Gemini via `inline_data` blocks (`{ mime_type, data }`) inside the user's content parts.

#### Response — 200 OK

The backend returns the normalised shape (not Gemini's raw envelope), so the frontend stays provider-agnostic.

```json
{
  "message": {
    "role": "assistant",
    "content": [
      { "type": "text", "text": "Here's how I'd approach this..." }
    ]
  }
}
```

#### Errors

- `400 VALIDATION_ERROR` — bad payload shape, oversized file, disallowed MIME.
- `401 UNAUTHENTICATED`.
- `413 PAYLOAD_TOO_LARGE` — total payload exceeds 15 MB.
- `429 RATE_LIMITED` — apply per-user rate limit (e.g. 20 messages per hour) to keep API costs sane.
- `502 BAD_GATEWAY` — Gemini API failure; return `{ "error": { "code": "AI_UNAVAILABLE", "message": "..." } }`.

---

## Notes for backend

- **Provider:** Google Gemini. Use the `@google/genai` SDK (`npm install @google/genai`).
- **Model:** prefer the latest Gemini Pro tier available (e.g. `gemini-2.5-pro` or whatever is current at build time). Make it env-configurable via `GEMINI_MODEL`; default to the latest Pro release. Don't accept a model hint from the frontend.
- **API key:** `GEMINI_API_KEY` in `backend/.env`. Never expose it to the frontend.
- **System prompt** is owned by the backend, not the frontend. Pass via Gemini's `systemInstruction` parameter. Scope it to HR / people-ops topics and remind the model that the user is an HR professional using the HR Playhouse Hub.
- **Context caching:** Gemini supports context caching for repeated content (e.g. long system prompts, reference docs). Enable it on the system instruction once it's stable to cut per-call cost. See `integrations.md`.
- **File handling:** for small files (< 20 MB), inline as base64 in `inline_data`. For larger files (not in scope for v1 since cap is 10 MB), use the Gemini File API.
- **Safety settings:** keep Gemini's default safety thresholds. HR conversations may touch sensitive topics (harassment, dismissal, mental health) — if Gemini blocks a response with a safety stop reason, surface a friendly `502` to the frontend with `code: "AI_BLOCKED"` and a generic message ("This conversation can't be answered automatically — please contact your HR team or our support."). Log the block reason server-side for review.
- **Streaming (future):** v1 returns the full response in one shot. Gemini supports streaming via `generateContentStream`; upgrade to SSE later and update this spec.
- Apply per-user usage limits and log token counts (Gemini returns `usageMetadata`) for cost tracking.
