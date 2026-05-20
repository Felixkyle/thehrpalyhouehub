import { Router } from "express";
import { z } from "zod";
import { Enquiry } from "../models/Enquiry.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { uploadPartnerAttachment } from "../utils/upload.js";

const router = Router();

const cpdSchema = z.object({
  name: z.string().min(1),
  organisation: z.string().min(1),
  email: z.string().email(),
  message: z.string().max(5000).optional().default(""),
});

router.post(
  "/cpd",
  validateBody(cpdSchema),
  asyncHandler(async (req, res) => {
    const b = req.body as z.infer<typeof cpdSchema>;
    await Enquiry.create({
      kind: "cpd",
      name: b.name,
      email: b.email,
      organisation: b.organisation,
      message: b.message,
    });
    res.json({ ok: true });
  }),
);

router.post(
  "/partnership",
  uploadPartnerAttachment.single("attachment"),
  asyncHandler(async (req, res) => {
    const b = req.body;
    const required = ["first_name", "last_name", "job_title", "organisation", "org_type", "email", "track", "message"];
    for (const f of required) {
      if (!b[f]) {
        res.status(400).json({ error: { code: "VALIDATION_ERROR", message: `Missing field: ${f}`, fields: { [f]: "Required" } } });
        return;
      }
    }

    await Enquiry.create({
      kind: "partnership",
      name: `${b.first_name} ${b.last_name}`,
      email: b.email,
      organisation: b.organisation,
      phone: b.phone || null,
      country: b.country || null,
      job_title: b.job_title,
      org_type: b.org_type,
      track: b.track,
      message: b.message,
      attachment_url: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.json({ ok: true });
  }),
);

const clockiqSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  organisation: z.string().optional(),
  team_size: z.string().optional(),
  message: z.string().max(5000).optional().default(""),
});

router.post(
  "/clockiq",
  validateBody(clockiqSchema),
  asyncHandler(async (req, res) => {
    const b = req.body as z.infer<typeof clockiqSchema>;
    await Enquiry.create({
      kind: "clockiq",
      name: b.name,
      email: b.email,
      organisation: b.organisation ?? null,
      message: `[Team size: ${b.team_size ?? "n/a"}]\n\n${b.message}`,
    });
    res.json({ ok: true });
  }),
);

export default router;
