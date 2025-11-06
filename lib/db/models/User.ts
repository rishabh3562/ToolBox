import mongoose, { Schema, InferSchemaType, models, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUserMethods {
  setPassword(password: string): Promise<void>;
  verifyPassword(password: string): Promise<boolean>;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

interface IUser {
  name?: string;
  email: string;
  passwordHash?: string;
  image?: string;
  isAdmin: boolean;
  role: string;
  banned: boolean;
  emailVerified?: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: {
      type: String,
      // Not required to support OAuth users who don't have passwords
      required: false,
      select: false, // Don't include in queries by default for security
    },
    image: { type: String },
    isAdmin: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
    banned: { type: Boolean, default: false },
    emailVerified: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Method to hash and set password
UserSchema.methods.setPassword = async function(password: string): Promise<void> {
  const saltRounds = 12;
  this.passwordHash = await bcrypt.hash(password, saltRounds);
};

// Method to verify password
UserSchema.methods.verifyPassword = async function(password: string): Promise<boolean> {
  if (!this.passwordHash) {
    return false;
  }
  return bcrypt.compare(password, this.passwordHash);
};

// Ensure passwordHash is never returned in JSON
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.passwordHash;
    return ret;
  }
});

export type UserDoc = InferSchemaType<typeof UserSchema> &
  IUserMethods &
  Document &
  { _id: mongoose.Types.ObjectId };

const User = (models.User || model<IUser, UserModel>('User', UserSchema)) as UserModel;
export default User;
