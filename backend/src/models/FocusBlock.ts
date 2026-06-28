import mongoose, { Document, Schema } from 'mongoose';

export interface IFocusBlock extends Document {
  userId: string;
  taskId: string;
  type: string;
  title: string;
  startTime: string;
  endTime: string;
  pomodorosAssigned: number;
  whyThisSlot: string;
  energyRequirement: string;
  estimatedFocusScore: number;
  calendarEventId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const focusBlockSchema = new Schema<IFocusBlock>(
  {
    userId: { type: String, required: true, index: true },
    taskId: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    pomodorosAssigned: { type: Number, required: true },
    whyThisSlot: { type: String },
    energyRequirement: { type: String },
    estimatedFocusScore: { type: Number },
    calendarEventId: { type: String },
    status: { type: String, required: true, default: 'PENDING_APPROVAL' },
  },
  {
    timestamps: true,
    collection: 'focus_blocks'
  }
);

focusBlockSchema.index({ userId: 1, startTime: 1 });

export const FocusBlock = mongoose.model<IFocusBlock>('FocusBlock', focusBlockSchema);
