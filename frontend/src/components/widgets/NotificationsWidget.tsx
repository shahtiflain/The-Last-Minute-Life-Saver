import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../utils/cn';
import { Card, CardContent } from '../ui/Card';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: Date;
}

// Static recent notifications (would come from API in production)
const RECENT_NOTIFICATIONS: Notification[] = [
  {
    id: '1', type: 'success', title: 'Schedule Approved',
    message: 'AI generated 4 focus blocks for today.',
    time: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '2', type: 'warning', title: 'Deadline Approaching',
    message: 'Task "Q4 Report" is due in 2 days.',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '3', type: 'info', title: 'Habit Reminder',
    message: 'Time for your daily meditation habit.',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: '4', type: 'success', title: 'Goal Milestone',
    message: 'You reached 50% on "Launch MVP" goal!',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

const typeConfig = {
  success: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  warning: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10' },
  info: { icon: Info, color: 'text-info', bg: 'bg-info/10' },
};

export function NotificationsWidget() {
  return (
    <Card className="h-full">
      <CardContent className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Recent Activity</div>
            <div className="text-lg font-bold text-text-primary tracking-tight">{RECENT_NOTIFICATIONS.length} updates</div>
          </div>
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-bg-surface-hover flex items-center justify-center border border-border-color">
              <Bell className="w-4 h-4 text-info" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-bg-surface" />
          </div>
        </div>

        <div className="flex-1 space-y-2.5 overflow-y-auto premium-scrollbar pr-1 -mr-1">
          {RECENT_NOTIFICATIONS.map(notif => {
            const cfg = typeConfig[notif.type];
            const Icon = cfg.icon;
            return (
              <div key={notif.id} className="flex items-start gap-3 p-3 rounded-[12px] hover:bg-bg-surface-hover/80 transition-colors cursor-default border border-transparent hover:border-border-color/50">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', cfg.bg)}>
                  <Icon className={cn('w-4 h-4', cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text-primary leading-tight">{notif.title}</div>
                  <div className="text-xs text-text-secondary mt-1 leading-snug">{notif.message}</div>
                  <div className="text-[10px] text-text-tertiary mt-1.5 font-medium">
                    {formatDistanceToNow(notif.time, { addSuffix: true })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
