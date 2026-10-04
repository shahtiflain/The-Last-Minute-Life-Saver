import { TodayFocusWidget } from '../components/widgets/TodayFocusWidget';
import { HabitProgressWidget } from '../components/widgets/HabitProgressWidget';
import { ProductivityScoreWidget } from '../components/widgets/ProductivityScoreWidget';
import { AiSummaryWidget } from '../components/widgets/AiSummaryWidget';
import { UpcomingDeadlinesWidget } from '../components/widgets/UpcomingDeadlinesWidget';
import { CalendarSnapshotWidget } from '../components/widgets/CalendarSnapshotWidget';
import { GoalProgressWidget } from '../components/widgets/GoalProgressWidget';
import { NotificationsWidget } from '../components/widgets/NotificationsWidget';
import { AiRecommendationsWidget } from '../components/widgets/AiRecommendationsWidget';
import { Button } from '../components/ui/Button';
import { Plus, Timer, Sparkles } from 'lucide-react';

export function Dashboard() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-text-primary">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Good evening, Shah.
            </h1>
            <span className="text-[10px] font-bold bg-[#3f1d1d] text-[#f87171] px-2 py-0.5 rounded-full border border-[#7f1d1d]">
              Rescue Mode Ready
            </span>
          </div>
          <p className="text-text-secondary mt-1 text-sm">
            {currentDate} · <span className="text-[#38bdf8] font-medium">3 critical priorities requiring focus before midnight</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" className="bg-[#1a1a1a] border-[#3f3f46] text-white hover:bg-[#27272a] h-9 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Quick Capture
          </Button>
          <Button variant="secondary" size="sm" className="bg-[#1a1a1a] border-[#3f3f46] text-[#38bdf8] hover:bg-[#27272a] h-9 text-xs">
            <Timer className="w-3.5 h-3.5 mr-1.5" />
            Start Focus (25m)
          </Button>
          <Button size="sm" className="bg-[#4f46e5] text-white hover:bg-[#4338ca] border-0 h-9 text-xs shadow-sm shadow-[#4f46e5]/20">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Run AI Daily Audit
          </Button>
        </div>
      </div>
      
      {/* Top Banner */}
      <div className="w-full">
        <AiSummaryWidget />
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProductivityScoreWidget />
        <TodayFocusWidget />
      </div>

      {/* Row 3: 4 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <UpcomingDeadlinesWidget />
        <CalendarSnapshotWidget />
        <GoalProgressWidget />
        <HabitProgressWidget />
      </div>

      {/* Row 4: Logs & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NotificationsWidget />
        <AiRecommendationsWidget />
      </div>
    </div>
  );
}
