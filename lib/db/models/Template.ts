import mongoose, { Schema, model, models, Model } from "mongoose";
import { Template as ITemplate } from "@/types";

// Avoid model overwrite error in dev
const TemplateSchema = new Schema<ITemplate>(
  {
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
  }
);

// Ensure mongoose.models exists
const TemplateModel: Model<ITemplate> =
  (mongoose.models?.Template as Model<ITemplate>) ||
  model<ITemplate>("Template", TemplateSchema);

export default TemplateModel;
