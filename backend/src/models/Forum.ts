import { Schema, Types, model } from "mongoose";

export interface IForumPost {
  board: "new-members" | "ideas" | "feedback" | "mentorship";
  author_id: Types.ObjectId | null;
  author_name: string;
  title: string;
  body: string;
  impact_score: number | null;
  pinned: boolean;
  anonymous: boolean;
  reply_count: number;
}

const postSchema = new Schema<IForumPost>(
  {
    board: {
      type: String,
      enum: ["new-members", "ideas", "feedback", "mentorship"],
      required: true,
      index: true,
    },
    author_id: { type: Schema.Types.ObjectId, ref: "User", default: null },
    author_name: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    impact_score: { type: Number, default: null },
    pinned: { type: Boolean, default: false },
    anonymous: { type: Boolean, default: false },
    reply_count: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const ForumPost = model<IForumPost>("ForumPost", postSchema);

export interface IForumReply {
  post_id: Types.ObjectId;
  author_id: Types.ObjectId;
  author_name: string;
  body: string;
}

const replySchema = new Schema<IForumReply>(
  {
    post_id: { type: Schema.Types.ObjectId, ref: "ForumPost", required: true, index: true },
    author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    author_name: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const ForumReply = model<IForumReply>("ForumReply", replySchema);
