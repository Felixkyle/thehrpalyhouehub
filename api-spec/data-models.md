# Shared Data Models

Types referenced by multiple endpoints. Backend should implement these as the canonical shapes.

---

## User

The authenticated user object. Returned by `/api/users/me` and embedded in login/signup responses.

```ts
{
  id: string,                        // opaque
  email: string,
  first_name: string,
  last_name: string,
  display_name: string,              // computed: "First Last" or username fallback
  username: string,                  // optional, may equal email prefix
  role: string,                      // HR role from signup, e.g. "HR Business Partner"
  job_title: string | null,          // editable on profile page
  organisation: string | null,
  country: string | null,            // e.g. "Nigeria", "UK"
  linkedin_url: string | null,
  bio: string | null,
  avatar_url: string | null,         // server-hosted URL after upload
  created_at: string,                // ISO date
  consent_accepted_at: string        // ISO date — when they ticked T&C on signup
}
```

---

## UserStats

Summary numbers shown in dashboard/profile sidebars.

```ts
{
  levels_completed: number,          // 0..4
  current_level: number,             // 1..4 — the level they're working on
  current_level_progress: number,    // 0..100
  badges_earned: number,
  courses_count: number,             // total enrolled
  cases_read: number,
  cpd_hours: number                  // estimated
}
```

---

## CourseLevel

The four learning levels (Level 1–4). Mostly static structural data, with per-user progress overlaid.

```ts
{
  id: string,
  level_number: 1 | 2 | 3 | 4,
  title: string,                     // e.g. "Foundations of HR"
  course_name: string,
  description: string,
  estimated_hours: number,
  topics: Topic[],                   // 3-5 per level
  case_studies: Topic[],
  games: Topic[],
  // per-user overlay (only present when fetched authenticated):
  progress_percent?: number,         // 0..100
  status?: "complete" | "current" | "locked",
  started_at?: string | null,
  completed_at?: string | null
}
```

### Topic (used inside CourseLevel)

```ts
{
  id: string,
  name: string,
  status: "complete" | "current" | "locked"
}
```

---

## Activity

Recent activity feed item on the dashboard.

```ts
{
  id: string,
  type: "topic_completed" | "case_read" | "game_completed" | "level_completed" | "badge_earned",
  title: string,                     // e.g. "Completed: Burnout Detective Game"
  context: string,                   // e.g. "Level 2"
  icon: string | null,               // emoji or icon name
  occurred_at: string                // ISO datetime
}
```

---

## Badge

```ts
{
  id: string,
  name: string,
  emoji: string,
  description: string,
  earned: boolean,
  earned_at: string | null
}
```

---

## Certificate

```ts
{
  id: string,                        // human-readable: "HRPH-2026-L1-00142"
  user_id: string,
  level: 1 | 2 | 3 | 4 | "full",     // "full" = full programme cert
  title: string,                     // e.g. "Certificate of Level Completion"
  course_name: string,
  description: string,
  badge_emoji: string,
  issued_at: string,                 // ISO date
  signer_name: string,               // e.g. "Dr. Marvellous Gberevbie"
  signer_role: string,
  status: "earned" | "locked",
  pdf_url: string | null             // server-generated PDF link, if any
}
```

---

## NotificationPrefs

```ts
{
  course_reminders: boolean,
  completion_emails: boolean,
  webinar_announcements: boolean,
  new_content_emails: boolean,
  lab_activity: boolean,
  platform_updates: boolean
}
```

## PrivacyPrefs

```ts
{
  show_profile_in_lab: boolean,
  anonymous_posts: boolean,
  share_progress_with_employer: boolean
}
```

---

## Resource

Catalog item on the resources page (toolkit, report, workshop, template).

```ts
{
  id: string,
  category: "policy" | "research" | "workshop" | "template",
  type_tag: string,                  // e.g. "Toolkit", "Report"
  title: string,
  description: string,
  long_description: string | null,
  year: number,
  pages: number | null,
  format: string,                    // e.g. "docx", "pptx", "html"
  jurisdictions: string[],           // e.g. ["UK","Nigeria","Ghana"]
  tags: string[],
  is_new: boolean,
  is_featured: boolean,
  download_url: string | null,       // null if it's a web-app link
  open_url: string | null,           // for in-platform resources
  contents: string[],                // bullet outline shown in modal
  icon: string | null
}
```

---

## CaseStudy

```ts
{
  id: string,
  title: string,
  org_line: string,                  // e.g. "Tech startup, Lagos (Anonymised)"
  industry: string,
  industry_key: string,
  topic: string,                     // one of 8 categories — see CaseStudy.topics
  difficulty: "beginner" | "intermediate" | "expert",
  featured: boolean,
  preview: string,
  scenario: { paragraphs: string[] },
  challenge: { items?: string[], paragraphs?: string[] },
  reflect_questions: string[],
  outcomes: string[],
  lessons: string[],
  application_questions: string[]
}
```

Topics enum: `recruitment | performance | deib | retention | strategy | employee_relations | wellbeing | future_of_work`.

---

## PlaybookEntry

```ts
{
  id: string,
  title: string,
  category: string,
  icon: string,
  summary: string,
  pills: string[],
  steps: string[],
  templates: { name: string, body: string }[],
  do_list: string[],
  dont_list: string[],
  legal: { jurisdiction: "UK" | "Nigeria" | "USA" | "Singapore", items: string[] }[],
  manager_guidance: string[],
  hr_guidance: string[],
  escalation_flags: string[],
  checklist_download_url: string | null
}
```

---

## WebinarSession

```ts
{
  id: string,
  type: "live" | "recorded" | "upcoming",
  is_free: boolean,
  title: string,
  description: string,
  scheduled_at: string | null,       // ISO datetime; null for recorded
  duration_minutes: number,
  platform: string,                  // "Zoom" | "Google Meet" | etc.
  speaker_name: string | null,
  speaker_role: string | null,
  meeting_link: string | null,       // shown to registered users only
  recording_url: string | null,      // only when type=recorded
  registered_count: number,
  is_registered: boolean             // for the authenticated user
}
```

---

## ForumPost

Innovation Lab post.

```ts
{
  id: string,
  board: "new-members" | "ideas" | "feedback" | "mentorship",
  author_name: string,
  author_id: string | null,          // null if anonymous
  title: string,
  body: string,
  created_at: string,
  pinned: boolean,
  reply_count: number,
  replies: ForumReply[]              // included on detail fetch; omitted in list
}
```

## ForumReply

```ts
{
  id: string,
  post_id: string,
  author_name: string,
  body: string,
  created_at: string
}
```
