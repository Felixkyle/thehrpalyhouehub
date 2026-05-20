# Conventions

Read this before writing any endpoint. These rules apply to every route in the spec unless a page file explicitly says otherwise.

## Base URL

- Dev: `http://localhost:4000`
- Frontend reads from `process.env.NEXT_PUBLIC_API_BASE`.
- All paths in this spec are relative to that base.

## Path prefix

All API routes live under `/api/`. Examples:

- `POST /api/auth/signup`
- `GET /api/users/me`
- `GET /api/courses/progress`

The frontend currently has legacy `/wp-json/...` paths hardcoded in a few places (WordPress prototype). When the backend ships these endpoints, those frontend calls will be updated to `/api/...`.

## Authentication

- **Scheme:** JWT bearer.
- **Header:** `Authorization: Bearer <token>`
- **Storage on frontend:** `localStorage.hrph_token`
- **Login response shape:** `{ token: string, user: User, expires_at: ISOString }`
- **Token lifetime:** 7 days; refresh by re-authenticating (no refresh-token flow yet).
- **Public endpoints** (no auth): signup, login, password-reset request, certificate verify, public marketing data.
- **401 behavior:** if any authenticated endpoint returns 401, the frontend clears the token and redirects to signup.

## Request/response format

- **Content-Type:** `application/json` for normal requests.
- **File uploads:** `multipart/form-data`. File size limits live on the endpoint spec.
- **Casing:** `snake_case` for JSON field names (matches what the frontend already expects from the legacy `/wp-json/` calls — e.g. `completed_percent`, `first_name`).
- **Dates:** ISO 8601 strings with timezone (`2026-05-19T14:30:00Z`). The frontend formats for display.
- **IDs:** numeric or string opaque IDs. Don't expose internal DB rowids if there's a safer choice (e.g. for certificates use the human-readable `HRPH-2026-L1-00142` format).
- **Booleans:** real JSON `true`/`false`, not `"1"`/`"0"`.

## Error format

Every error response uses this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message safe to show users.",
    "fields": {
      "email": "Email is required",
      "password": "Must be at least 8 characters"
    }
  }
}
```

- `code` — machine-readable, SCREAMING_SNAKE_CASE.
- `message` — safe for end-user display.
- `fields` — optional, present for validation errors; keys are form field names.

### Standard error codes

| HTTP | code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Bad payload, missing fields, wrong types |
| 401 | `UNAUTHENTICATED` | Missing or invalid token |
| 403 | `FORBIDDEN` | Authenticated but not allowed |
| 404 | `NOT_FOUND` | Resource doesn't exist |
| 409 | `CONFLICT` | e.g. email already registered |
| 413 | `PAYLOAD_TOO_LARGE` | File exceeds size limit |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unhandled server error |

## Pagination

For endpoints that return lists, use offset/limit:

- **Query:** `?limit=20&offset=0`
- **Defaults:** `limit=20`, `offset=0`. Max `limit=100`.
- **Response envelope:**

  ```json
  {
    "data": [ ... ],
    "pagination": { "total": 123, "limit": 20, "offset": 0 }
  }
  ```

Endpoints that return a small fixed list (e.g. the 4 course levels) can skip pagination and return the array directly under a named key (`{ "levels": [...] }`).

## Validation rules (cross-cutting)

- **Email:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Password:** minimum 8 characters. Strength is calculated frontend-side (5-point scale: length≥8, length≥12, uppercase, digit, special char) — backend just enforces the floor.
- **File uploads:** sizes enforced backend-side AND frontend-side. See each endpoint for the limit.

## CORS

- Allow `process.env.FRONTEND_URL` (defaults to `http://localhost:3000`).
- Credentials: not needed (token in header, not cookie).

## Rate limiting

- Apply to auth + email-sending endpoints at minimum.
- Suggest: 5 attempts per 15 minutes per IP for password reset / signup.
- Return `429 RATE_LIMITED` with `Retry-After` header.

## Logging

- Log every request: method, path, status, duration, user ID (if authenticated).
- **Never log:** passwords, tokens, full email bodies, uploaded file contents.
