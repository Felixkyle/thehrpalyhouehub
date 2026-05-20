import { Schema, Types, model } from "mongoose";

export interface IActivity {
  user_id: Types.ObjectId;
  type: "topic_completed" | "case_read" | "game_completed" | "level_completed" | "badge_earned";
  title: string;
  context: string;
  icon: string | null;
  hours: number | null;
  occurred_at: Date;
}

const activitySchema = new Schema<IActivity>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  context: { type: String, default: "" },
  icon: { type: String, default: null },
  hours: { type: Number, default: null },
  occurred_at: { type: Date, default: Date.now, index: true },
});

export const Activity = model<IActivity>("Activity", activitySchema);
