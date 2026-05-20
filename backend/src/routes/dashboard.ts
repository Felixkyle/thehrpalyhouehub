import { Router } from "express";
import { User } from "../models/User.js";
import { Activity } from "../models/Activity.js";
import { Badge, UserBadge } from "../models/Badge.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { unauthenticated } from "../utils/errors.js";
import { computeUserStats, levelsWithProgress } from "../utils/stats.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.sub;
    const user = await User.findById(userId);
    if (!user || user.deleted_at) throw unauthenticated();

    const [stats, levels, recent, allBadges, earned] = await Promise.all([
      computeUserStats(userId),
      levelsWithProgress(userId),
      Activity.find({ user_id: userId }).sort({ occurred_at: -1 }).limit(10),
      Badge.find(),
      UserBadge.find({ user_id: userId }),
    ]);

    const earnedMap = new Map(earned.map((b) => [b.badge_slug, b.earned_at]));
    const badges = allBadges.map((b) => ({
      id: b.slug,
      name: b.name,
      emoji: b.emoji,
      description: b.description,
      earned: earnedMap.has(b.slug),
      earned_at: earnedMap.get(b.slug) ?? null,
    }));

    res.json({
      user: user.toPublic(),
      stats,
      levels,
      recent_activity: recent.map((a) => ({
        id: String(a._id),
        type: a.type,
        title: a.title,
        context: a.context,
        icon: a.icon,
        occurred_at: a.occurred_at,
      })),
      badges,
    });
  }),
);

export default router;
