import { Schema, model, models, Model } from "mongoose";
import { Snippet as ISnippet } from "@/types/snippet";

const SnippetSchema = new Schema<ISnippet>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for backward compatibility with existing data
    index: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  tags: [{ type: String }],
  documentation: { type: String },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
});

// Add indexes for efficient querying
SnippetSchema.index({ userId: 1, createdAt: -1 });
SnippetSchema.index({ userId: 1, category: 1, language: 1 });
SnippetSchema.index({ tags: 1 });
SnippetSchema.index({ isPublic: 1 });

const SnippetModel: Model<ISnippet> =
  (models?.Snippet as Model<ISnippet>) ||
  model<ISnippet>("Snippet", SnippetSchema);

export default SnippetModel;
