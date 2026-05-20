# Page — Innovation Lab

**Frontend file:** `frontend/src/app/innovation-lab/innovation-lab-content.tsx`
**Page route:** `/innovation-lab`
**Auth required:** Yes

A community forum with 4 boards (New Members, Ideas, Feedback, Mentorship), an Idea Impact Calculator, and a mentorship request flow.

---

## What the page displays

- 4 board filters: `new-members | ideas | feedback | mentorship`.
- Post list per board: pinned posts first, then newest.
- Click post → expanded thread with replies.
- "New post" button → modal with name, email, board, title, body.
- "Reply" form inside thread: name, email, body.
- Idea Impact Calculator: 5 sliders (reach, urgency, feasibility, innovation, evidence), each 1–5 → produces a 0–100 score + letter grade.
- "Submit Idea" button (after using calculator) → posts to the Ideas board.
- 3 mentors with role + tags → "Request mentorship" form (name, email, role, topic, message).
- "Join the Lab" modal (intro form).

---

## Endpoints

### GET `/api/forum/posts`

#### Query

- `board` — required: `new-members | ideas | feedback | mentorship`.
- `limit`, `offset` — pagination.

#### Response — 200 OK

```json
{
  "data": [ /* ForumPost[] without replies (just reply_count) */ ],
  "pagination": { "total": 47, "limit": 20, "offset": 0 }
}
```

---

### GET `/api/forum/posts/:id`

Full post with replies included.

#### Response — 200 OK

```json
{ "post": { /* ForumPost with replies[] populated */ } }
```

---

### POST `/api/forum/posts`

Create a new post.

#### Request

```json
{
  "board": "ideas",
  "title": "What if we made onboarding game-based?",
  "body": "...",
  "impact_score": 78,            // optional — present when submitted via the calculator
  "anonymous": false             // honors the user's privacy pref
}
```

`author_name` and `author_id` are derived server-side from the authenticated user (or set to `"Anonymous"` if `anonymous=true` and user has `anonymous_posts=true` pref).

#### Response — 201 Created

```json
{ "post": { /* ForumPost */ } }
```

#### Errors

- `400 VALIDATION_ERROR`.
- `429 RATE_LIMITED` — 10 posts per hour per user.

---

### POST `/api/forum/posts/:id/replies`

#### Request

```json
{ "body": "Great idea — have you considered ...?" }
```

#### Response — 201 Created

```json
{ "reply": { /* ForumReply */ } }
```

---

### POST `/api/forum/mentorship-request`

Send a mentorship request. Routed by email to the mentor (or to admin for triage in v1).

#### Request

```json
{
  "mentor_id": "m-001",          // optional — present when requesting a specific mentor
  "topic": "Building HR analytics from scratch",
  "message": "...",
  "hr_role": "HR Business Partner"
}
```

`name` and `email` come from the authenticated user.

#### Response — 200 OK

```json
{ "ok": true }
```

#### Side effects

- Email `contact@thehrplayhousehub.org` (admin triage in v1) with subject `"Mentorship Request — {topic}"` and the message body.
- Optionally also notify the mentor directly once we wire individual mentor accounts.

---

### GET `/api/forum/mentors`

Returns the static list of mentors (3 in v1).

#### Response — 200 OK

```json
{
  "mentors": [
    { "id": "m-001", "name": "...", "role": "...", "tags": ["..."], "bio": "..." }
  ]
}
```

---

## Notes for backend

- Today everything is in-memory client-side: posts/replies are state, requests are `mailto:` — replace all with real endpoints.
- "Join the Lab" form: in v1, this can simply mark the user's account as "active in Lab" (`joined_lab=true`) — we don't need a separate JoinRequest entity.
- Idea Impact Calculator math (frontend lines 115–141) — backend doesn't need to compute, just accept the score on post creation.
- Moderation: not in scope for v1. Add a `flag` endpoint when needed.
