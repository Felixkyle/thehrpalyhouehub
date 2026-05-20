import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { badRequest, conflict, unauthenticated } from "../utils/errors.js";
import { uploadAvatar } from "../utils/upload.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.sub);
    if (!user || user.deleted_at) throw unauthenticated();

    res.json({
      user: user.toPublic(),
      stats: {
        levels_completed: 0,
        current_level: 1,
        current_level_progress: 0,
        badges_earned: 0,
        courses_count: 0,
        cases_read: 0,
        cpd_hours: 0,
      },
    });
  }),
);

const patchMeSchema = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  job_title: z.string().nullable().optional(),
  organisation: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  linkedin_url: z.string().url().nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
});

router.patch(
  "/me",
  validateBody(patchMeSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof patchMeSchema>;

    if (body.email) {
      const existing = await User.findOne({ email: body.email.toLowerCase(), _id: { $ne: req.user!.sub } });
      if (existing) throw conflict("That email is already in use", { email: "That email is already in use" });
    }

    const user = await User.findById(req.user!.sub);
    if (!user || user.deleted_at) throw unauthenticated();

    Object.assign(user, body);
    if (body.email) user.email = body.email.toLowerCase();
    await user.save();

    res.json({ user: user.toPublic() });
  }),
);

const changePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8),
});

router.post(
  "/me/password",
  validateBody(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const { current_password, new_password } = req.body as z.infer<typeof changePasswordSchema>;
    const user = await User.findById(req.user!.sub);
    if (!user || user.deleted_at) throw unauthenticated();

    const ok = await user.checkPassword(current_password);
    if (!ok) throw unauthenticated("Current password is incorrect");
    if (current_password === new_password) {
      throw badRequest("New password must be different", { new_password: "Must be different from current" });
    }

    user.password_hash = await User.hashPassword(new_password);
    await user.save();
    res.json({ ok: true });
  }),
);

router.get(
  "/me/preferences",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.sub);
    if (!user || user.deleted_at) throw unauthenticated();
    res.json({ notifications: user.notifications, privacy: user.privacy });
  }),
);

const prefsSchema = z.object({
  notifications: z
    .object({
      course_reminders: z.boolean().optional(),
      completion_emails: z.boolean().optional(),
      webinar_announcements: z.boolean().optional(),
      new_content_emails: z.boolean().optional(),
      lab_activity: z.boolean().optional(),
      platform_updates: z.boolean().optional(),
    })
    .optional(),
  privacy: z
    .object({
      show_profile_in_lab: z.boolean().optional(),
      anonymous_posts: z.boolean().optional(),
      share_progress_with_employer: z.boolean().optional(),
    })
    .optional(),
});

router.patch(
  "/me/preferences",
  validateBody(prefsSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof prefsSchema>;
    const user = await User.findById(req.user!.sub);
    if (!user || user.deleted_at) throw unauthenticated();

    if (body.notifications) Object.assign(user.notifications, body.notifications);
    if (body.privacy) Object.assign(user.privacy, body.privacy);
    await user.save();

    res.json({ notifications: user.notifications, privacy: user.privacy });
  }),
);

router.post(
  "/me/avatar",
  uploadAvatar.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw badRequest("No file uploaded");
    const url = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user!.sub, { avatar_url: url }, { new: true });
    if (!user) throw unauthenticated();
    res.json({ avatar_url: url });
  }),
);

router.delete(
  "/me",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.sub);
    if (!user || user.deleted_at) throw unauthenticated();

    user.deleted_at = new Date();
    await user.save();

    const scheduledFor = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    res.status(202).json({ ok: true, deletion_scheduled_for: scheduledFor });
  }),
);

export default router;
