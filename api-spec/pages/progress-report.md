# Page — Progress Report

**Frontend file:** `frontend/src/app/progress-report/progress-report-content.tsx`
**Page route:** `/progress-report`
**Auth required:** Yes

A printable/downloadable summary of the user's learning journey. Used for CPD evidence and employer sharing.

---

## What the page displays

- Hero: user name + subtitle.
- 4 overall stats: levels complete, current level %, CPD hours, badges.
- Per-level cards with completion date, hours, topics/case studies/games (each item shown with completion status).
- Certificates section (4 levels + full programme), printable.
- Activity timeline: ~5 milestone events (level completions, badge earns) with date and hours.

Print/download is implemented client-side (`window.print()`) — no backend PDF generation needed for v1.

---

## Endpoints

### GET `/api/progress-report`

Everything on the page in one payload.

#### Response — 200 OK

```json
{
  "user": { /* User */ },
  "stats": { /* UserStats */ },
  "levels": [
    {
      "level_number": 1,
      "title": "Foundations of HR",
      "status": "complete",
      "completed_at": "2026-03-12T00:00:00Z",
      "hours_logged": 6.5,
      "progress_percent": 100,
      "topics": [ { "name": "...", "status": "complete" } ],
      "case_studies": [ { "name": "...", "status": "complete" } ],
      "games": [ { "name": "...", "status": "complete" } ]
    }
    /* ... 4 levels total */
  ],
  "certificates": [ /* Certificate[] */ ],
  "timeline": [
    {
      "title": "Completed Level 1: Foundations of HR",
      "occurred_at": "2026-03-12T00:00:00Z",
      "hours": 6.5,
      "context": "Level 1"
    }
    /* ... newest first */
  ],
  "report_generated_at": "2026-05-19T14:30:00Z"
}
```

#### Errors

- `401 UNAUTHENTICATED`.

---

## Notes for backend

- This endpoint is the same shape as `/api/dashboard` for the overlap (user, stats, levels), but adds `timeline` and a `report_generated_at` timestamp for printout footers.
- "Hours logged" is the time the user spent on the level. If we don't track this yet, return `null` and the frontend hides it.
- Timeline events are derived from `Activity` records, filtered to milestones (level completions, badge earns, certificate issues) — not every micro-event.
