# Page — Everyday HR Playbook

**Frontend file:** `frontend/src/app/playbook/playbook-content.tsx`
**Page route:** `/learn/playbook`
**Auth required:** Yes

A reference library of 10 common HR situations (difficult conversations, mental health, redundancy, etc.) with step-by-step guidance, templates, jurisdiction-aware legal notes, and downloadable checklists.

---

## What the page displays

- Search bar.
- Category filter pills.
- Sidebar of all 10 situations.
- Per-situation expandable accordion with:
  - Steps to follow
  - Email/letter templates
  - Do / Don't lists
  - Legal section with jurisdiction tabs (UK, Nigeria, USA, Singapore)
  - Manager guidance vs HR guidance splits
  - Escalation flags
  - "Download Checklist" link

---

## Endpoints

### GET `/api/playbook`

Returns all playbook entries.

#### Response — 200 OK

```json
{ "entries": [ /* PlaybookEntry[] — all 10, see data-models.md */ ] }
```

The full payload is ~50–100 KB — small enough to serve in one call. Cache aggressively (`Cache-Control: public, max-age=300`).

---

### GET `/api/playbook/:id/checklist`

Downloads the checklist file for a given entry.

#### Response — 200 OK

`Content-Type: application/pdf` (or `text/markdown` if simpler).

#### Errors

- `404 NOT_FOUND`.

---

## Notes for backend

- The playbook content is currently hardcoded in the frontend component. Migrate to a database table or markdown files so editors can update without redeploying.
- Legal jurisdiction guidance must be reviewable — store with a `last_reviewed_at` field and a `reviewer` name; consider surfacing those on the page later.
- Checklists today are referenced by name only — backend should host the actual files (PDF or markdown).
