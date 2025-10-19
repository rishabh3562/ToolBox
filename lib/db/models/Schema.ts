import { Schema as MongooseSchema, model, models, Model } from "mongoose";
import {
  Schema as ISchema,
  Table,
  Field,
  Index,
  ForeignKey,
} from "@/types/schema";

// Subschemas
const FieldSchema = new MongooseSchema<Field>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  length: { type: Number },
  nullable: { type: Boolean, default: true },
  defaultValue: { type: String },
  primaryKey: { type: Boolean, default: false },
  autoIncrement: { type: Boolean, default: false },
  unique: { type: Boolean, default: false },
  description: { type: String },
});

const IndexSchema = new MongooseSchema<Index>({
  name: { type: String, required: true },
  fields: [{ type: String }],
  type: {
    type: String,
    enum: ["UNIQUE", "FULLTEXT", "SPATIAL"],
  },
});

const ForeignKeySchema = new MongooseSchema<ForeignKey>({
  name: { type: String, required: true },
  fields: [{ type: String }],
  references: {
    table: { type: String, required: true },
    fields: [{ type: String }],
  },
  onDelete: {
    type: String,
    enum: ["CASCADE", "SET NULL", "RESTRICT", "NO ACTION"],
  },
  onUpdate: {
    type: String,
    enum: ["CASCADE", "SET NULL", "RESTRICT", "NO ACTION"],
  },
});

const TableSchema = new MongooseSchema<Table>({
  name: { type: String, required: true },
  description: { type: String },
  fields: [FieldSchema],
  indexes: [IndexSchema],
  foreignKeys: [ForeignKeySchema],
});

const SchemaModelSchema = new MongooseSchema<ISchema>(
  {
    name: { type: String, required: true },
    description: { type: String },
    tables: [TableSchema],
  },
  {
    timestamps: true,
  }
);

// Final model (safe for hot reload)
const SchemaModel: Model<ISchema> =
  (models?.SchemaModel as Model<ISchema>) ||
  model<ISchema>("SchemaModel", SchemaModelSchema);

export default SchemaModel;
