import { Schema, model, models, Model } from "mongoose";
import { Variable as IVariable } from "@/types";

const VariableSchema = new Schema<IVariable>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for backward compatibility with existing data
      index: true,
    },
    key: { type: String, required: true },
    value: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  },
);

// Add compound unique index for userId + key (each user can have their own variables)
VariableSchema.index({ userId: 1, key: 1 }, { unique: true });
VariableSchema.index({ userId: 1, createdAt: -1 });

// Model (safe for hot reloads)
const VariableModel: Model<IVariable> =
  (models?.Variable as Model<IVariable>) ||
  model<IVariable>("Variable", VariableSchema);

export default VariableModel;
