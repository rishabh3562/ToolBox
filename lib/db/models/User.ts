import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    isAdmin: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
    banned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

const User = models.User || model('User', UserSchema);
export default User;
