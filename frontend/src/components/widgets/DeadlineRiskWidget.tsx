import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { AlertTriangle } from 'lucide-react';

export function DeadlineRiskWidget() {
  return (
    <Card className="h-full border-danger/50 bg-danger/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-danger">
          <AlertTriangle className="h-5 w-5" />
          Deadline Risk
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-bold text-danger mb-2">High</div>
          <p className="text-sm text-center text-text-secondary">
            You have 2 tasks due tomorrow that are barely started.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
