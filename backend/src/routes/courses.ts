import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { levelsWithProgress } from "../utils/stats.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const levels = await levelsWithProgress(req.user!.sub);
    res.json({ levels });
  }),
);

export default router;
