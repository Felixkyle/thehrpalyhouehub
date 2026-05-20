import { Progress } from "../models/Course.js";
import { UserBadge } from "../models/Badge.js";
import { Activity } from "../models/Activity.js";
import { Certificate } from "../models/Certificate.js";

export async function computeUserStats(userId: string) {
  const [progress, badges, casesRead] = await Promise.all([
    Progress.find({ user_id: userId }).sort({ level_number: 1 }),
    UserBadge.countDocuments({ user_id: userId }),
    Activity.countDocuments({ user_id: userId, type: "case_read" }),
  ]);

  const completed = progress.filter((p) => p.progress_percent >= 100).length;
  const current = progress.find((p) => p.progress_percent < 100);
  const totalHours = progress.reduce((s, p) => s + (p.hours_logged || 0), 0);

  return {
    levels_completed: completed,
    current_level: current?.level_number ?? 1,
    current_level_progress: current ? Math.round(current.progress_percent) : 100,
    badges_earned: badges,
    courses_count: progress.length,
    cases_read: casesRead,
    cpd_hours: Math.round(totalHours * 10) / 10,
  };
}

export async function levelsWithProgress(userId: string) {
  const { Course } = await import("../models/Course.js");
  const [courses, progress] = await Promise.all([
    Course.find().sort({ level_number: 1 }),
    Progress.find({ user_id: userId }),
  ]);

  const progMap = new Map(progress.map((p) => [p.level_number, p]));

  return courses.map((c) => {
    const p = progMap.get(c.level_number);
    const tStatus = (p?.topic_status as Record<string, string>) || {};
    const csStatus = (p?.case_study_status as Record<string, string>) || {};
    const gStatus = (p?.game_status as Record<string, string>) || {};

    return {
      id: String(c._id),
      level_number: c.level_number,
      title: c.title,
      course_name: c.course_name,
      description: c.description,
      estimated_hours: c.estimated_hours,
      progress_percent: p ? Math.round(p.progress_percent) : 0,
      status: p?.status ?? (c.level_number === 1 ? "current" : "locked"),
      started_at: p?.started_at ?? null,
      completed_at: p?.completed_at ?? null,
      topics: c.topics.map((t) => ({ id: t.id, name: t.name, status: tStatus[t.id] ?? "locked" })),
      case_studies: c.case_studies.map((t) => ({ id: t.id, name: t.name, status: csStatus[t.id] ?? "locked" })),
      games: c.games.map((t) => ({ id: t.id, name: t.name, status: gStatus[t.id] ?? "locked" })),
    };
  });
}

export async function userCertificates(userId: string, learnerName: string) {
  const earned = await Certificate.find({ user_id: userId });
  const earnedMap = new Map(earned.map((c) => [String(c.level), c]));

  const all: Array<1 | 2 | 3 | 4 | "full"> = [1, 2, 3, 4, "full"];
  return all.map((level) => {
    const c = earnedMap.get(String(level));
    if (c) {
      return {
        id: c.certificate_id,
        level: c.level,
        title: c.title,
        course_name: c.course_name,
        description: c.description,
        badge_emoji: c.badge_emoji,
        learner_name: c.learner_name,
        issued_at: c.issued_at,
        signer_name: c.signer_name,
        signer_role: c.signer_role,
        status: "earned",
        pdf_url: c.pdf_url,
      };
    }
    return {
      id: null,
      level,
      title: level === "full" ? "Full Programme Certificate" : `Level ${level} Certificate`,
      course_name: "",
      description: "",
      badge_emoji: "🔒",
      learner_name: learnerName,
      issued_at: null,
      signer_name: "Dr. Marvellous Gberevbie",
      signer_role: "Programme Director",
      status: "locked",
      pdf_url: null,
    };
  });
}
