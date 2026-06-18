import { api } from "./client";
import type {
  User,
  UserStats,
  NotificationPrefs,
  PrivacyPrefs,
  CourseLevel,
  Activity,
  Badge,
  Certificate,
  CaseStudySummary,
  CaseStudyDetail,
  PlaybookEntry,
  Resource,
  WebinarSession,
  ForumPost,
  AiMessage,
} from "./types";

export interface AuthResponse {
  token: string;
  expires_at: string;
  user: User;
}

export const auth = {
  signup: (body: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
    country?: string;
    how_heard?: string;
    consent_accepted: true;
  }) => api<AuthResponse>("/api/auth/signup", { method: "POST", body }),

  login: (body: { email: string; password: string }) =>
    api<AuthResponse>("/api/auth/login", { method: "POST", body }),

  passwordResetRequest: (email: string) =>
    api<{ ok: true }>("/api/auth/password-reset/request", { method: "POST", body: { email } }),

  passwordResetConfirm: (token: string, new_password: string) =>
    api<{ ok: true }>("/api/auth/password-reset/confirm", { method: "POST", body: { token, new_password } }),
};

export const users = {
  me: () => api<{ user: User; stats: UserStats }>("/api/users/me"),

  updateMe: (body: Partial<Pick<User, "first_name" | "last_name" | "email" | "job_title" | "organisation" | "country" | "linkedin_url" | "bio">>) =>
    api<{ user: User }>("/api/users/me", { method: "PATCH", body }),

  changePassword: (current_password: string, new_password: string) =>
    api<{ ok: true }>("/api/users/me/password", { method: "POST", body: { current_password, new_password } }),

  uploadAvatar: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api<{ avatar_url: string }>("/api/users/me/avatar", { method: "POST", formData: fd });
  },

  preferences: () =>
    api<{ notifications: NotificationPrefs; privacy: PrivacyPrefs }>("/api/users/me/preferences"),

  updatePreferences: (body: { notifications?: Partial<NotificationPrefs>; privacy?: Partial<PrivacyPrefs> }) =>
    api<{ notifications: NotificationPrefs; privacy: PrivacyPrefs }>("/api/users/me/preferences", {
      method: "PATCH",
      body,
    }),

  deleteMe: () => api<{ ok: true; deletion_scheduled_for: string }>("/api/users/me", { method: "DELETE" }),
};

export const dashboard = {
  get: () =>
    api<{
      user: User;
      stats: UserStats;
      levels: CourseLevel[];
      recent_activity: Activity[];
      badges: Badge[];
    }>("/api/dashboard"),
};

export const courses = {
  list: () => api<{ levels: CourseLevel[] }>("/api/courses"),

  start: (level: number) =>
    api<{ levels: CourseLevel[] }>(`/api/courses/${level}/start`, { method: "POST" }),

  complete: (level: number, body: { kind: "topic" | "case_study" | "game"; item_id: string }) =>
    api<{ levels: CourseLevel[] }>(`/api/courses/${level}/complete`, { method: "POST", body }),

  submitFinalProject: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api<{ ok: true; submission: { original_name: string; file_url: string; submitted_at: string } }>(
      "/api/courses/final-project",
      { method: "POST", formData: fd },
    );
  },

  finalProject: () =>
    api<{ submission: { original_name: string; file_url: string; submitted_at: string } | null }>(
      "/api/courses/final-project",
    ),
};

export const certificates = {
  list: () => api<{ certificates: Certificate[] }>("/api/certificates"),

  verify: (id: string) =>
    api<{
      valid: boolean;
      certificate?: {
        id: string;
        learner_name: string;
        level: 1 | 2 | 3 | 4 | "full";
        course_name: string;
        description: string;
        badge_emoji: string;
        issued_at: string;
        signer_name: string;
        signer_role: string;
      };
    }>("/api/certificates/verify", { query: { id } }),
};

export const progressReport = {
  get: () =>
    api<{
      user: User;
      stats: UserStats;
      levels: CourseLevel[];
      certificates: Certificate[];
      timeline: { title: string; occurred_at: string; hours: number | null; context: string }[];
      report_generated_at: string;
    }>("/api/progress-report"),
};

export const enquiries = {
  cpd: (body: { name: string; organisation: string; email: string; message?: string }) =>
    api<{ ok: true }>("/api/enquiries/cpd", { method: "POST", body }),

  partnership: (formData: FormData) =>
    api<{ ok: true }>("/api/enquiries/partnership", { method: "POST", formData }),

  clockiq: (body: { name: string; email: string; organisation?: string; team_size?: string; message?: string }) =>
    api<{ ok: true }>("/api/enquiries/clockiq", { method: "POST", body }),
};

export const ai = {
  chat: (messages: AiMessage[]) =>
    api<{ message: AiMessage }>("/api/ai/chat", { method: "POST", body: { messages } }),
};

export const caseStudies = {
  list: (filters: { topic?: string; difficulty?: string; industry_key?: string; q?: string; featured?: boolean } = {}) =>
    api<{ case_studies: CaseStudySummary[] }>("/api/case-studies", { query: filters }),

  get: (id: string) => api<CaseStudyDetail>(`/api/case-studies/${id}`),
};

export const playbook = {
  list: () => api<{ entries: PlaybookEntry[] }>("/api/playbook"),
};

export const resources = {
  list: (filters: { category?: string; q?: string } = {}) =>
    api<{ resources: Resource[] }>("/api/resources", { query: filters }),

  submit: (body: { submitter_name: string; submitter_email: string; resource_title: string; resource_description: string; resource_url?: string }) =>
    api<{ ok: true }>("/api/resources/submit", { method: "POST", body }),
};

export const webinars = {
  list: (type?: "live" | "recorded" | "upcoming") =>
    api<{ webinars: WebinarSession[] }>("/api/webinars", { query: { type } }),

  register: (id: string, body: { first_name?: string; last_name?: string; email?: string; organisation?: string; hr_level?: string }) =>
    api<{ ok: true; webinar: WebinarSession }>(`/api/webinars/${id}/register`, { method: "POST", body }),

  unregister: (id: string) => api<{ ok: true }>(`/api/webinars/${id}/register`, { method: "DELETE" }),
};

export const forum = {
  posts: (board: string, opts: { limit?: number; offset?: number } = {}) =>
    api<{ data: ForumPost[]; pagination: { total: number; limit: number; offset: number } }>("/api/forum/posts", {
      query: { board, ...opts },
    }),

  post: (id: string) => api<{ post: ForumPost }>(`/api/forum/posts/${id}`),

  createPost: (body: { board: string; title: string; body: string; impact_score?: number; anonymous?: boolean }) =>
    api<{ post: ForumPost }>("/api/forum/posts", { method: "POST", body }),

  reply: (postId: string, body: string) =>
    api<{ reply: { id: string; post_id: string; author_name: string; body: string; created_at: string } }>(
      `/api/forum/posts/${postId}/replies`,
      { method: "POST", body: { body } },
    ),

  mentorshipRequest: (body: { mentor_id?: string; topic: string; message: string; hr_role?: string }) =>
    api<{ ok: true }>("/api/forum/mentorship-request", { method: "POST", body }),

  mentors: () =>
    api<{ mentors: { id: string; name: string; role: string; tags: string[]; bio: string }[] }>("/api/forum/mentors"),
};
