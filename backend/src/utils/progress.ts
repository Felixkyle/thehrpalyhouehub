import { Course, Progress } from "../models/Course.js";
import { Certificate } from "../models/Certificate.js";
import { Activity } from "../models/Activity.js";
import { UserBadge } from "../models/Badge.js";
import { User } from "../models/User.js";

type ItemKind = "topic" | "case_study" | "game";

const STATUS_FIELD: Record<ItemKind, "topic_status" | "case_study_status" | "game_status"> = {
  topic: "topic_status",
  case_study: "case_study_status",
  game: "game_status",
};

const CERT_META: Record<number, { title: string; emoji: string }> = {
  1: { title: "HR Foundations", emoji: "🏅" },
  2: { title: "Operational HR", emoji: "🏅" },
  3: { title: "Strategic HR", emoji: "🏅" },
  4: { title: "Future-Forward HR", emoji: "🏅" },
};

/** Ensure a Progress row exists for (user, level); returns it. */
async function getOrCreateProgress(userId: string, level: number) {
  let p = await Progress.findOne({ user_id: userId, level_number: level });
  if (!p) {
    p = await Progress.create({
      user_id: userId,
      level_number: level,
      status: level === 1 ? "current" : "locked",
      progress_percent: 0,
    });
  }
  return p;
}

/** Mark a level as started ("current") for the user. Level 1 is always allowed;
 *  higher levels require the previous level complete. */
export async function startLevel(userId: string, level: number) {
  const course = await Course.findOne({ level_number: level as 1 | 2 | 3 | 4 });
  if (!course) throw new Error("Course level not found");

  if (level > 1) {
    const prev = await Progress.findOne({ user_id: userId, level_number: level - 1 });
    if (!prev || prev.status !== "complete") {
      const err = new Error(`Complete Level ${level - 1} first`);
      (err as Error & { code?: string }).code = "LOCKED";
      throw err;
    }
  }

  const p = await getOrCreateProgress(userId, level);
  if (p.status === "locked") p.status = "current";
  if (!p.started_at) p.started_at = new Date();
  await p.save();
  return p;
}

/** Mark a single item (topic/case_study/game) complete, recompute the level's
 *  percent, and cascade unlocks + certificates when the level hits 100%. */
export async function completeItem(
  userId: string,
  level: number,
  kind: ItemKind,
  itemId: string,
) {
  const course = await Course.findOne({ level_number: level as 1 | 2 | 3 | 4 });
  if (!course) throw new Error("Course level not found");

  const p = await getOrCreateProgress(userId, level);
  if (p.status === "locked") p.status = "current";
  if (!p.started_at) p.started_at = new Date();

  const field = STATUS_FIELD[kind];
  const statusMap = { ...(p[field] as Record<string, string>) };
  const wasComplete = statusMap[itemId] === "complete";
  statusMap[itemId] = "complete";
  p.set(field, statusMap);

  // Recompute percent across all items in the level.
  const allItems = [
    ...course.topics.map((t) => ["topic_status", t.id] as const),
    ...course.case_studies.map((c) => ["case_study_status", c.id] as const),
    ...course.games.map((g) => ["game_status", g.id] as const),
  ];
  const completed = allItems.filter(([f, id]) => (p[f] as Record<string, string>)[id] === "complete").length;
  p.progress_percent = allItems.length ? Math.round((completed / allItems.length) * 100) : 0;

  if (!wasComplete) {
    const itemName =
      kind === "topic"
        ? course.topics.find((t) => t.id === itemId)?.name
        : kind === "case_study"
          ? course.case_studies.find((c) => c.id === itemId)?.name
          : course.games.find((g) => g.id === itemId)?.name;
    await Activity.create({
      user_id: userId,
      type: kind === "topic" ? "topic_completed" : kind === "case_study" ? "case_read" : "game_completed",
      title: itemName ?? "Item completed",
      context: course.course_name,
    });
  }

  const justCompletedLevel = p.progress_percent >= 100 && p.status !== "complete";
  if (justCompletedLevel) {
    p.status = "complete";
    p.completed_at = new Date();
  }
  await p.save();

  if (justCompletedLevel) {
    await onLevelComplete(userId, level, course.course_name);
  }

  return p;
}

/** When a level is completed: log it, issue the level certificate, unlock the
 *  next level, and issue the full-programme certificate if all 4 are done. */
async function onLevelComplete(userId: string, level: number, courseName: string) {
  await Activity.create({
    user_id: userId,
    type: "level_completed",
    title: `Completed ${courseName}`,
    context: "Level complete",
  });

  await issueCertificate(userId, level as 1 | 2 | 3 | 4);
  await awardBadge(userId, `level-${level}`);

  // Unlock the next level (create it as "current" if it isn't already).
  const next = await Course.findOne({ level_number: (level + 1) as 1 | 2 | 3 | 4 });
  if (next) {
    const np = await getOrCreateProgress(userId, level + 1);
    if (np.status === "locked") {
      np.status = "current";
      await np.save();
    }
  }

  // Full-programme certificate + badge once all 4 levels are complete.
  const completedCount = await Progress.countDocuments({ user_id: userId, status: "complete" });
  if (completedCount >= 4) {
    await issueCertificate(userId, "full" as const);
    await awardBadge(userId, "full-programme");
  }
}

/** Award a badge to the user (idempotent — the unique (user, slug) index plus
 *  the existence check make re-completion a no-op). Slugs match the catalog
 *  seeded in scripts/seed-courses.ts. */
async function awardBadge(userId: string, slug: string) {
  const existing = await UserBadge.findOne({ user_id: userId, badge_slug: slug });
  if (existing) return existing;
  return UserBadge.create({ user_id: userId, badge_slug: slug });
}

async function issueCertificate(userId: string, level: 1 | 2 | 3 | 4 | "full") {
  const existing = await Certificate.findOne({ user_id: userId, level });
  if (existing) return existing;

  const user = await User.findById(userId);
  const learnerName = user ? `${user.first_name} ${user.last_name}`.trim() : "Learner";

  const isFull = level === "full";
  const meta = isFull ? null : CERT_META[level as number];

  return Certificate.create({
    certificate_id: `CERT-${level}-${userId}-${Date.now().toString(36)}`,
    user_id: userId,
    level,
    title: isFull ? "HR Playhouse Hub — Full Programme Certificate" : `Level ${level} — ${meta!.title}`,
    course_name: isFull ? "Professional Development Programme" : `Level ${level} — ${meta!.title}`,
    description: isFull
      ? "Awarded on completion of all four levels and the final HR Strategy Proposal."
      : `Awarded on completion of Level ${level}.`,
    badge_emoji: isFull ? "🏆" : meta!.emoji,
    learner_name: learnerName,
  });
}
