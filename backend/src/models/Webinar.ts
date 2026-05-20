import { Schema, Types, model } from "mongoose";

export interface IWebinar {
  type: "live" | "recorded" | "upcoming";
  is_free: boolean;
  title: string;
  description: string;
  scheduled_at: Date | null;
  duration_minutes: number;
  platform: string;
  speaker_name: string | null;
  speaker_role: string | null;
  meeting_link: string | null;
  recording_url: string | null;
  order: number;
}

const webinarSchema = new Schema<IWebinar>(
  {
    type: { type: String, enum: ["live", "recorded", "upcoming"], required: true },
    is_free: { type: Boolean, default: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    scheduled_at: { type: Date, default: null },
    duration_minutes: { type: Number, default: 60 },
    platform: { type: String, default: "Zoom" },
    speaker_name: { type: String, default: null },
    speaker_role: { type: String, default: null },
    meeting_link: { type: String, default: null },
    recording_url: { type: String, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const Webinar = model<IWebinar>("Webinar", webinarSchema);

export interface IWebinarRegistration {
  webinar_id: Types.ObjectId;
  user_id: Types.ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  organisation: string | null;
  hr_level: string | null;
}

const regSchema = new Schema<IWebinarRegistration>(
  {
    webinar_id: { type: Schema.Types.ObjectId, ref: "Webinar", required: true, index: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    organisation: { type: String, default: null },
    hr_level: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

regSchema.index({ webinar_id: 1, user_id: 1 }, { unique: true });

export const WebinarRegistration = model<IWebinarRegistration>("WebinarRegistration", regSchema);
