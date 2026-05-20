import { Router } from "express";
import { User } from "../models/User.js";
import { Activity } from "../models/Activity.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { unauthenticated } from "../utils/errors.js";
import { computeUserStats, levelsWithProgress, userCertificates } from "../utils/stats.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.sub;
    const user = await User.findById(userId);
    if (!user || user.deleted_at) throw unauthenticated();

    const [stats, levels, certificates, timelineDocs] = await Promise.all([
      computeUserStats(userId),
      levelsWithProgress(userId),
      userCertificates(userId, `${user.first_name} ${user.last_name}`),
      Activity.find({
        user_id: userId,
        type: { $in: ["level_completed", "badge_earned"] },
      })
        .sort({ occurred_at: -1 })
        .limit(20),
    ]);

    res.json({
      user: user.toPublic(),
      stats,
      levels,
      certificates,
      timeline: timelineDocs.map((a) => ({
        title: a.title,
        occurred_at: a.occurred_at,
        hours: a.hours,
        context: a.context,
      })),
      report_generated_at: new Date(),
    });
  }),
);

export default router;
