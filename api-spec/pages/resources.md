# Page — Resources Library

**Frontend file:** `frontend/src/app/resources/resources-content.tsx`
**Page route:** `/learn/resources`
**Auth required:** Yes

A catalog of 8 downloadable resources (toolkits, reports, workshops, templates).

---

## What the page displays

- Search bar.
- Category filter: All / Policy & Toolkit / Research & Reports / Workshop / Templates.
- Featured strip at the top (2 highlighted items with custom CTAs).
- Card grid: icon, type tag, title, description, year, pages, format, jurisdictions, tags, "New"/"Featured" badges.
- "Access" button → modal with long description, table of contents, download button.
- "Submit a Resource" link (currently mailto:).

---

## Endpoints

### GET `/api/resources`

#### Query (optional)

- `category` — `policy | research | workshop | template`.
- `q` — search title/description/tags.

#### Response — 200 OK

```json
{ "resources": [ /* Resource[] — see data-models.md */ ] }
```

---

### GET `/api/resources/:id/download`

Returns the file (or redirects to a signed URL).

#### Response — 302 Found

`Location: https://cdn.example.com/...?signature=...` — short-lived signed URL.

Or **200 OK** with the file streamed directly. Both are acceptable; signed-URL redirects scale better.

#### Errors

- `404 NOT_FOUND`.
- `401 UNAUTHENTICATED`.

#### Side effects

- Increment a `download_count` on the resource (analytics).

---

### POST `/api/resources/submit`

Lets users submit their own resource for review. Replaces the current `mailto:` link.

#### Request

```json
{
  "submitter_name": "Ada Okonkwo",
  "submitter_email": "ada@example.com",
  "resource_title": "...",
  "resource_description": "...",
  "resource_url": "https://..."  /* or omit and use file upload variant */
}
```

#### Response — 200 OK

```json
{ "ok": true }
```

Sends an email to `contact@thehrplayhousehub.org` with the submission for editorial review.

---

## Notes for backend

- Resource files today are bundled with the frontend (the `file` field in the JSX). Move to object storage (S3/R2).
- "Open on Platform" resources (Case Study Vault, Playbook) are internal links — they don't need download URLs.
- Featured + new flags are editorial — back them with database columns, not derived rules.
