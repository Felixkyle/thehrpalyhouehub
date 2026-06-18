"use client";

import { useQuery } from "@tanstack/react-query";
import {
  users,
  dashboard,
  courses,
  certificates,
  progressReport,
  caseStudies,
  playbook,
  resources,
  webinars,
  admin,
} from "@/lib/api/endpoints";
import { useAuth } from "@/lib/stores/auth";
import { qk } from "./queryKeys";

/** True once a token exists — gate authenticated queries on this. */
function useIsAuthed() {
  return useAuth((s) => !!s.token);
}

// ── Authenticated (require a session) ──────────────────────────────

export function useMe() {
  const authed = useIsAuthed();
  return useQuery({ queryKey: qk.me, queryFn: () => users.me(), enabled: authed });
}

export function usePreferences() {
  const authed = useIsAuthed();
  return useQuery({ queryKey: qk.preferences, queryFn: () => users.preferences(), enabled: authed });
}

export function useDashboard() {
  const authed = useIsAuthed();
  return useQuery({ queryKey: qk.dashboard, queryFn: () => dashboard.get(), enabled: authed });
}

export function useProgressReport() {
  const authed = useIsAuthed();
  return useQuery({ queryKey: qk.progressReport, queryFn: () => progressReport.get(), enabled: authed });
}

export function useCertificates() {
  const authed = useIsAuthed();
  return useQuery({ queryKey: qk.certificates, queryFn: () => certificates.list(), enabled: authed });
}

// ── Public / content (no auth required) ────────────────────────────

export function useCourses() {
  return useQuery({ queryKey: qk.courses, queryFn: () => courses.list() });
}

export function usePlaybook() {
  return useQuery({ queryKey: qk.playbook, queryFn: () => playbook.list() });
}

export function useCaseStudies(filters: Parameters<typeof caseStudies.list>[0] = {}) {
  return useQuery({ queryKey: qk.caseStudies(filters), queryFn: () => caseStudies.list(filters) });
}

export function useCaseStudy(id: string | null) {
  return useQuery({
    queryKey: qk.caseStudy(id ?? ""),
    queryFn: () => caseStudies.get(id as string),
    enabled: !!id,
  });
}

export function useResources(filters: Parameters<typeof resources.list>[0] = {}) {
  return useQuery({ queryKey: qk.resources(filters), queryFn: () => resources.list(filters) });
}

export function useWebinars(type?: Parameters<typeof webinars.list>[0]) {
  return useQuery({ queryKey: qk.webinars(type), queryFn: () => webinars.list(type) });
}

export function useAdminFinalProjects() {
  const authed = useIsAuthed();
  return useQuery({
    queryKey: ["admin", "final-projects"],
    queryFn: () => admin.finalProjects(),
    enabled: authed,
  });
}

/** One-shot certificate verification (manual trigger via refetch/enabled). */
export function useCertificateVerify(id: string | null) {
  return useQuery({
    queryKey: qk.certificateVerify(id ?? ""),
    queryFn: () => certificates.verify(id as string),
    enabled: !!id,
  });
}
