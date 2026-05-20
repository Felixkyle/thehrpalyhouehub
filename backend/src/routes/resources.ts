import { Router } from "express";
import { z } from "zod";
import { Resource } from "../models/Resource.js";
import { Enquiry } from "../models/Enquiry.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { notFound } from "../utils/errors.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.q) filter.$text = { $search: String(req.query.q) };

    const items = await Resource.find(filter);
    res.json({
      resources: items.map((r) => ({
        id: r.slug,
        category: r.category,
        type_tag: r.type_tag,
        title: r.title,
        description: r.description,
        long_description: r.long_description,
        year: r.year,
        pages: r.pages,
        format: r.format,
        jurisdictions: r.jurisdictions,
        tags: r.tags,
        is_new: r.is_new,
        is_featured: r.is_featured,
        download_url: r.download_url,
        open_url: r.open_url,
        contents: r.contents,
        icon: r.icon,
      })),
    });
  }),
);

router.get(
  "/:id/download",
  asyncHandler(async (req, res) => {
    const r = await Resource.findOne({ slug: req.params.id });
    if (!r || !r.download_url) throw notFound("Resource not available for download");
    await Resource.updateOne({ _id: r._id }, { $inc: { download_count: 1 } });
    res.redirect(r.download_url);
  }),
);

const submitSchema = z.object({
  submitter_name: z.string().min(1),
  submitter_email: z.string().email(),
  resource_title: z.string().min(1),
  resource_description: z.string().min(1),
  resource_url: z.string().url().optional(),
});

router.post(
  "/submit",
  validateBody(submitSchema),
  asyncHandler(async (req, res) => {
    const b = req.body as z.infer<typeof submitSchema>;
    await Enquiry.create({
      kind: "resource_submit",
      name: b.submitter_name,
      email: b.submitter_email,
      message: `${b.resource_title}\n\n${b.resource_description}\n\nURL: ${b.resource_url ?? "n/a"}`,
    });
    res.json({ ok: true });
  }),
);

export default router;
