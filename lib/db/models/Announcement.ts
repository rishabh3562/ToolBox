import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  published: { type: Boolean, default: true },
  startsAt: { type: Date },
  endsAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
export default Announcement;
