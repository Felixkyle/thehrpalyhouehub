/**
 * Backfill badges for users who completed levels before badge-awarding existed.
 *
 * Run:  npm run backfill:badges
 *
 * For every completed Progress row it ensures the matching `level-N` badge,
 * and `full-programme` for anyone with all 4 levels complete. Idempotent —
 * skips badges the user already has, so it is safe to re-run.
 */
import { connectDb } from "../db/connect.js";
import { Progress } from "../models/Course.js";
import { UserBadge } from "../models/Badge.js";
import mongoose from "mongoose";

async function ensureBadge(userId: mongoose.Types.ObjectId, slug: string) {
  const existing = await UserBadge.findOne({ user_id: userId, badge_slug: slug });
  if (existing) return false;
  await UserBadge.create({ user_id: userId, badge_slug: slug });
  return true;
}

async function main() {
  await connectDb();

  const completed = await Progress.find({ status: "complete" });
  let awarded = 0;

  // Per-level badges.
  for (const p of completed) {
    if (await ensureBadge(p.user_id, `level-${p.level_number}`)) awarded++;
  }

  // Full-programme badge for users with all 4 levels complete.
  const byUser = new Map<string, number>();
  for (const p of completed) {
    const key = String(p.user_id);
    byUser.set(key, (byUser.get(key) ?? 0) + 1);
  }
  for (const [userId, count] of byUser) {
    if (count >= 4) {
      if (await ensureBadge(new mongoose.Types.ObjectId(userId), "full-programme")) awarded++;
    }
  }

  console.log(`Done. Awarded ${awarded} missing badge(s) across ${byUser.size} user(s).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
