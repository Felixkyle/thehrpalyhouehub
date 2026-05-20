import { Schema, Types, model } from "mongoose";

export interface ISentEmail {
  template: "announce" | "complete" | "nudge" | "programme";
  recipient_email: string;
  recipient_name: string;
  sent_by: Types.ObjectId;
  context: Record<string, unknown>;
  message_id: string | null;
}

const sentEmailSchema = new Schema<ISentEmail>(
  {
    template: { type: String, required: true },
    recipient_email: { type: String, required: true },
    recipient_name: { type: String, required: true },
    sent_by: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    context: { type: Schema.Types.Mixed, default: {} },
    message_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "sent_at", updatedAt: false } },
);

export const SentEmail = model<ISentEmail>("SentEmail", sentEmailSchema);
