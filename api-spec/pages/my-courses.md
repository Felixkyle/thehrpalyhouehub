# Page — My Courses

**Frontend file:** `frontend/src/app/my-courses/my-courses-content.tsx`
**Page route:** `/learn/my-courses`
**Auth required:** Yes

Deep view of the 4 learning levels with filter tabs (All / Completed / In progress / Locked) and a certificate strip.

---

## What the page displays

- Header stats: total completed, current level progress %, locked count.
- Progress ring strip: SVG ring per level with completion %.
- 4 detailed level cards: progress %, topic list (with per-topic status), case study list, games list, estimated hours, start date, action button.
- Filter tabs: `all | complete | current | locked`.
- 5 certificates (Level 1–4 + Full Programme) with status (Earned / Locked), preview-on-click modal.

---

## Endpoints

### GET `/api/courses`

Full course catalog with the user's progress overlaid.

#### Response — 200 OK

```json
{
  "levels": [ /* CourseLevel[] — exactly 4, with topics/case_studies/games and progress fields populated */ ]
}
```

Each `CourseLevel.topics[i]`, `case_studies[i]`, and `games[i]` includes `status: "complete" | "current" | "locked"` for the authenticated user.

#### Errors

- `401 UNAUTHENTICATED`.

---

### GET `/api/certificates`

The 5 certificates (4 levels + full programme).

#### Response — 200 OK

```json
{ "certificates": [ /* Certificate[] */ ] }
```

For levels the user hasn't completed, return the certificate with `status: "locked"` and `issued_at: null`.

---

### POST `/api/certificates/:id/regenerate` _(optional, future)_

Re-issues the certificate PDF if a user lost the file. Returns a fresh signed download URL. Skip for v1 if certificates are generated on-demand.

---

## Notes for backend

- Frontend currently calls `GET /wp-json/tutor/v1/course-progress/{courseId}` four times (one per level) — collapse into the single `/api/courses` call above.
- `progress_percent` should be a number (not a string with `%`). The frontend appends the `%`.
- The "Full Programme" certificate is earned only when all 4 levels are complete.
- Topic / case study / game items are fixed structurally (defined per level). Their `status` for a given user is what varies.
