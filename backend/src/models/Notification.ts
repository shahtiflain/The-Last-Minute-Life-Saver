import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  title: string;
  body?: string;
  type: string; // info, success, warning
  status: string; // SENT, OPENED, IGNORED
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String },
    type: { type: String, required: true },
    status: { type: String, default: 'SENT' },
    timestamp: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
