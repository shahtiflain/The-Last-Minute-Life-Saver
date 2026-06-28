import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { AlertTriangle } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Skeleton } from '../ui/Skeleton';

export function DeadlineRiskWidget() {
  const { data: analytics, isLoading } = useAnalytics();

  const level = analytics?.deadlineRisk.level || 'Low';
  const isHighRisk = level === 'High';
  const isMediumRisk = level === 'Medium';

  return (
    <Card className={`h-full glass-card border-none bg-gradient-to-br ${isHighRisk ? 'from-danger/10' : isMediumRisk ? 'from-warning/10' : 'from-success/10'} to-transparent`}>
      <CardHeader className="pb-2">
        <CardTitle className={`flex items-center gap-2 ${isHighRisk ? 'text-danger' : isMediumRisk ? 'text-warning' : 'text-secondary'}`}>
          <div className={`p-2 rounded-lg ${isHighRisk ? 'bg-danger/20' : isMediumRisk ? 'bg-warning/20' : 'bg-success/20'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <span className="font-bold">Deadline Risk</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-24 mb-2" />
              <Skeleton className="h-4 w-48" />
            </>
          ) : (
            <>
              <div className={`text-5xl font-black mb-3 ${isHighRisk ? 'text-danger' : isMediumRisk ? 'text-warning' : 'text-secondary'}`}>
                {level}
              </div>
              <p className="text-sm text-center text-text-secondary font-medium px-4">
                {analytics?.deadlineRisk.message}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
