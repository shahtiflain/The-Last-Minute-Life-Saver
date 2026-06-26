import { useTasks } from '../hooks/useTasks';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Plus, Inbox } from 'lucide-react';

export function Tasks() {
  const { data: tasks, isLoading, error } = useTasks();

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tasks</h1>
          <p className="text-text-secondary mt-1">Manage your pending work and upcoming deadlines.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <Spinner className="h-64" />
        ) : error ? (
          <div className="text-danger text-center p-8">Failed to load tasks.</div>
        ) : tasks && tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map(task => (
              <Card key={task._id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <p className="text-sm text-text-secondary">Due: {new Date(task.deadline).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={task.status === 'COMPLETED' ? 'success' : 'default'}>{task.status}</Badge>
                    <Badge variant={task.priority === 'CRITICAL' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'default'}>{task.priority}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-text-secondary border-2 border-dashed border-border-color rounded-xl bg-bg-surface/50">
            <Inbox className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm">Create a new task to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
