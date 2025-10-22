import { Schema, model, models, Model } from "mongoose";
import { Variable as IVariable } from "@/types";

const VariableSchema = new Schema<IVariable>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  },
);

// Model (safe for hot reloads)
const VariableModel: Model<IVariable> =
  (models?.Variable as Model<IVariable>) ||
  model<IVariable>("Variable", VariableSchema);

export default VariableModel;
