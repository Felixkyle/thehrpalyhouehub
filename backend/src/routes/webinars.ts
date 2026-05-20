import { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { Webinar, WebinarRegistration } from "../models/Webinar.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { conflict, notFound, unauthenticated } from "../utils/errors.js";

const router = Router();
router.use(requireAuth);

async function serializeWebinar(w: any, userId: string) {
  const [registeredCount, myReg] = await Promise.all([
    WebinarRegistration.countDocuments({ webinar_id: w._id }),
    WebinarRegistration.findOne({ webinar_id: w._id, user_id: userId }),
  ]);

  return {
    id: String(w._id),
    type: w.type,
    is_free: w.is_free,
    title: w.title,
    description: w.description,
    scheduled_at: w.scheduled_at,
    duration_minutes: w.duration_minutes,
    platform: w.platform,
    speaker_name: w.speaker_name,
    speaker_role: w.speaker_role,
    meeting_link: myReg ? w.meeting_link : null,
    recording_url: w.type === "recorded" ? w.recording_url : null,
    registered_count: registeredCount,
    is_registered: !!myReg,
    order: w.order,
  };
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = {};
    if (req.query.type) filter.type = req.query.type;

    const webinars = await Webinar.find(filter).sort({ order: 1, scheduled_at: 1 });
    const out = await Promise.all(webinars.map((w) => serializeWebinar(w, req.user!.sub)));
    res.json({ webinars: out });
  }),
);

const registerSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  organisation: z.string().optional(),
  hr_level: z.string().optional(),
});

router.post(
  "/:id/register",
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const b = req.body as z.infer<typeof registerSchema>;
    if (!mongoose.isValidObjectId(req.params.id)) throw notFound("Webinar not found");

    const [webinar, user] = await Promise.all([
      Webinar.findById(req.params.id),
      User.findById(req.user!.sub),
    ]);
    if (!webinar) throw notFound("Webinar not found");
    if (!user || user.deleted_at) throw unauthenticated();

    const existing = await WebinarRegistration.findOne({ webinar_id: webinar._id, user_id: user._id });
    if (existing) throw conflict("Already registered for this webinar");

    await WebinarRegistration.create({
      webinar_id: webinar._id,
      user_id: user._id,
      first_name: b.first_name ?? user.first_name,
      last_name: b.last_name ?? user.last_name,
      email: b.email ?? user.email,
      organisation: b.organisation ?? user.organisation ?? null,
      hr_level: b.hr_level ?? user.role,
    });

    const serialized = await serializeWebinar(webinar, req.user!.sub);
    res.json({ ok: true, webinar: serialized });
  }),
);

router.delete(
  "/:id/register",
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw notFound("Webinar not found");
    await WebinarRegistration.deleteOne({ webinar_id: req.params.id, user_id: req.user!.sub });
    res.json({ ok: true });
  }),
);

const adminCreateSchema = z.object({
  type: z.enum(["live", "recorded", "upcoming"]),
  is_free: z.boolean().default(true),
  title: z.string().min(1).max(120),
  description: z.string().max(300),
  scheduled_at: z.string().datetime().nullable().optional(),
  duration_minutes: z.number().int().positive().default(60),
  platform: z.string().default("Zoom"),
  speaker_name: z.string().nullable().optional(),
  speaker_role: z.string().nullable().optional(),
  meeting_link: z.string().url().nullable().optional(),
  recording_url: z.string().url().nullable().optional(),
  order: z.number().int().default(0),
});

router.post(
  "/admin",
  requireAdmin,
  validateBody(adminCreateSchema),
  asyncHandler(async (req, res) => {
    const b = req.body as z.infer<typeof adminCreateSchema>;
    const w = await Webinar.create({
      ...b,
      scheduled_at: b.scheduled_at ? new Date(b.scheduled_at) : null,
    });
    res.status(201).json({ webinar: await serializeWebinar(w, req.user!.sub) });
  }),
);

router.patch(
  "/admin/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw notFound("Webinar not found");
    const w = await Webinar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!w) throw notFound("Webinar not found");
    res.json({ webinar: await serializeWebinar(w, req.user!.sub) });
  }),
);

router.delete(
  "/admin/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw notFound("Webinar not found");
    await Webinar.findByIdAndDelete(req.params.id);
    await WebinarRegistration.deleteMany({ webinar_id: req.params.id });
    res.json({ ok: true });
  }),
);

router.get(
  "/admin/export",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const webinars = await Webinar.find().sort({ order: 1 });
    res.json({ webinars });
  }),
);

export default router;
