import mongoose, { Schema, models, model } from 'mongoose';

const ReportSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true },
);

const Report = models.Report || model('Report', ReportSchema);
export default Report;
