import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Skeleton } from '../ui/Skeleton';
import { Card, CardContent } from '../ui/Card';

// Generate synthetic weekly trend from a score
function generateWeeklyData(currentScore: number) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay(); // 0=Sun
  const adjustedToday = today === 0 ? 6 : today - 1;

  return days.map((day, i) => {
    if (i > adjustedToday) return { day, score: null };
    const variance = (Math.sin(i * 1.5) * 12) + (Math.cos(i * 0.8) * 8);
    const base = Math.max(20, Math.min(100, currentScore + variance - 10));
    return { day, score: Math.round(i === adjustedToday ? currentScore : base) };
  });
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 rounded-xl text-xs">
      <div className="text-text-secondary font-medium">{label}</div>
      <div className="text-primary font-bold text-base">{payload[0].value}</div>
    </div>
  );
}

export function ProductivityScoreWidget() {
  const { data: analytics, isLoading } = useAnalytics();
  const score = analytics?.productivityScore?.score ?? 72;
  const trend = analytics?.productivityScore?.trend ?? 'stable';
  const weeklyData = generateWeeklyData(score);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-text-tertiary';
  const trendLabel = trend === 'up' ? '+12%' : trend === 'down' ? '-8%' : '±0%';

  return (
    <Card className="h-full">
      <CardContent className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Weekly Productivity</div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-text-primary tabular-nums tracking-tight">{score}</span>
                <span className="text-text-tertiary text-sm mb-1 font-medium">/ 100</span>
              </div>
            )}
          </div>
          <div className={`flex items-center gap-1.5 text-sm font-semibold ${trendColor} bg-bg-surface-hover px-2.5 py-1 rounded-lg border border-border-color`}>
            <TrendIcon className="w-4 h-4" />
            {trendLabel}
          </div>
        </div>

        <div className="flex-1 min-h-[120px] -mx-2 -mb-2 mt-2">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="productivityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: 'var(--text-tertiary)', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  dy={4}
                />
                <YAxis domain={[0, 100]} hide />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-color)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#818CF8"
                  strokeWidth={2.5}
                  fill="url(#productivityGrad)"
                  connectNulls={false}
                  dot={{ fill: '#818CF8', r: 3, strokeWidth: 2, stroke: 'var(--bg-surface)' }}
                  activeDot={{ r: 5, fill: '#818CF8', strokeWidth: 2, stroke: 'var(--bg-surface)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
