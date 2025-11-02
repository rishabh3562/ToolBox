import mongoose, { Schema, models, model } from 'mongoose';

const ContentSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected'], default: 'pending' },
    featured: { type: Boolean, default: false },
    // Featured management
    featuredOrder: { type: Number, default: 0 },
    featuredStart: { type: Date },
    featuredEnd: { type: Date },
  },
  { timestamps: true },
);

const Content = models.Content || model('Content', ContentSchema);
export default Content;
