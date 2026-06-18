"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  users,
  enquiries,
  resources,
  webinars,
  ai,
  courses,
} from "@/lib/api/endpoints";
import { useAuth } from "@/lib/stores/auth";
import { qk } from "./queryKeys";
import type { AiMessage } from "@/lib/api/types";

// ── Profile ────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAuth((s) => s.setUser);
  return useMutation({
    mutationFn: (body: Parameters<typeof users.updateMe>[0]) => users.updateMe(body),
    onSuccess: (res) => {
      setUser(res.user);
      qc.invalidateQueries({ queryKey: qk.me });
      qc.invalidateQueries({ queryKey: qk.dashboard });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ current, next }: { current: string; next: string }) =>
      users.changePassword(current, next),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => users.uploadAvatar(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.me }),
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof users.updatePreferences>[0]) =>
      users.updatePreferences(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.preferences }),
  });
}

// ── Enquiry / contact forms (the EmailJS replacements) ─────────────

export function useCpdEnquiry() {
  return useMutation({ mutationFn: (body: Parameters<typeof enquiries.cpd>[0]) => enquiries.cpd(body) });
}

export function usePartnershipEnquiry() {
  return useMutation({ mutationFn: (fd: FormData) => enquiries.partnership(fd) });
}

export function useClockiqEnquiry() {
  return useMutation({ mutationFn: (body: Parameters<typeof enquiries.clockiq>[0]) => enquiries.clockiq(body) });
}

export function useSubmitResource() {
  return useMutation({ mutationFn: (body: Parameters<typeof resources.submit>[0]) => resources.submit(body) });
}

// ── Webinars ───────────────────────────────────────────────────────

export function useRegisterWebinar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof webinars.register>[1] }) =>
      webinars.register(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["webinars"] }),
  });
}

export function useUnregisterWebinar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => webinars.unregister(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["webinars"] }),
  });
}

// ── Courses (start / progress) ─────────────────────────────────────

/** Invalidate everything a progress change can affect. */
function useInvalidateLearning() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: qk.courses });
    qc.invalidateQueries({ queryKey: qk.dashboard });
    qc.invalidateQueries({ queryKey: qk.progressReport });
    qc.invalidateQueries({ queryKey: qk.certificates });
    qc.invalidateQueries({ queryKey: qk.me });
  };
}

export function useStartLevel() {
  const invalidate = useInvalidateLearning();
  return useMutation({
    mutationFn: (level: number) => courses.start(level),
    onSuccess: invalidate,
  });
}

export function useCompleteItem() {
  const invalidate = useInvalidateLearning();
  return useMutation({
    mutationFn: ({ level, kind, itemId }: { level: number; kind: "topic" | "case_study" | "game"; itemId: string }) =>
      courses.complete(level, { kind, item_id: itemId }),
    onSuccess: invalidate,
  });
}

export function useSubmitFinalProject() {
  const invalidate = useInvalidateLearning();
  return useMutation({
    mutationFn: (file: File) => courses.submitFinalProject(file),
    onSuccess: invalidate,
  });
}

// ── AI chat ────────────────────────────────────────────────────────

export function useAiChat() {
  return useMutation({ mutationFn: (messages: AiMessage[]) => ai.chat(messages) });
}
