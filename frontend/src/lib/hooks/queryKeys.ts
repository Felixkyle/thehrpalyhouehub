/** Centralised TanStack Query keys so invalidation stays consistent. */
export const qk = {
  me: ["me"] as const,
  preferences: ["preferences"] as const,
  dashboard: ["dashboard"] as const,
  courses: ["courses"] as const,
  certificates: ["certificates"] as const,
  certificateVerify: (id: string) => ["certificate-verify", id] as const,
  progressReport: ["progress-report"] as const,
  caseStudies: (filters: Record<string, unknown>) => ["case-studies", filters] as const,
  caseStudy: (id: string) => ["case-study", id] as const,
  playbook: ["playbook"] as const,
  resources: (filters: Record<string, unknown>) => ["resources", filters] as const,
  webinars: (type?: string) => ["webinars", type ?? "all"] as const,
  forumPosts: (board: string, opts: Record<string, unknown>) => ["forum-posts", board, opts] as const,
  forumPost: (id: string) => ["forum-post", id] as const,
  mentors: ["mentors"] as const,
};
