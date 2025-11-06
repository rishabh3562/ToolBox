import { Schema, model, models, Model } from "mongoose";
import { Profile as IProfile, FavoriteContent } from "@/types/profile";

// Subschema
const FavoriteContentSchema = new Schema<FavoriteContent>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: {
    type: String,
    enum: ["video", "post", "article", "tweet", "reel"],
    required: true,
  },
  description: { type: String },
  addedAt: { type: String, required: true },
});

// Main schema
const ProfileSchema = new Schema<IProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for backward compatibility with existing data
    index: true,
  },
  name: { type: String, required: true },
  handle: { type: String, required: true },
  platform: {
    type: String,
    enum: ["youtube", "linkedin", "instagram", "twitter", "github", "medium"],
    required: true,
  },
  imageUrl: { type: String },
  description: { type: String, required: true },
  categories: [{ type: String }],
  favoriteContent: [FavoriteContentSchema],
  url: { type: String, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

// Add indexes for efficient querying
ProfileSchema.index({ userId: 1, createdAt: -1 });
ProfileSchema.index({ userId: 1, platform: 1 });

// Model (safe for Next.js dev reloads)
const ProfileModel: Model<IProfile> =
  (models?.Profile as Model<IProfile>) ||
  model<IProfile>("Profile", ProfileSchema);

export default ProfileModel;
