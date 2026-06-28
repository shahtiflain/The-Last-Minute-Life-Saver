import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { CheckCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { useTasks } from '../../hooks/useTasks';

export function TodayFocusWidget() {
  const { data: tasks, isLoading } = useTasks();

  return (
    <Card className="h-full glass-card border-none bg-gradient-to-br from-bg-surface to-bg-surface-hover">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold">Today's Focus</span>
          </div>
          <Badge variant="outline" className="font-mono">{tasks?.length || 0} active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-border-color/50">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))
          ) : tasks && tasks.length > 0 ? (
            [...tasks]
              .sort((a, b) => {
                const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
                const pwA = priorityWeight[a.priority as keyof typeof priorityWeight] || 0;
                const pwB = priorityWeight[b.priority as keyof typeof priorityWeight] || 0;
                if (pwA !== pwB) return pwB - pwA;
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
              })
              .slice(0, 3)
              .map(task => (
              <div key={task._id} className="group flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-border-color/50 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'CRITICAL' ? 'bg-danger' : task.priority === 'HIGH' ? 'bg-warning' : 'bg-primary'}`} />
                  <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{task.title}</span>
                </div>
                <Badge variant={task.priority === 'CRITICAL' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'premium'}>
                  {task.priority}
                </Badge>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 opacity-60">
              <CheckCircle className="h-10 w-10 mb-3 text-text-tertiary" />
              <p className="text-sm font-medium text-text-secondary">All caught up for today!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
