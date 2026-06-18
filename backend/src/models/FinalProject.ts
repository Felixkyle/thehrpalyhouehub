import { Schema, Types, model } from "mongoose";

export interface IFinalProject {
  user_id: Types.ObjectId;
  file_url: string;
  original_name: string;
  size_bytes: number;
  mime_type: string;
  submitted_at: Date;
}

const finalProjectSchema = new Schema<IFinalProject>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    file_url: { type: String, required: true },
    original_name: { type: String, required: true },
    size_bytes: { type: Number, required: true },
    mime_type: { type: String, required: true },
    submitted_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const FinalProject = model<IFinalProject>("FinalProject", finalProjectSchema);
