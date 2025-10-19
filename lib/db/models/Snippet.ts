import { Schema, model, models, Model } from "mongoose";
import { Snippet as ISnippet } from "@/types/snippet";

const SnippetSchema = new Schema<ISnippet>({
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

const SnippetModel: Model<ISnippet> =
  (models?.Snippet as Model<ISnippet>) ||
  model<ISnippet>("Snippet", SnippetSchema);

export default SnippetModel;
