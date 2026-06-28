import { motion } from 'framer-motion';
import { useAuth } from '../features/auth/AuthProvider';
import { AiSummaryWidget } from '../components/widgets/AiSummaryWidget';
import { ProductivityScoreWidget } from '../components/widgets/ProductivityScoreWidget';
import { HabitCompletionWidget } from '../components/widgets/HabitProgressWidget';
import { UpcomingDeadlinesWidget } from '../components/widgets/UpcomingDeadlinesWidget';
import { GoalProgressWidget } from '../components/widgets/GoalProgressWidget';
import { CalendarSnapshotWidget } from '../components/widgets/CalendarSnapshotWidget';
import { AiRecommendationsWidget } from '../components/widgets/AiRecommendationsWidget';
import { NotificationsWidget } from '../components/widgets/NotificationsWidget';
import { format } from 'date-fns';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 280, damping: 22 } },
} as const;

export function Dashboard() {
  const { currentUser } = useAuth();
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const name = currentUser?.displayName?.split(' ')[0] ?? 'there';
  const dateStr = format(new Date(), 'EEEE, MMMM do');

  return (
    <div className="relative min-h-full w-full">
      {/* Premium Ambient Background */}
      <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] -left-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      
      <motion.div
        initial="hidden"
        animate="show"
        exit="hidden"
        variants={container}
        className="relative max-w-[1600px] mx-auto space-y-6 z-10"
      >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
        <div>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">
            {greeting}, {name}.
          </h1>
          <p className="text-text-tertiary mt-1.5 text-sm font-medium">{dateStr} · Intelligence briefing ready</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-text-tertiary bg-bg-surface border border-border-color rounded-xl px-3 py-2 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          All systems operational
        </div>
      </motion.div>

      {/* ── Bento Grid ── */}
      {/* 
        Layout (4-col grid):
        Row 1: [AI Summary: 2 col] [Productivity Trend: 2 col]
        Row 2: [Upcoming Deadlines: 1 col] [Calendar Snapshot: 1 col] [Goal Progress: 1 col] [Habit Completion: 1 col]
        Row 3: [AI Recommendations: 3 col] [Notifications: 1 col]
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">
        
        {/* Row 1 */}
        <motion.div variants={item} className="sm:col-span-2 lg:col-span-2 min-h-[160px]">
          <AiSummaryWidget />
        </motion.div>

        <motion.div variants={item} className="sm:col-span-2 lg:col-span-2 min-h-[160px]">
          <ProductivityScoreWidget />
        </motion.div>

        {/* Row 2 */}
        <motion.div variants={item} className="lg:col-span-1 min-h-[260px]">
          <UpcomingDeadlinesWidget />
        </motion.div>

        <motion.div variants={item} className="lg:col-span-1 min-h-[260px]">
          <CalendarSnapshotWidget />
        </motion.div>

        <motion.div variants={item} className="lg:col-span-1 min-h-[260px]">
          <GoalProgressWidget />
        </motion.div>

        <motion.div variants={item} className="lg:col-span-1 min-h-[260px]">
          <HabitCompletionWidget />
        </motion.div>

        {/* Row 3 */}
        <motion.div variants={item} className="sm:col-span-2 lg:col-span-3 min-h-[300px]">
          <AiRecommendationsWidget />
        </motion.div>

        <motion.div variants={item} className="sm:col-span-2 lg:col-span-1 min-h-[300px]">
          <NotificationsWidget />
        </motion.div>
      </div>
    </motion.div>
    </div>
  );
}
