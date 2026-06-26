import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Target, Activity, Calendar, Settings, Sparkles, LineChart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { ComingSoonBadge } from '../ui/ComingSoonBadge';

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', to: '/tasks', icon: CheckSquare },
  { name: 'Goals', to: '/goals', icon: Target },
  { name: 'Habits', to: '/habits', icon: Activity },
  { name: 'Calendar', to: '/calendar', icon: Calendar },
  { name: 'Settings', to: '/settings', icon: Settings },
];

const upcomingItems = [
  { name: 'AI Panel', icon: Sparkles },
  { name: 'Analytics', icon: LineChart },
];

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col w-64 bg-bg-surface border-r border-border-color h-full", className)}>
      <div className="flex items-center h-16 px-6 border-b border-border-color">
        <span className="text-lg font-bold text-primary">Antigravity</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-bg-base hover:text-text-primary'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-8 px-6 mb-2">
          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Upcoming Features</h4>
        </div>
        <nav className="space-y-1 px-3">
          {upcomingItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-text-secondary opacity-70 cursor-not-allowed"
              title="Coming Soon"
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
              <ComingSoonBadge />
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
