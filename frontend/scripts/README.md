# HTML → Next.js page generator

These scripts convert the legacy WordPress HTML exports in
`frontend/Corrected Files for HRPH/` into Next.js App Router pages under
`frontend/src/app/`.

## How to regenerate the pages

```bash
cd frontend
npm run generate:pages
```

Then verify it still builds:

```bash
npm run build
```

## What it does (faithful port)

Each source `.html` file becomes **two files** plus a stylesheet:

| Generated file | Purpose |
|---|---|
| `app/<route>/page.tsx` | Server Component — exports page `metadata` (title/description), renders the content component. |
| `app/<route>/<route>-content.tsx` | `"use client"` Component — the original `<body>` markup via `dangerouslySetInnerHTML` + the page's own `<script>`s via `next/script`. |
| `app/<route>/<route>.css` | The page's original `<style>` block, colocated and imported. |

The homepage lives at `app/page.tsx` + `app/home-content.tsx`; the 404 page
at `app/not-found.tsx` + `app/not-found-content.tsx`.

This is a **deliberate faithful-port strategy**: markup, CSS, the ~385 inline
event handlers, and per-page JavaScript are preserved exactly, so the pages
look and behave identically to the original WordPress site. They can be
refactored into idiomatic React incrementally later.

## Files

- `route-map.mjs` — the HTML-file → URL mapping, plus link-rewrite rules.
  **Edit this** to change any URL or add/remove a page.
- `generate-pages.mjs` — the generator itself.

## Link rewriting

The generator rewrites links so the new app is self-contained:

- `href="02_dashboard.html"` → `/dashboard` (cross-page `.html` links)
- `https://www.thehrplayhousehub.org/` → `/` (marketing site root)
- `https://learn.thehrplayhousehub.org/<path>/` → internal route **only**
  for paths in `LMS_PATH_MAP` (e.g. `case-study-vault`, `playbook`).
  Unmapped LMS paths (e.g. `/courses/`, legal pages) intentionally stay
  pointing at the live WordPress site.

## ⚠️ Do not hand-edit generated files

`page.tsx`, `*-content.tsx`, and `*.css` under `src/app/` carry a
`@generated` banner and are overwritten on every run. Make changes to the
source HTML or to these scripts instead.

## Known follow-ups

- `public/assets/HrPlayhouseHublogo-BcNoBwC7.jpeg` is a **placeholder** SVG.
  Replace it with the real logo from the old site.
- Forms that previously posted to WordPress endpoints (e.g. password reset,
  signup) still contain their original client behaviour. Wire them to the
  Express backend (`../backend`) when ready.
