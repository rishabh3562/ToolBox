import mongoose, { Schema, models, model } from 'mongoose';

const ToolSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'changes_requested'], default: 'pending' },
    // Review metadata
    review: {
      reviewerId: { type: Schema.Types.ObjectId, ref: 'User' },
      reviewerEmail: { type: String },
      reviewedAt: { type: Date },
      notes: { type: String },
      rejectionReason: { type: String },
    },
  },
  { timestamps: true },
);

const Tool = models.Tool || model('Tool', ToolSchema);
export default Tool;
