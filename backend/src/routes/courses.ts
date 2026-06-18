import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validateBody } from "../middleware/validate.js";
import { levelsWithProgress } from "../utils/stats.js";
import { startLevel, completeItem } from "../utils/progress.js";
import { ApiError } from "../utils/errors.js";
import { uploadFinalProject } from "../utils/upload.js";
import { FinalProject } from "../models/FinalProject.js";
import { Activity } from "../models/Activity.js";

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

// ── Final project (HR Strategy Proposal) ───────────────────────────

// Submit / replace the final project file.
router.post(
  "/final-project",
  uploadFinalProject.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "VALIDATION_ERROR", "No file uploaded");

    const submission = await FinalProject.findOneAndUpdate(
      { user_id: req.user!.sub },
      {
        user_id: req.user!.sub,
        file_url: `/uploads/${req.file.filename}`,
        original_name: req.file.originalname,
        size_bytes: req.file.size,
        mime_type: req.file.mimetype,
        submitted_at: new Date(),
      },
      { upsert: true, new: true },
    );

    await Activity.create({
      user_id: req.user!.sub,
      type: "level_completed",
      title: "Submitted HR Strategy Proposal",
      context: "Final Project",
    });

    res.json({
      ok: true,
      submission: {
        original_name: submission.original_name,
        file_url: submission.file_url,
        submitted_at: submission.submitted_at,
      },
    });
  }),
);

// Get the user's current final-project submission (if any).
router.get(
  "/final-project",
  asyncHandler(async (req, res) => {
    const submission = await FinalProject.findOne({ user_id: req.user!.sub });
    res.json({
      submission: submission
        ? {
            original_name: submission.original_name,
            file_url: submission.file_url,
            submitted_at: submission.submitted_at,
          }
        : null,
    });
  }),
);

export default router;
