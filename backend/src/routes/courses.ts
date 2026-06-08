import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validateBody } from "../middleware/validate.js";
import { levelsWithProgress } from "../utils/stats.js";
import { startLevel, completeItem } from "../utils/progress.js";
import { ApiError } from "../utils/errors.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const levels = await levelsWithProgress(req.user!.sub);
    res.json({ levels });
  }),
);

function parseLevel(raw: string): number {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 4) {
    throw new ApiError(400, "VALIDATION_ERROR", "Level must be 1–4");
  }
  return n;
}

// Start (enrol in) a level.
router.post(
  "/:level/start",
  asyncHandler(async (req, res) => {
    const level = parseLevel(req.params.level);
    try {
      await startLevel(req.user!.sub, level);
    } catch (err) {
      if ((err as Error & { code?: string }).code === "LOCKED") {
        throw new ApiError(409, "LEVEL_LOCKED", (err as Error).message);
      }
      throw err;
    }
    const levels = await levelsWithProgress(req.user!.sub);
    res.json({ levels });
  }),
);

const completeSchema = z.object({
  kind: z.enum(["topic", "case_study", "game"]),
  item_id: z.string().min(1),
});

// Mark a topic / case study / game within a level complete.
router.post(
  "/:level/complete",
  validateBody(completeSchema),
  asyncHandler(async (req, res) => {
    const level = parseLevel(req.params.level);
    const { kind, item_id } = req.body as z.infer<typeof completeSchema>;
    await completeItem(req.user!.sub, level, kind, item_id);
    const levels = await levelsWithProgress(req.user!.sub);
    res.json({ levels });
  }),
);

export default router;
