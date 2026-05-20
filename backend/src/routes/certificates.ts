import { Router } from "express";
import { z } from "zod";
import { Certificate } from "../models/Certificate.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { badRequest, unauthenticated } from "../utils/errors.js";
import { userCertificates } from "../utils/stats.js";

const router = Router();

const CERT_ID_RE = /^HRPH-\d{4}-(L[1-4]|FULL)-\d{5}$/;

router.get(
  "/verify",
  asyncHandler(async (req, res) => {
    const id = String(req.query.id ?? "").trim();
    if (!CERT_ID_RE.test(id)) throw badRequest("Invalid certificate ID format", { id: "Invalid format" });

    const c = await Certificate.findOne({ certificate_id: id });
    if (!c) {
      res.json({ valid: false });
      return;
    }

    res.json({
      valid: true,
      certificate: {
        id: c.certificate_id,
        learner_name: c.learner_name,
        level: c.level,
        course_name: c.course_name,
        description: c.description,
        badge_emoji: c.badge_emoji,
        issued_at: c.issued_at,
        signer_name: c.signer_name,
        signer_role: c.signer_role,
      },
    });
  }),
);

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.sub);
    if (!user || user.deleted_at) throw unauthenticated();
    const certificates = await userCertificates(req.user!.sub, `${user.first_name} ${user.last_name}`);
    res.json({ certificates });
  }),
);

export default router;
