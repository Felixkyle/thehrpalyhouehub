import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/errors.js";

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

router.post(
  "/chat",
  validateBody(chatSchema),
  asyncHandler(async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new ApiError(502, "AI_UNAVAILABLE", "AI service not configured");

    const { messages } = req.body as z.infer<typeof chatSchema>;

    const contents = messages.map((m) => {
      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
      if (typeof m.content === "string") {
        parts.push({ text: m.content });
      } else {
        for (const block of m.content) {
          if (block.type === "text") {
            parts.push({ text: block.text });
          } else {
            if (!ALLOWED_MIME.includes(block.source.media_type)) {
              throw new ApiError(400, "VALIDATION_ERROR", `Unsupported media type: ${block.source.media_type}`);
            }
            parts.push({ inlineData: { mimeType: block.source.media_type, data: block.source.data } });
          }
        }
      }
      return { role: m.role === "assistant" ? "model" : "user", parts };
    });

    try {
      const ai = new GoogleGenAI({ apiKey });
      const result = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL ?? "gemini-2.5-pro",
        contents,
        config: { systemInstruction: SYSTEM_PROMPT },
      });

      const text = result.text ?? "";
      if (!text) throw new ApiError(502, "AI_BLOCKED", "This conversation can't be answered automatically — please contact your HR team or our support.");

      res.json({
        message: { role: "assistant", content: [{ type: "text", text }] },
      });
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error("Gemini error:", err);
      throw new ApiError(502, "AI_UNAVAILABLE", "AI service temporarily unavailable");
    }
  }),
);

export default router;
