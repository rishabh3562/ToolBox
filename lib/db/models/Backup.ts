/**
 * Backup Model
 *
 * Stores database backups in MongoDB instead of file system
 * This ensures backups work in serverless environments
 */

import mongoose, { Schema, models, model } from 'mongoose';

export interface IBackup {
  collection: string;
  data: any;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  size: number;
  metadata: {
    documentCount: number;
    compressed: boolean;
  };
}

const BackupSchema = new Schema<IBackup>({
  collection: {
    type: String,
    required: true,
    index: true,
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  size: {
    type: Number,
    required: true,
  },
  metadata: {
    documentCount: {
      type: Number,
      required: true,
    },
    compressed: {
      type: Boolean,
      default: false,
    },
  },
});

// Auto-delete backups after 30 days (TTL index)
BackupSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// Index for listing backups by collection
BackupSchema.index({ collection: 1, createdAt: -1 });

const Backup = models.Backup || model<IBackup>('Backup', BackupSchema);
export default Backup;
