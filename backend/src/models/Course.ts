import { Schema, Types, model, type Model } from "mongoose";

export interface ICourse {
  level_number: 1 | 2 | 3 | 4;
  title: string;
  course_name: string;
  description: string;
  estimated_hours: number;
  topics: { id: string; name: string }[];
  case_studies: { id: string; name: string }[];
  games: { id: string; name: string }[];
}

const itemSchema = new Schema(
  { id: { type: String, required: true }, name: { type: String, required: true } },
  { _id: false },
);

const courseSchema = new Schema<ICourse>(
  {
    level_number: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    course_name: { type: String, required: true },
    description: { type: String, required: true },
    estimated_hours: { type: Number, required: true },
    topics: [itemSchema],
    case_studies: [itemSchema],
    games: [itemSchema],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const Course = model<ICourse>("Course", courseSchema);

export interface IProgress {
  user_id: Types.ObjectId;
  level_number: number;
  progress_percent: number;
  status: "complete" | "current" | "locked";
  started_at: Date | null;
  completed_at: Date | null;
  topic_status: Record<string, "complete" | "current" | "locked">;
  case_study_status: Record<string, "complete" | "current" | "locked">;
  game_status: Record<string, "complete" | "current" | "locked">;
  hours_logged: number;
}

const progressSchema = new Schema<IProgress>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    level_number: { type: Number, required: true },
    progress_percent: { type: Number, default: 0 },
    status: { type: String, enum: ["complete", "current", "locked"], default: "locked" },
    started_at: { type: Date, default: null },
    completed_at: { type: Date, default: null },
    topic_status: { type: Schema.Types.Mixed, default: {} },
    case_study_status: { type: Schema.Types.Mixed, default: {} },
    game_status: { type: Schema.Types.Mixed, default: {} },
    hours_logged: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

progressSchema.index({ user_id: 1, level_number: 1 }, { unique: true });

export const Progress = model<IProgress>("Progress", progressSchema);
