import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  email: string;
  fullName: string;
  profilePhoto?: string;
  timezone: string;
  preferences: Record<string, unknown>;
  workingHours: {
    start: string;
    end: string;
  };
  notificationSettings: Record<string, unknown>;
  connectedAccounts?: Record<string, unknown>;
  fcmToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    profilePhoto: { type: String },
    timezone: { type: String, required: true },
    preferences: { type: Schema.Types.Mixed, required: true, default: {} },
    workingHours: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    notificationSettings: { type: Schema.Types.Mixed, required: true, default: {} },
    connectedAccounts: { type: Schema.Types.Mixed, default: {} },
    fcmToken: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ createdAt: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
