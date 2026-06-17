import { Router } from "express";
import OpenAI from "openai";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/errors.js";
import { env } from "../config/env.js";

const router = Router();
router.use(requireAuth);

const SYSTEM_PROMPT = `You are the HR Playhouse Hub AI assistant. The user is an HR professional. Give practical, ethical, jurisdiction-aware HR guidance. Keep replies concise and actionable. When relevant, suggest checking with legal counsel for jurisdiction-specific compliance.`;

const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: z.string() }),
  z.object({
    type: z.literal("document"),
    source: z.object({ type: z.literal("base64"), media_type: z.string(), data: z.string() }),
    title: z.string().optional(),
  }),
]);

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.union([z.string(), z.array(contentBlockSchema)]),
});

const chatSchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

let client: OpenAI | null = null;
function getClient(): OpenAI | null {
  if (!env.openaiApiKey) return null;
  if (!client) client = new OpenAI({ apiKey: env.openaiApiKey });
  return client;
}

/** Build an OpenAI chat message from a normalised message. Text blocks pass
 *  through; document blocks become text parts (inline plain text, or a noted
 *  attachment for binary types) so the model has the context. */
function toOpenAIContent(
  content: string | z.infer<typeof contentBlockSchema>[],
): string {
  if (typeof content === "string") return content;

  const parts: string[] = [];
  for (const block of content) {
    if (block.type === "text") {
      parts.push(block.text);
    } else {
      if (!ALLOWED_MIME.includes(block.source.media_type)) {
        throw new ApiError(400, "VALIDATION_ERROR", `Unsupported media type: ${block.source.media_type}`);
      }
      if (block.source.media_type === "text/plain") {
        // Plain text can be decoded and inlined directly.
        const decoded = Buffer.from(block.source.data, "base64").toString("utf-8");
        parts.push(`[Attached document${block.title ? ` "${block.title}"` : ""}]\n${decoded}`);
      } else {
        // Binary docs (pdf/doc) — note the attachment so the model can ask for
        // the relevant text rather than silently ignoring it.
        parts.push(
          `[The user attached a document${block.title ? ` "${block.title}"` : ""} (${block.source.media_type}). Ask them to paste the relevant text if you need its contents.]`,
        );
      }
    }
  }
  return parts.join("\n\n");
}

router.post(
  "/chat",
  validateBody(chatSchema),
  asyncHandler(async (req, res) => {
    const openai = getClient();
    if (!openai) throw new ApiError(502, "AI_UNAVAILABLE", "AI service not configured");

    const { messages } = req.body as z.infer<typeof chatSchema>;

    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role,
        content: toOpenAIContent(m.content),
      })),
    ];

    try {
      const completion = await openai.chat.completions.create({
        model: env.openaiModel,
        messages: openaiMessages,
      });

      const text = completion.choices[0]?.message?.content ?? "";
      if (!text) {
        throw new ApiError(
          502,
          "AI_BLOCKED",
          "This conversation can't be answered automatically — please contact your HR team or our support.",
        );
      }

      res.json({
        message: { role: "assistant", content: [{ type: "text", text }] },
      });
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error("OpenAI error:", err);
      throw new ApiError(502, "AI_UNAVAILABLE", "AI service temporarily unavailable");
    }
  }),
);

export default router;
