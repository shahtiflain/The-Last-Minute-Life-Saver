import { useState, useEffect } from 'react';
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

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
  onNavigate?: () => void;
}

export function Sidebar({ onCollapsedChange, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed', String(collapsed));
    } catch { /* ignore */ }
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);



  return (
    <motion.div
      layout
      animate={{ width: collapsed ? 68 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col bg-bg-surface/60 backdrop-blur-xl border-r border-border-color h-full shadow-sm overflow-hidden relative"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border-color/50 flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {!collapsed ? (
            <motion.img
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 140 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              src={customLogo}
              alt="Hustlr Wordmark"
              className="object-contain drop-shadow-md py-1"
            />
          ) : (
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
              <img src={logo} alt="Hustlr Logo" className="w-[120%] h-[120%] max-w-[120%] object-contain mix-blend-screen" />
            </div>
          )}
        </div>
      </div>


      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-2 premium-scrollbar">
        <nav className={cn("space-y-1", collapsed ? "px-2" : "px-3")}>
          {!collapsed && (
            <div className="px-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2 mt-2">
              Platform
            </div>
          )}
          {navItems.map((item) => (
            <Tooltip key={item.name} label={item.name} show={collapsed}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden',
                    collapsed ? 'w-10 h-10 justify-center' : 'px-3 py-2.5',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 w-0.5 h-6 bg-primary rounded-r-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon
                      className={cn(
                        'h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
                        !collapsed && 'mr-3',
                        isActive ? 'text-primary' : ''
                      )}
                    />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            </Tooltip>
          ))}
        </nav>
      </div>

      {/* Bottom items */}
      <div className={cn("border-t border-border-color/50 py-3", collapsed ? "px-2" : "px-3")}>
        <nav className="space-y-1">
          {bottomItems.map((item) => (
            <Tooltip key={item.name} label={item.name} show={collapsed}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center text-sm font-medium rounded-xl transition-all duration-200',
                    collapsed ? 'w-10 h-10 justify-center' : 'px-3 py-2',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary'
                  )
                }
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200", !collapsed && 'mr-3')} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </Tooltip>
          ))}
        </nav>
      </div>

      {/* Collapse toggle button (desktop only) */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="hidden md:flex absolute bottom-20 -right-3 w-6 h-6 bg-bg-surface border border-border-color rounded-full items-center justify-center shadow-premium hover:bg-bg-surface-hover hover:shadow-glow transition-all z-10 text-text-tertiary hover:text-text-primary"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.div>
  );
}
