import mongoose, { Document, Schema } from 'mongoose';

export interface IHabit extends Document {
  userId: string;
  title: string;
  frequencyDays: number[];
  currentStreak: number;
  longestStreak: number;
  reminderEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    frequencyDays: { 
      type: [Number], 
      required: true,
      validate: {
        validator: function (v: number[]) {
          return v.every(day => day >= 0 && day <= 6);
        },
        message: 'Frequency days must be between 0 (Sunday) and 6 (Saturday).'
      }
    },
    currentStreak: { type: Number, default: 0, min: 0 },
    longestStreak: { type: Number, default: 0, min: 0 },
    reminderEnabled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

habitSchema.index({ userId: 1 });

export const Habit = mongoose.model<IHabit>('Habit', habitSchema);
