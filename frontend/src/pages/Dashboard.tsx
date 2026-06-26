import { TodayFocusWidget } from '../components/widgets/TodayFocusWidget';
import { DeadlineRiskWidget } from '../components/widgets/DeadlineRiskWidget';
import { HabitProgressWidget } from '../components/widgets/HabitProgressWidget';
import { ProductivityScoreWidget } from '../components/widgets/ProductivityScoreWidget';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Here is what is happening today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <TodayFocusWidget />
        </div>
        <div className="col-span-1">
          <DeadlineRiskWidget />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <HabitProgressWidget />
        </div>
        <div className="col-span-1">
          <ProductivityScoreWidget />
        </div>
      </div>
    </div>
  );
}
