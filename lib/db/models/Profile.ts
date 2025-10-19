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

// Model (safe for Next.js dev reloads)
const ProfileModel: Model<IProfile> =
  (models?.Profile as Model<IProfile>) ||
  model<IProfile>("Profile", ProfileSchema);

export default ProfileModel;
