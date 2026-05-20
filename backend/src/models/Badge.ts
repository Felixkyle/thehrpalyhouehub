import { Schema, Types, model } from "mongoose";

export interface IBadge {
  slug: string;
  name: string;
  emoji: string;
  description: string;
}

const badgeSchema = new Schema<IBadge>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  emoji: { type: String, required: true },
  description: { type: String, default: "" },
});

export const Badge = model<IBadge>("Badge", badgeSchema);

export interface IUserBadge {
  user_id: Types.ObjectId;
  badge_slug: string;
  earned_at: Date;
}

const userBadgeSchema = new Schema<IUserBadge>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  badge_slug: { type: String, required: true },
  earned_at: { type: Date, default: Date.now },
});

userBadgeSchema.index({ user_id: 1, badge_slug: 1 }, { unique: true });

export const UserBadge = model<IUserBadge>("UserBadge", userBadgeSchema);
