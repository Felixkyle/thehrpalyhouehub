import { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { ForumPost, ForumReply } from "../models/Forum.js";
import { Enquiry } from "../models/Enquiry.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { notFound, unauthenticated } from "../utils/errors.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/posts",
  asyncHandler(async (req, res) => {
    const board = String(req.query.board ?? "") as "new-members" | "ideas" | "feedback" | "mentorship";
    if (!["new-members", "ideas", "feedback", "mentorship"].includes(board)) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid board" } });
      return;
    }
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    const offset = Number(req.query.offset ?? 0);

    const [posts, total] = await Promise.all([
      ForumPost.find({ board }).sort({ pinned: -1, created_at: -1 }).skip(offset).limit(limit),
      ForumPost.countDocuments({ board }),
    ]);

    res.json({
      data: posts.map((p) => ({
        id: String(p._id),
        board: p.board,
        author_name: p.author_name,
        author_id: p.author_id ? String(p.author_id) : null,
        title: p.title,
        body: p.body,
        impact_score: p.impact_score,
        pinned: p.pinned,
        reply_count: p.reply_count,
        created_at: (p as any).created_at,
      })),
      pagination: { total, limit, offset },
    });
  }),
);

router.get(
  "/posts/:id",
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw notFound("Post not found");
    const post = await ForumPost.findById(req.params.id);
    if (!post) throw notFound("Post not found");
    const replies = await ForumReply.find({ post_id: post._id }).sort({ created_at: 1 });

    res.json({
      post: {
        id: String(post._id),
        board: post.board,
        author_name: post.author_name,
        author_id: post.author_id ? String(post.author_id) : null,
        title: post.title,
        body: post.body,
        impact_score: post.impact_score,
        pinned: post.pinned,
        reply_count: post.reply_count,
        created_at: (post as any).created_at,
        replies: replies.map((r) => ({
          id: String(r._id),
          post_id: String(r.post_id),
          author_name: r.author_name,
          body: r.body,
          created_at: (r as any).created_at,
        })),
      },
    });
  }),
);

const newPostSchema = z.object({
  board: z.enum(["new-members", "ideas", "feedback", "mentorship"]),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(10000),
  impact_score: z.number().int().min(0).max(100).optional(),
  anonymous: z.boolean().default(false),
});

router.post(
  "/posts",
  validateBody(newPostSchema),
  asyncHandler(async (req, res) => {
    const b = req.body as z.infer<typeof newPostSchema>;
    const user = await User.findById(req.user!.sub);
    if (!user || user.deleted_at) throw unauthenticated();

    const allowAnon = b.anonymous && user.privacy.anonymous_posts;
    const post = await ForumPost.create({
      board: b.board,
      author_id: allowAnon ? null : user._id,
      author_name: allowAnon ? "Anonymous" : `${user.first_name} ${user.last_name}`,
      title: b.title,
      body: b.body,
      impact_score: b.impact_score ?? null,
      anonymous: allowAnon,
    });

    res.status(201).json({
      post: {
        id: String(post._id),
        board: post.board,
        author_name: post.author_name,
        author_id: post.author_id ? String(post.author_id) : null,
        title: post.title,
        body: post.body,
        impact_score: post.impact_score,
        pinned: post.pinned,
        reply_count: 0,
        created_at: (post as any).created_at,
      },
    });
  }),
);

const replySchema = z.object({ body: z.string().min(1).max(5000) });

router.post(
  "/posts/:id/replies",
  validateBody(replySchema),
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw notFound("Post not found");
    const post = await ForumPost.findById(req.params.id);
    if (!post) throw notFound("Post not found");

    const user = await User.findById(req.user!.sub);
    if (!user || user.deleted_at) throw unauthenticated();

    const reply = await ForumReply.create({
      post_id: post._id,
      author_id: user._id,
      author_name: `${user.first_name} ${user.last_name}`,
      body: req.body.body,
    });

    await ForumPost.updateOne({ _id: post._id }, { $inc: { reply_count: 1 } });

    res.status(201).json({
      reply: {
        id: String(reply._id),
        post_id: String(reply.post_id),
        author_name: reply.author_name,
        body: reply.body,
        created_at: (reply as any).created_at,
      },
    });
  }),
);

const mentorshipSchema = z.object({
  mentor_id: z.string().optional(),
  topic: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  hr_role: z.string().optional(),
});

router.post(
  "/mentorship-request",
  validateBody(mentorshipSchema),
  asyncHandler(async (req, res) => {
    const b = req.body as z.infer<typeof mentorshipSchema>;
    const user = await User.findById(req.user!.sub);
    if (!user || user.deleted_at) throw unauthenticated();

    await Enquiry.create({
      kind: "mentorship",
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      topic: b.topic,
      message: b.message,
      user_id: user._id,
    });

    res.json({ ok: true });
  }),
);

const MENTORS = [
  { id: "m-001", name: "Dr. Marvellous Gberevbie", role: "Programme Director", tags: ["strategy", "leadership"], bio: "" },
  { id: "m-002", name: "Adaeze Okafor", role: "Senior HRBP", tags: ["performance", "deib"], bio: "" },
  { id: "m-003", name: "Chidera Eze", role: "People Operations Lead", tags: ["onboarding", "ops"], bio: "" },
];

router.get("/mentors", (_req, res) => {
  res.json({ mentors: MENTORS });
});

export default router;
