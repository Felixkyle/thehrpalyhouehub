# Page — Case Study Vault

**Frontend file:** `frontend/src/app/case-study-vault/case-study-vault-content.tsx`
**Page route:** `/learn/case-study-vault`
**Auth required:** Yes

Searchable library of 32 HR case studies. Filtering, modal detail view, plus a "Download Case Summary" action that generates a TXT file client-side.

---

## What the page displays

- Search input (matches title, org line, preview text, industry).
- 3 dropdown filters: topic, difficulty, industry.
- Grid of case cards: title, org line, industry, difficulty badge, featured badge.
- Modal on card click: scenario paragraphs, challenge list, "Pause & Reflect" questions, outcomes, lessons, application questions.
- "Download Case Summary" button inside modal → generates a `.txt` file in-browser.

---

## Endpoints

### GET `/api/case-studies`

Lists all case studies with filterable metadata.

#### Query (all optional)

- `topic` — one of `recruitment | performance | deib | retention | strategy | employee_relations | wellbeing | future_of_work`.
- `difficulty` — `beginner | intermediate | expert`.
- `industry_key` — string match.
- `q` — search query (server-side full-text on title, org_line, preview).
- `featured` — `true` to return only featured.

#### Response — 200 OK

```json
{
  "case_studies": [
    {
      "id": "cs-001",
      "title": "...",
      "org_line": "Tech startup, Lagos (Anonymised)",
      "industry": "Technology",
      "industry_key": "tech",
      "topic": "recruitment",
      "difficulty": "intermediate",
      "featured": true,
      "preview": "..."
    }
  ]
}
```

The **list response is a slim summary** — no scenario/challenge/lessons fields. Those live on the detail endpoint.

---

### GET `/api/case-studies/:id`

Returns the full case study.

#### Response — 200 OK

Returns the complete `CaseStudy` object (see `data-models.md`).

#### Errors

- `404 NOT_FOUND`.

---

## Notes for backend

- The frontend currently has all 32 cases bundled into a static `CASES` array (`case-study-vault-data.ts`). Migrate the data into a database table; the file becomes a seed migration.
- Search can start as simple LIKE matching; upgrade to full-text later if needed.
- "Download Case Summary" stays client-side — no endpoint needed for it.
- Cases are static reference content, not user-specific. No auth-gated personalisation on this page beyond requiring login.
