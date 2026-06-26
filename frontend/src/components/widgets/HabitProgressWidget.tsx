import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Activity } from 'lucide-react';
import { cn } from '../../utils/cn';

export function HabitProgressWidget() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const status = [true, true, false, true, false, false, false];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-secondary" />
          Weekly Habits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm font-medium mb-2">Morning Routine</div>
            <div className="flex justify-between gap-1">
              {days.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white", status[i] ? "bg-secondary" : "bg-border-color")}>
                    {status[i] && '✓'}
                  </div>
                  <span className="text-[10px] text-text-secondary">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
