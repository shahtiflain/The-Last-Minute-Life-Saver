import { useGoals } from '../../hooks/useGoals';
import { Skeleton } from '../ui/Skeleton';
import { Target } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

function ProgressRing({ progress, size = 48, strokeWidth = 4, color = '#818CF8' }: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="currentColor" strokeWidth={strokeWidth}
        fill="none" className="text-border-color"
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

const GOAL_COLORS = ['#818CF8', '#34D399', '#F472B6', '#60A5FA', '#FBBF24'];

export function GoalProgressWidget() {
  const { data: goals, isLoading } = useGoals();
  const topGoals = goals?.slice(0, 4) ?? [];

  return (
    <Card className="h-full">
      <CardContent className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Goal Progress</div>
            {!isLoading && (
              <div className="text-lg font-bold text-text-primary tracking-tight">{goals?.length ?? 0} active</div>
            )}
          </div>
          <div className="w-8 h-8 rounded-lg bg-bg-surface-hover flex items-center justify-center border border-border-color">
            <Target className="w-4 h-4 text-secondary" />
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto premium-scrollbar pr-1 -mr-1">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))
          ) : topGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-6">
              <Target className="w-8 h-8 text-text-tertiary mb-2 opacity-40" />
              <p className="text-sm text-text-tertiary">No goals set yet.</p>
            </div>
          ) : (
            topGoals.map((goal, i) => (
              <div key={goal._id} className="flex items-center gap-3.5 group">
                <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <ProgressRing
                    progress={goal.progress}
                    color={GOAL_COLORS[i % GOAL_COLORS.length]}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-text-primary">{goal.progress}%</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text-primary truncate">{goal.title}</div>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <div className="flex-1 h-1.5 bg-border-color/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${goal.progress}%`,
                          backgroundColor: GOAL_COLORS[i % GOAL_COLORS.length]
                        }}
                      />
                    </div>
                    <span className="text-[9px] font-semibold tracking-wide text-text-tertiary uppercase flex-shrink-0">{goal.goalType}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
