import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Flame, Zap, Shield, Crown, Target } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useHabits } from '../hooks/useHabits';
import { useGoals } from '../hooks/useGoals';
import { Card, CardContent } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export function Achievements() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: goals, isLoading: goalsLoading } = useGoals();

  const isLoading = tasksLoading || habitsLoading || goalsLoading;

  // Calculate stats
  const completedTasks = tasks?.filter(t => t.status === 'COMPLETED').length || 0;
  const highestStreak = habits?.reduce((max, h) => Math.max(max, h.currentStreak), 0) || 0;
  const completedGoals = goals?.filter(g => g.progress === 100).length || 0;

  // Level System (1 level per 5 tasks, 2 levels per goal, 1 level per 3 streak days)
  const xp = (completedTasks * 10) + (completedGoals * 50) + (highestStreak * 15);
  const currentLevel = Math.floor(xp / 100) + 1;
  const nextLevelXP = currentLevel * 100;
  const progressPercent = ((xp % 100) / 100) * 100;

  // Badge Definitions
  const badges = [
    {
      id: 'first-blood',
      title: 'First Blood',
      description: 'Complete your first task',
      icon: <Zap className="w-8 h-8" />,
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]',
      unlocked: completedTasks >= 1
    },
    {
      id: 'task-master',
      title: 'Task Master',
      description: 'Complete 10 tasks',
      icon: <Target className="w-8 h-8" />,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      glow: 'shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)]',
      unlocked: completedTasks >= 10
    },
    {
      id: 'habit-hero',
      title: 'Consistency',
      description: 'Maintain a 3-day habit streak',
      icon: <Flame className="w-8 h-8" />,
      color: 'text-danger',
      bg: 'bg-danger/10',
      border: 'border-danger/20',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
      unlocked: highestStreak >= 3
    },
    {
      id: 'unstoppable',
      title: 'Unstoppable',
      description: 'Maintain a 7-day habit streak',
      icon: <Shield className="w-8 h-8" />,
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
      unlocked: highestStreak >= 7
    },
    {
      id: 'goal-getter',
      title: 'Goal Getter',
      description: 'Complete your first goal',
      icon: <Star className="w-8 h-8" />,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      border: 'border-secondary/20',
      glow: 'shadow-[0_0_20px_rgba(var(--color-secondary-rgb),0.3)]',
      unlocked: completedGoals >= 1
    },
    {
      id: 'legend',
      title: 'Living Legend',
      description: 'Reach Level 10',
      icon: <Crown className="w-8 h-8" />,
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      glow: 'shadow-[0_0_30px_rgba(251,191,36,0.5)]',
      unlocked: currentLevel >= 10
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="relative min-h-full w-full">
      {/* Ambient Background */}
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-warning/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="relative max-w-5xl mx-auto space-y-8 z-10"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">Achievements</h1>
            <p className="text-text-secondary mt-1">Level up by crushing your tasks, goals, and habits.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-color/60 rounded-xl shadow-sm">
            <Medal className="w-5 h-5 text-warning" />
            <span className="font-semibold">{unlockedCount} / {badges.length} Unlocked</span>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center"><Spinner /></div>
        ) : (
          <>
            {/* Level Progress Bar */}
            <motion.div variants={item}>
              <Card className="bg-gradient-to-r from-bg-surface to-bg-surface-hover border-border-color/60 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                <CardContent className="p-8 relative z-10">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 rounded-full bg-bg-base flex items-center justify-center border-4 border-primary shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)]">
                        <span className="text-3xl font-black text-text-primary">{currentLevel}</span>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                        Level
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <h2 className="text-xl font-bold text-text-primary">Rank: {currentLevel < 5 ? 'Novice Hustler' : currentLevel < 10 ? 'Elite Producer' : 'Living Legend'}</h2>
                          <p className="text-sm text-text-tertiary font-medium">Gain XP by completing tasks and holding streaks</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-primary">{xp}</span>
                          <span className="text-text-tertiary font-medium text-sm"> / {nextLevelXP} XP</span>
                        </div>
                      </div>
                      
                      <div className="h-4 w-full bg-bg-base rounded-full overflow-hidden border border-border-color/50 shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-primary to-secondary relative"
                        >
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Badges Grid */}
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-6">Badge Collection</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => (
                  <motion.div variants={item} key={badge.id}>
                    <Card className={`h-full transition-all duration-300 ${badge.unlocked ? `${badge.border} hover:scale-[1.02] ${badge.glow}` : 'border-border-color/30 opacity-50 grayscale'}`}>
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${badge.unlocked ? badge.bg : 'bg-bg-surface'} ${badge.color}`}>
                          {badge.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-text-primary">{badge.title}</h3>
                          <p className="text-sm text-text-secondary mt-1">{badge.description}</p>
                          {badge.unlocked && (
                            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-success uppercase tracking-wider bg-success/10 px-2 py-1 rounded-md">
                              <Trophy className="w-3 h-3" />
                              Unlocked
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
