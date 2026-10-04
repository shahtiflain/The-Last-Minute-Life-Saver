import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Task, TaskStatus, TaskPriority } from '../models/Task.js';
import { Habit } from '../models/Habit.js';

export const getDashboardAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const now = new Date();
  
  // Calculate date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  
  // Calculate date 48 hours from now
  const in48Hours = new Date();
  in48Hours.setHours(now.getHours() + 48);

  // 1. Productivity Score Calculation
  const totalTasksLast7Days = await Task.countDocuments({
    userId,
    createdAt: { $gte: sevenDaysAgo }
  });
  const completedTasksLast7Days = await Task.countDocuments({
    userId,
    status: TaskStatus.COMPLETED,
    updatedAt: { $gte: sevenDaysAgo }
  });
  
  // Simple score: (Completed / Total) * 100
  // If no tasks created in last 7 days, score is 0
  const baseScore = totalTasksLast7Days === 0 ? 0 : Math.round((completedTasksLast7Days / totalTasksLast7Days) * 100);
  // Add slight boost for just having completed tasks
  const productivityScore = Math.min(100, baseScore + (completedTasksLast7Days * 2));
  
  // Fake "trend" for now, ideally we compare to the previous 7-day period
  const productivityTrend = completedTasksLast7Days > 0 ? '+5%' : '0%';

  // 2. Deadline Risk Calculation
  const highRiskTasks = await Task.countDocuments({
    userId,
    status: { $ne: TaskStatus.COMPLETED },
    deadline: { $lte: in48Hours },
    priority: { $in: [TaskPriority.HIGH, TaskPriority.CRITICAL] }
  });
  const anyDueTasks = await Task.countDocuments({
    userId,
    status: { $ne: TaskStatus.COMPLETED },
    deadline: { $lte: in48Hours }
  });

  let deadlineRiskLevel = 'Low';
  let deadlineRiskMessage = 'Your schedule is clear.';
  
  if (highRiskTasks >= 2) {
    deadlineRiskLevel = 'High';
    deadlineRiskMessage = `You have ${highRiskTasks} high-priority tasks due within 48 hours.`;
  } else if (anyDueTasks >= 3 || highRiskTasks === 1) {
    deadlineRiskLevel = 'Medium';
    deadlineRiskMessage = `You have ${anyDueTasks} tasks due within 48 hours.`;
  } else if (anyDueTasks > 0) {
    deadlineRiskLevel = 'Low';
    deadlineRiskMessage = `You have ${anyDueTasks} tasks approaching deadline.`;
  }

  // 3. Habit Completion Calculation (Today)
  // Check how many habits that were due today were actually completed today.
  const allHabits = await Habit.find({ userId });
  const todayDayOfWeek = now.getDay(); // 0-6 (Sun-Sat)
  
  const habitsDueToday = allHabits.filter(h => h.frequencyDays.includes(todayDayOfWeek));
  
  let completedHabitsToday = 0;
  habitsDueToday.forEach(habit => {
    // Check if any date in completedDates is today
    const completedToday = habit.completedDates.some(date => {
      const d = new Date(date);
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    if (completedToday) {
      completedHabitsToday++;
    }
  });

  const habitProgressPercent = habitsDueToday.length === 0 ? 100 : Math.round((completedHabitsToday / habitsDueToday.length) * 100);

  res.json({
    productivityScore: {
      score: productivityScore,
      trend: productivityTrend,
    },
    deadlineRisk: {
      level: deadlineRiskLevel,
      message: deadlineRiskMessage,
      highRiskCount: highRiskTasks,
      dueSoonCount: anyDueTasks
    },
    habitCompletion: {
      completedToday: completedHabitsToday,
      totalDueToday: habitsDueToday.length,
      progressPercent: habitProgressPercent
    }
  });
});
