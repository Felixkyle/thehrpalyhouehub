import { Router } from "express";
import path from "node:path";
import { PlaybookEntry } from "../models/PlaybookEntry.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { notFound } from "../utils/errors.js";
import { UPLOAD_DIR } from "../utils/upload.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const entries = await PlaybookEntry.find();
    res.set("Cache-Control", "public, max-age=300");
    res.json({
      entries: entries.map((e) => ({
        id: e.slug,
        title: e.title,
        category: e.category,
        icon: e.icon,
        summary: e.summary,
        pills: e.pills,
        steps: e.steps,
        templates: e.templates,
        do_list: e.do_list,
        dont_list: e.dont_list,
        legal: e.legal,
        manager_guidance: e.manager_guidance,
        hr_guidance: e.hr_guidance,
        escalation_flags: e.escalation_flags,
        checklist_url: e.checklist_url,
      })),
    });
  }),
);

router.get(
  "/:id/checklist",
  asyncHandler(async (req, res) => {
    const e = await PlaybookEntry.findOne({ slug: req.params.id });
    if (!e || !e.checklist_url) throw notFound("Checklist not available");
    res.redirect(e.checklist_url);
  }),
);

export { UPLOAD_DIR };
export default router;
