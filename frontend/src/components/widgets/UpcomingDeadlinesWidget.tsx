import { useTasks } from '../../hooks/useTasks';
import { Skeleton } from '../ui/Skeleton';
import { formatDistanceToNow, parseISO, isPast, isToday, isTomorrow } from 'date-fns';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Card, CardContent } from '../ui/Card';

function getUrgency(deadline: string): 'overdue' | 'today' | 'soon' | 'future' {
  try {
    const d = parseISO(deadline);
    if (isPast(d) && !isToday(d)) return 'overdue';
    if (isToday(d)) return 'today';
    if (isTomorrow(d)) return 'soon';
    return 'future';
  } catch {
    return 'future';
  }
}

const urgencyConfig = {
  overdue: { color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', label: 'Overdue', icon: AlertTriangle },
  today: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', label: 'Due Today', icon: Clock },
  soon: { color: 'text-info', bg: 'bg-info/10', border: 'border-info/20', label: 'Tomorrow', icon: Clock },
  future: { color: 'text-text-secondary', bg: 'bg-bg-surface-hover', border: 'border-border-color', label: '', icon: CheckCircle },
};

export function UpcomingDeadlinesWidget() {
  const { data: tasks, isLoading } = useTasks();

  const upcomingTasks = tasks
    ?.filter(t => t.status !== 'COMPLETED')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5) ?? [];

  return (
    <Card className="h-full">
      <CardContent className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Upcoming Deadlines</div>
            {!isLoading && (
              <div className="text-lg font-bold text-text-primary tracking-tight">{upcomingTasks.length} pending</div>
            )}
          </div>
          <div className="w-8 h-8 rounded-lg bg-bg-surface-hover flex items-center justify-center border border-border-color">
            <Clock className="w-4 h-4 text-warning" />
          </div>
        </div>

        <div className="flex-1 space-y-2.5 overflow-y-auto premium-scrollbar -mr-2 pr-2">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))
          ) : upcomingTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-6">
              <CheckCircle className="w-8 h-8 text-success mb-2 opacity-60" />
              <p className="text-sm text-text-tertiary">All clear! No pending deadlines.</p>
            </div>
          ) : (
            upcomingTasks.map(task => {
              const urgency = getUrgency(task.deadline);
              const cfg = urgencyConfig[urgency];
              const Icon = cfg.icon;
              return (
                <div
                  key={task._id}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-3 rounded-[12px] border transition-all hover:bg-bg-surface-hover/80',
                    cfg.bg, cfg.border
                  )}
                >
                  <Icon className={cn('w-4 h-4 flex-shrink-0', cfg.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-text-primary truncate">{task.title}</div>
                    <div className={cn('text-xs font-medium mt-0.5', cfg.color)}>
                      {urgency === 'overdue'
                        ? `Overdue · ${formatDistanceToNow(parseISO(task.deadline), { addSuffix: true })}`
                        : urgency === 'today'
                        ? 'Due today'
                        : formatDistanceToNow(parseISO(task.deadline), { addSuffix: true })
                      }
                    </div>
                  </div>
                  {task.priority === 'CRITICAL' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-danger/20 text-danger rounded-md flex-shrink-0">CRITICAL</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
