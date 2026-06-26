import { Target, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Goals() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Goals</h1>
          <p className="text-text-secondary mt-1">Track your long-term objectives.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      <div className="flex-1 overflow-auto flex flex-col items-center justify-center text-text-secondary border-2 border-dashed border-border-color rounded-xl bg-bg-surface/50 p-8">
        <Target className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-xl font-medium text-text-primary">No goals set yet</p>
        <p className="text-sm mt-2 max-w-md text-center">
          Define your big-picture objectives here. AI will help break them down into actionable tasks.
        </p>
      </div>
    </div>
  );
}
