import { Router } from "express";
import crypto from "node:crypto";
import { z } from "zod";
import { User } from "../models/User.js";
import { PasswordReset } from "../models/PasswordReset.js";
import { signToken } from "../utils/jwt.js";
import { conflict, notFound, unauthenticated } from "../utils/errors.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validateBody } from "../middleware/validate.js";
import { env } from "../config/env.js";
import { sendPasswordResetEmail, sendSignupConfirmationEmail } from "../utils/email.js";

const router = Router();

const signupSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().min(1),
  country: z.string().optional(),
  how_heard: z.string().optional(),
  consent_accepted: z.literal(true),
});

router.post(
  "/signup",
  validateBody(signupSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as z.infer<typeof signupSchema>;
    const existing = await User.findOne({ email: body.email.toLowerCase() });
    if (existing) {
      throw conflict("An account with this email already exists", {
        email: "An account with this email already exists",
      });
    }

    const password_hash = await User.hashPassword(body.password);
    const user = await User.create({
      email: body.email.toLowerCase(),
      password_hash,
      first_name: body.first_name.trim(),
      last_name: body.last_name.trim(),
      role: body.role,
      country: body.country ?? null,
      how_heard: body.how_heard ?? null,
      consent_accepted_at: new Date(),
    });

    void sendSignupConfirmationEmail(user.email, user.first_name);

    const { token, expiresAt } = signToken({ sub: String(user._id), email: user.email });
    res.status(201).json({ token, expires_at: expiresAt, user: user.toPublic() });
  }),
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as z.infer<typeof loginSchema>;
    const user = await User.findOne({ email: email.toLowerCase(), deleted_at: null });
    if (!user) throw unauthenticated("Invalid email or password");

    const ok = await user.checkPassword(password);
    if (!ok) throw unauthenticated("Invalid email or password");

    const { token, expiresAt } = signToken({ sub: String(user._id), email: user.email });
    res.json({ token, expires_at: expiresAt, user: user.toPublic() });
  }),
);

const resetRequestSchema = z.object({ email: z.string().email() });

router.post(
  "/password-reset/request",
  validateBody(resetRequestSchema),
  asyncHandler(async (req, res) => {
    const { email } = req.body as z.infer<typeof resetRequestSchema>;
    const user = await User.findOne({ email: email.toLowerCase(), deleted_at: null });

    if (user) {
      const raw = crypto.randomBytes(32).toString("hex");
      const token_hash = crypto.createHash("sha256").update(raw).digest("hex");
      await PasswordReset.create({
        user_id: user._id,
        token_hash,
        expires_at: new Date(Date.now() + 60 * 60 * 1000),
      });
      const resetUrl = `${env.frontendUrl}/password-reset/confirm?token=${raw}`;
      void sendPasswordResetEmail(user.email, resetUrl);
    }

    res.json({ ok: true });
  }),
);

const resetConfirmSchema = z.object({
  token: z.string().min(1),
  new_password: z.string().min(8),
});

router.post(
  "/password-reset/confirm",
  validateBody(resetConfirmSchema),
  asyncHandler(async (req, res) => {
    const { token, new_password } = req.body as z.infer<typeof resetConfirmSchema>;
    const token_hash = crypto.createHash("sha256").update(token).digest("hex");

    const record = await PasswordReset.findOne({ token_hash, used_at: null });
    if (!record || record.expires_at < new Date()) {
      throw notFound("This reset link is invalid or has expired.");
    }

    const password_hash = await User.hashPassword(new_password);
    await User.updateOne({ _id: record.user_id }, { $set: { password_hash } });
    record.used_at = new Date();
    await record.save();

    res.json({ ok: true });
  }),
);

export default router;
