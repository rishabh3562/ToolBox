import mongoose, { Schema, model, models, Model } from "mongoose";
import { Template as ITemplate } from "@/types";

// Avoid model overwrite error in dev
const TemplateSchema = new Schema<ITemplate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for backward compatibility with existing data
      index: true,
    },
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
    },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
);

// Add indexes for efficient querying
TemplateSchema.index({ userId: 1, createdAt: -1 });
TemplateSchema.index({ userId: 1, category: 1 });
TemplateSchema.index({ tags: 1 });

// Ensure mongoose.models exists
const TemplateModel: Model<ITemplate> =
  (mongoose.models?.Template as Model<ITemplate>) ||
  model<ITemplate>("Template", TemplateSchema);

export default TemplateModel;
