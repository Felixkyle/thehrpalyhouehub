export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  role: string;
  job_title: string | null;
  organisation: string | null;
  country: string | null;
  linkedin_url: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  consent_accepted_at: string;
}

export interface UserStats {
  levels_completed: number;
  current_level: number;
  current_level_progress: number;
  badges_earned: number;
  courses_count: number;
  cases_read: number;
  cpd_hours: number;
}

export interface NotificationPrefs {
  course_reminders: boolean;
  completion_emails: boolean;
  webinar_announcements: boolean;
  new_content_emails: boolean;
  lab_activity: boolean;
  platform_updates: boolean;
}

export interface PrivacyPrefs {
  show_profile_in_lab: boolean;
  anonymous_posts: boolean;
  share_progress_with_employer: boolean;
}

export interface CourseLevel {
  id: string;
  level_number: 1 | 2 | 3 | 4;
  title: string;
  course_name: string;
  description: string;
  estimated_hours: number;
  progress_percent: number;
  status: "complete" | "current" | "locked";
  started_at: string | null;
  completed_at: string | null;
  topics: { id: string; name: string; status: string }[];
  case_studies: { id: string; name: string; status: string }[];
  games: { id: string; name: string; status: string }[];
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  context: string;
  icon: string | null;
  occurred_at: string;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earned: boolean;
  earned_at: string | null;
}

export interface Certificate {
  id: string | null;
  level: 1 | 2 | 3 | 4 | "full";
  title: string;
  course_name: string;
  description: string;
  badge_emoji: string;
  learner_name: string;
  issued_at: string | null;
  signer_name: string;
  signer_role: string;
  status: "earned" | "locked";
  pdf_url: string | null;
}

export interface CaseStudySummary {
  id: string;
  title: string;
  org_line: string;
  industry: string;
  industry_key: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "expert";
  featured: boolean;
  preview: string;
}

export interface CaseStudyDetail extends CaseStudySummary {
  scenario: { paragraphs: string[] };
  challenge: { items?: string[]; paragraphs?: string[] };
  reflect_questions: string[];
  outcomes: string[];
  lessons: string[];
  application_questions: string[];
}

export interface PlaybookEntry {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  pills: string[];
  steps: string[];
  templates: { name: string; body: string }[];
  do_list: string[];
  dont_list: string[];
  legal: { jurisdiction: string; items: string[] }[];
  manager_guidance: string[];
  hr_guidance: string[];
  escalation_flags: string[];
  checklist_url: string | null;
}

export interface Resource {
  id: string;
  category: "policy" | "research" | "workshop" | "template";
  type_tag: string;
  title: string;
  description: string;
  long_description: string | null;
  year: number;
  pages: number | null;
  format: string;
  jurisdictions: string[];
  tags: string[];
  is_new: boolean;
  is_featured: boolean;
  download_url: string | null;
  open_url: string | null;
  contents: string[];
  icon: string | null;
}

export interface WebinarSession {
  id: string;
  type: "live" | "recorded" | "upcoming";
  is_free: boolean;
  title: string;
  description: string;
  scheduled_at: string | null;
  duration_minutes: number;
  platform: string;
  speaker_name: string | null;
  speaker_role: string | null;
  meeting_link: string | null;
  recording_url: string | null;
  registered_count: number;
  is_registered: boolean;
  order: number;
}

export interface ForumPost {
  id: string;
  board: "new-members" | "ideas" | "feedback" | "mentorship";
  author_name: string;
  author_id: string | null;
  title: string;
  body: string;
  impact_score: number | null;
  pinned: boolean;
  reply_count: number;
  created_at: string;
  replies?: ForumReply[];
}

export interface ForumReply {
  id: string;
  post_id: string;
  author_name: string;
  body: string;
  created_at: string;
}

export interface AiContentBlock {
  type: "text" | "document";
  text?: string;
  source?: { type: "base64"; media_type: string; data: string };
  title?: string;
}

export interface AiMessage {
  role: "user" | "assistant";
  content: string | AiContentBlock[];
}

export interface ApiErrorBody {
  error: { code: string; message: string; fields?: Record<string, string> };
}
