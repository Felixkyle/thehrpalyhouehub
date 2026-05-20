# Page — Dashboard

**Frontend file:** `frontend/src/app/dashboard/dashboard-content.tsx`
**Page route:** `/dashboard`
**Auth required:** Yes

This is the landing page after login. It shows the user's progress, recent activity, badges, and quick links.

---

## What the page displays

- Sidebar profile card: avatar, name, role, location, three stat counters (Courses, Cases Read, Badges).
- Welcome header: greeting + first name + overall progress %.
- 4 level cards (Level 1–4): status badge, title, description, progress bar, topic breakdown ("2 / 3 topics", "Case study", "2 / 3 games"), action button (Review / Continue / Locked).
- Recent activity feed (last ~5 events).
- 8 badges (earned + locked) — emoji, name, date earned.
- Quick access cards linking to Case Study Vault, Playbook, AI Support, Innovation Lab.

---

## Endpoints

### GET `/api/dashboard`

Returns everything the dashboard renders, in one call. Roll up multiple resources so the frontend doesn't waterfall.

#### Response — 200 OK

```json
{
  "user": { /* User */ },
  "stats": { /* UserStats */ },
  "levels": [ /* CourseLevel[] with progress overlay — exactly 4 items */ ],
  "recent_activity": [ /* Activity[] — last 5–10 items, newest first */ ],
  "badges": [ /* Badge[] — full list, earned and locked */ ]
}
```

See `data-models.md` for each type.

#### Errors

- `401 UNAUTHENTICATED`.

---

## Notes for backend

- Frontend can fall back to mock data if this call fails — backend should not silently return partial data. Either succeed fully or return an error.
- `recent_activity` items should include relative timestamps in the ISO `occurred_at` field; the frontend formats "2 hours ago" client-side.
- For new users with no activity yet: return `recent_activity: []`, all levels at `progress_percent: 0`, only Level 1 with `status: "current"` and Levels 2–4 `"locked"`.
