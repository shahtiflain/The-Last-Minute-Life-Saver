import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { CheckCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { useTasks } from '../../hooks/useTasks';

export function TodayFocusWidget() {
  const { data: tasks, isLoading } = useTasks();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          Today's Focus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border-color pb-2 last:border-0 last:pb-0">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))
          ) : tasks && tasks.length > 0 ? (
            tasks.slice(0, 3).map(task => (
              <div key={task._id} className="flex items-center justify-between border-b border-border-color pb-2 last:border-0 last:pb-0">
                <span className="text-sm font-medium">{task.title}</span>
                <Badge variant={task.priority === 'CRITICAL' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'default'}>
                  {task.priority}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-sm text-text-secondary text-center py-4">No tasks due today!</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
