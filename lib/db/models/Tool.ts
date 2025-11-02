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
    // Spam detection metadata
    isSpam: { type: Boolean, default: false },
    spamScore: { type: Number, default: 0 },
    spamReasons: { type: [String], default: [] },
  },
  { timestamps: true },
);

const Tool = models.Tool || model('Tool', ToolSchema);
export default Tool;
