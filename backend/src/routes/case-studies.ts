import { Router } from "express";
import { CaseStudy } from "../models/CaseStudy.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { notFound } from "../utils/errors.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = {};
    if (req.query.topic) filter.topic = req.query.topic;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.industry_key) filter.industry_key = req.query.industry_key;
    if (req.query.featured === "true") filter.featured = true;
    if (req.query.q) filter.$text = { $search: String(req.query.q) };

    const items = await CaseStudy.find(filter).select(
      "slug title org_line industry industry_key topic difficulty featured preview",
    );

    res.json({
      case_studies: items.map((c) => ({
        id: c.slug,
        title: c.title,
        org_line: c.org_line,
        industry: c.industry,
        industry_key: c.industry_key,
        topic: c.topic,
        difficulty: c.difficulty,
        featured: c.featured,
        preview: c.preview,
      })),
    });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const c = await CaseStudy.findOne({ slug: req.params.id });
    if (!c) throw notFound("Case study not found");

    res.json({
      id: c.slug,
      title: c.title,
      org_line: c.org_line,
      industry: c.industry,
      industry_key: c.industry_key,
      topic: c.topic,
      difficulty: c.difficulty,
      featured: c.featured,
      preview: c.preview,
      scenario: c.scenario,
      challenge: c.challenge,
      reflect_questions: c.reflect_questions,
      outcomes: c.outcomes,
      lessons: c.lessons,
      application_questions: c.application_questions,
    });
  }),
);

export default router;
