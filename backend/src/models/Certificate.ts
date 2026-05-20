import { Schema, Types, model } from "mongoose";

export interface ICertificate {
  certificate_id: string;
  user_id: Types.ObjectId;
  level: 1 | 2 | 3 | 4 | "full";
  title: string;
  course_name: string;
  description: string;
  badge_emoji: string;
  learner_name: string;
  issued_at: Date;
  signer_name: string;
  signer_role: string;
  pdf_url: string | null;
}

const certSchema = new Schema<ICertificate>(
  {
    certificate_id: { type: String, required: true, unique: true, index: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    level: { type: Schema.Types.Mixed, required: true },
    title: { type: String, required: true },
    course_name: { type: String, required: true },
    description: { type: String, default: "" },
    badge_emoji: { type: String, default: "🥇" },
    learner_name: { type: String, required: true },
    issued_at: { type: Date, default: Date.now },
    signer_name: { type: String, default: "Dr. Marvellous Gberevbie" },
    signer_role: { type: String, default: "Programme Director" },
    pdf_url: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const Certificate = model<ICertificate>("Certificate", certSchema);
