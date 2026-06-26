import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { TrendingUp } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';

export function ProductivityScoreWidget() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading AI analytics
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="h-full bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <TrendingUp className="h-5 w-5" />
          Productivity Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-2">
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-20 mb-2 bg-primary/20" />
              <Skeleton className="h-4 w-3/4 bg-primary/20" />
            </>
          ) : (
            <>
              <div className="text-5xl font-bold text-primary mb-1">84</div>
              <p className="text-sm text-center text-text-secondary font-medium">
                Great job! +12% from last week.
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
