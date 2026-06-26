import mongoose, { Document, Schema } from 'mongoose';

export enum GoalType {
  SHORT_TERM = 'SHORT_TERM',
  LONG_TERM = 'LONG_TERM',
  ACADEMIC = 'ACADEMIC',
  CAREER = 'CAREER',
  PERSONAL = 'PERSONAL',
}

export interface IGoal extends Document {
  userId: string;
  title: string;
  description: string;
  goalType: GoalType;
  progress: number;
  deadline: Date;
  linkedTasks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    goalType: {
      type: String,
      enum: Object.values(GoalType),
      required: true,
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    deadline: { type: Date, required: true },
    linkedTasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  },
  {
    timestamps: true,
  }
);

goalSchema.index({ userId: 1 });

export const Goal = mongoose.model<IGoal>('Goal', goalSchema);
