import { Router } from "express";
import { z } from "zod";
import { SentEmail } from "../models/SentEmail.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();
router.use(requireAuth, requireAdmin);

const sendSchema = z
  .object({
    template: z.enum(["announce", "complete", "nudge", "programme"]),
    recipient: z.object({
      first_name: z.string().min(1),
      last_name: z.string().default(""),
      email: z.string().email(),
    }),
    context: z
      .object({
        level: z.number().int().min(1).max(4).nullable().optional(),
        progress_state: z.string().nullable().optional(),
        personal_note: z.string().optional(),
      })
      .default({}),
  })
  .superRefine((v, ctx) => {
    if (v.template === "complete" && !v.context.level) {
      ctx.addIssue({ code: "custom", message: "level required for complete template", path: ["context", "level"] });
    }
    if (v.template === "nudge" && !v.context.progress_state) {
      ctx.addIssue({
        code: "custom",
        message: "progress_state required for nudge template",
        path: ["context", "progress_state"],
      });
    }
  });

router.post(
  "/send",
  validateBody(sendSchema),
  asyncHandler(async (req, res) => {
    const b = req.body as z.infer<typeof sendSchema>;
    // TODO: send via real mail provider (Resend/SendGrid/etc.)
    console.log(`[dev] would send template "${b.template}" to ${b.recipient.email}`);

    const record = await SentEmail.create({
      template: b.template,
      recipient_email: b.recipient.email,
      recipient_name: `${b.recipient.first_name} ${b.recipient.last_name}`.trim(),
      sent_by: req.user!.sub as any,
      context: b.context,
      message_id: null,
    });

    res.json({ ok: true, sent_at: (record as any).sent_at, message_id: null });
  }),
);

router.get(
  "/log",
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    const offset = Number(req.query.offset ?? 0);

    const [items, total] = await Promise.all([
      SentEmail.find().sort({ sent_at: -1 }).skip(offset).limit(limit),
      SentEmail.countDocuments(),
    ]);

    res.json({
      data: items.map((e) => ({
        id: String(e._id),
        template: e.template,
        recipient_email: e.recipient_email,
        recipient_name: e.recipient_name,
        sent_by: String(e.sent_by),
        sent_at: (e as any).sent_at,
      })),
      pagination: { total, limit, offset },
    });
  }),
);

export default router;
