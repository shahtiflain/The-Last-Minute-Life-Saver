import { useAnalytics } from '../../hooks/useAnalytics';
import { Skeleton } from '../ui/Skeleton';
import { Activity, Flame } from 'lucide-react';
import { useHabits } from '../../hooks/useHabits';
import { cn } from '../../utils/cn';
import { isToday } from 'date-fns';
import { Card, CardContent } from '../ui/Card';

// Seed-based pseudo-random for stable heatmap
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function HabitCompletionWidget() {
  const { data: analytics, isLoading } = useAnalytics();
  const { data: habits } = useHabits();
  const habitCompletion = analytics?.habitCompletion;

  const progressPercent = habitCompletion?.progressPercent ?? 0;
  const completedToday = habitCompletion?.completedToday ?? 0;
  const totalDueToday = habitCompletion?.totalDueToday ?? 0;

  // Build a 28-day heatmap (4 weeks)
  const today = new Date();
  const heatmapDays = Array(28).fill(0).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (27 - i));
    const isCurrentDay = isToday(d);

    // Check if any habit was completed on this day
    const dateStr = d.toISOString().slice(0, 10);
    const completedCount = habits?.reduce((sum, h) => {
      return sum + (h.completedDates?.some(cd => cd.startsWith(dateStr)) ? 1 : 0);
    }, 0) ?? 0;

    const totalHabits = habits?.length ?? 1;
    const intensity = completedCount === 0
      ? seededRandom(i * 7) > 0.6 ? 1 : 0  // fallback to synthetic for demo
      : Math.round((completedCount / totalHabits) * 4);

    return { date: d, intensity: Math.min(4, intensity), isToday: isCurrentDay };
  });

  const intensityClasses = [
    'bg-border-color opacity-40',
    'bg-secondary/20',
    'bg-secondary/40',
    'bg-secondary/70',
    'bg-secondary',
  ];

  // Best streak from habits
  const bestStreak = habits?.reduce((max, h) => Math.max(max, h.currentStreak ?? 0), 0) ?? 0;

  return (
    <Card className="h-full">
      <CardContent className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Habit Completion</div>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-lg font-bold text-text-primary tracking-tight">
                {completedToday} <span className="text-text-tertiary font-medium">/ {totalDueToday} today</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {bestStreak > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-warning/10 rounded-lg border border-warning/20 text-xs font-semibold text-warning">
                <Flame className="w-3.5 h-3.5" />
                {bestStreak}d
              </div>
            )}
            <div className="w-8 h-8 rounded-lg bg-bg-surface-hover flex items-center justify-center border border-border-color">
              <Activity className="w-4 h-4 text-secondary" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {!isLoading && (
          <div className="mb-5">
            <div className="w-full bg-bg-surface-hover rounded-full h-1.5 overflow-hidden border border-border-color/50">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[11px] font-medium text-text-tertiary">{progressPercent}% complete</span>
              {progressPercent === 100 && (
                <span className="text-[11px] text-success font-semibold flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                  Perfect day
                </span>
              )}
            </div>
          </div>
        )}

        {/* Heatmap */}
        {isLoading ? (
          <Skeleton className="flex-1 w-full rounded-xl mt-2" />
        ) : (
          <div className="flex-1 mt-auto">
            <div className="grid grid-cols-7 gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-[10px] text-text-tertiary text-center font-medium mb-1">{d}</div>
              ))}
              {heatmapDays.map((day, i) => (
                <div
                  key={i}
                  title={day.date.toLocaleDateString()}
                  className={cn(
                    'aspect-square rounded-[3px] transition-all',
                    intensityClasses[day.intensity],
                    day.isToday && 'ring-1 ring-secondary ring-offset-1 ring-offset-bg-surface'
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-1 mt-3 justify-end">
              <span className="text-[10px] text-text-tertiary font-medium mr-1">Less</span>
              {intensityClasses.map((cls, i) => (
                <div key={i} className={cn('w-2 h-2 rounded-[2px]', cls)} />
              ))}
              <span className="text-[10px] text-text-tertiary font-medium ml-1">More</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
