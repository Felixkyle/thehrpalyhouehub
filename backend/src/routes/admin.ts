import { Router } from "express";
import { FinalProject } from "../models/FinalProject.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();
router.use(requireAuth, requireAdmin);

// List every final-project submission with the learner's details + download URL.
router.get(
  "/final-projects",
  asyncHandler(async (_req, res) => {
    const submissions = await FinalProject.find().sort({ submitted_at: -1 }).lean();
    const userIds = submissions.map((s) => s.user_id);
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const userMap = new Map(users.map((u) => [String(u._id), u]));

    const data = submissions.map((s) => {
      const u = userMap.get(String(s.user_id));
      return {
        id: String(s._id),
        learner_name: u ? `${u.first_name} ${u.last_name}`.trim() : "Unknown",
        learner_email: u?.email ?? "",
        original_name: s.original_name,
        file_url: s.file_url,
        size_bytes: s.size_bytes,
        submitted_at: s.submitted_at,
      };
    });

    res.json({ submissions: data });
  }),
);

export default router;
