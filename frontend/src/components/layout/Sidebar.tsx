import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Target, Activity, Calendar, Settings, Sparkles, LineChart, ChevronDown, Command, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

import { auth } from '../../config/firebase';

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Assistant', to: '#', icon: Sparkles, isNew: true },
  { name: 'Focus Timer', to: '#', icon: Activity },
  { name: 'Tasks & Deadlines', to: '/tasks', icon: CheckSquare, badge: '3' },
  { name: 'Smart Calendar', to: '/calendar', icon: Calendar },
  { name: 'Goals & OKRs', to: '/goals', icon: Target },
  { name: 'Habits & Streaks', to: '/habits', icon: LineChart },
  { name: 'Analytics', to: '#', icon: LineChart },
  { name: 'AI Coach', to: '#', icon: Sparkles },
];

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col w-[260px] bg-[#1a1a1a] border-r border-border-color h-full text-[#a1a1aa]", className)}>
      <div className="flex flex-col px-4 py-4 border-b border-border-color gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 px-2">
          <div className="w-5 h-5 bg-primary rounded flex items-center justify-center text-[10px] font-bold text-white">
            H
          </div>
          <span className="text-sm font-bold text-white tracking-wide">Hustlr AI</span>
        </div>

        {/* Workspace Selector */}
        <button className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors text-xs text-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            Shah's Workspace
          </div>
          <ChevronDown className="w-3 h-3 text-text-tertiary" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-0.5 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2 text-[13px] font-medium rounded-lg transition-colors group',
                  (isActive && item.to !== '#')
                    ? 'bg-[#7c3aed] text-white'
                    : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'
                )
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.name}
              </div>
              {item.isNew && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-[#10b981] uppercase tracking-wider">
                  NEW
                </span>
              )}
              {item.badge && (
                <span className="text-[10px] font-medium bg-[#3f3f46] text-white px-2 py-0.5 rounded-md">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer / Shortcuts */}
      <div className="p-4 border-t border-border-color space-y-4">
        <div className="space-y-1">
          <button className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-[#a1a1aa] hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            Shortcuts
            <div className="flex items-center justify-center bg-[#27272a] rounded px-1.5 py-0.5">
              <Command className="w-3 h-3 text-[#71717a]" />
              <span className="text-[10px] ml-0.5 text-[#71717a]">K</span>
            </div>
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 text-[13px] font-medium text-[#a1a1aa] hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <HelpCircle className="w-4 h-4" />
            Help & Documentation
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center text-xs font-medium text-white border border-[#3f3f46]">
              {auth.currentUser?.displayName?.charAt(0) || 'S'}
              <div className="absolute w-2.5 h-2.5 bg-[#10b981] rounded-full border-2 border-[#1a1a1a] translate-x-3 translate-y-3"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-white leading-tight">
                {auth.currentUser?.displayName || 'Shah R.'}
              </span>
              <span className="text-[10px] text-[#71717a] flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
                PRO PLAN
              </span>
            </div>
          </div>
          <Settings className="w-4 h-4 text-[#71717a] hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
