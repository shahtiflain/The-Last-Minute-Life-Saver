import { Bell, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../utils/cn';
import { Card, CardContent } from '../ui/Card';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

interface Notification {
  _id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING';
  title: string;
  body?: string;
  timestamp: string;
}

const typeConfig: Record<string, any> = {
  SUCCESS: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  WARNING: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10' },
  INFO: { icon: Info, color: 'text-info', bg: 'bg-info/10' },
};

export function NotificationsWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/api/notifications');
      return response.data.data as Notification[];
    },
    refetchInterval: 30000 // Poll every 30 seconds
  });

  const notifications = data || [];

  return (
    <Card className="h-full">
      <CardContent className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Recent Activity</div>
            <div className="text-lg font-bold text-text-primary tracking-tight">{notifications.length} updates</div>
          </div>
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-bg-surface-hover flex items-center justify-center border border-border-color">
              <Bell className="w-4 h-4 text-info" />
            </div>
            {notifications.length > 0 && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-bg-surface" />
            )}
          </div>
        </div>

        <div className="flex-1 space-y-2.5 overflow-y-auto premium-scrollbar pr-1 -mr-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-20 text-text-tertiary">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-sm text-text-tertiary py-6">
              All caught up! No recent notifications.
            </div>
          ) : (
            notifications.map(notif => {
              const cfg = typeConfig[notif.type] || typeConfig.INFO;
            const Icon = cfg.icon;
            return (
              <div key={notif._id} className="flex items-start gap-3 p-3 rounded-[12px] hover:bg-bg-surface-hover/80 transition-colors cursor-default border border-transparent hover:border-border-color/50">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', cfg.bg)}>
                  <Icon className={cn('w-4 h-4', cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text-primary leading-tight">{notif.title}</div>
                  {notif.body && <div className="text-xs text-text-secondary mt-1 leading-snug">{notif.body}</div>}
                  <div className="text-[10px] text-text-tertiary mt-1.5 font-medium">
                    {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      </CardContent>
    </Card>
  );
}
