import mongoose, { Document, Schema } from 'mongoose';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
}

export interface ITask extends Document {
  userId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: string;
  deadline: Date;
  estimatedDurationMinutes: number;
  progress: number;
  aiRiskScore: number;
  completionProbability: number;
  dependencies: mongoose.Types.ObjectId[];
  lockedByAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const taskSchema = new Schema<ITask>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priority: { 
      type: String, 
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO
    },
    category: { type: String, required: true },
    deadline: { 
      type: Date, 
      required: true,
      validate: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validator: function (this: any, value: Date) {
          // In Mongoose, `this.createdAt` might not be available during creation if timestamps are added later,
          // but we can check if deadline is in the future relative to now.
          // The spec says "Must always be greater than createdAt". 
          // We'll approximate this by ensuring it's > new Date() or `this.createdAt`.
          const creationDate = this.createdAt || new Date();
          return value > creationDate;
        },
        message: 'Deadline must be greater than creation date'
      }
    },
    estimatedDurationMinutes: { type: Number, required: true, min: 1 },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    aiRiskScore: { type: Number, default: 0, min: 0, max: 1 },
    completionProbability: { type: Number, default: 0, min: 0, max: 1 },
    dependencies: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    lockedByAgent: { type: String, default: null },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Indexes
taskSchema.index({ userId: 1, deadline: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, category: 1 });
taskSchema.index({ deadline: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ status: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);
