import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Target, Activity, Calendar,
  Settings, Sparkles, ChevronLeft, ChevronRight, LineChart, ChevronDown
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

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

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  show: boolean;
}

function Tooltip({ label, children, show }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  if (!show) return <>{children}</>;

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none"
          >
            <div className="glass-dark text-text-primary text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-border-highlight/30">
              {label}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-border-highlight/30" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      <div className={cn("flex flex-col px-4 py-4 border-b border-border-color/50 gap-4 flex-shrink-0 transition-all", collapsed ? "items-center" : "")}>
        {/* Brand */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            H
          </div>
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-bold text-text-primary tracking-wide whitespace-nowrap overflow-hidden"
            >
              Hustlr AI
            </motion.span>
          )}
        </div>

        {/* Workspace Selector */}
        {!collapsed && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-bg-surface-hover transition-colors text-xs text-text-primary border border-transparent hover:border-border-color"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></div>
              <span className="truncate">Shah's Workspace</span>
            </div>
            <ChevronDown className="w-3 h-3 text-text-tertiary flex-shrink-0 ml-1" />
          </motion.button>
        )}
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
                        <>
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden whitespace-nowrap"
                          >
                            {item.name}
                          </motion.span>
                          {item.isNew && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded text-[#10b981] uppercase tracking-wider"
                            >
                              NEW
                            </motion.span>
                          )}
                          {item.badge && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="ml-auto text-[10px] font-medium bg-[#3f3f46] text-white px-2 py-0.5 rounded-md"
                            >
                              {item.badge}
                            </motion.span>
                          )}
                        </>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            </Tooltip>
          ))}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className={cn("border-t border-border-color/50 py-3", collapsed ? "px-2" : "px-3")}>
        <div className={cn("flex items-center justify-between", collapsed ? "flex-col gap-2" : "")}>
          <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
            <div className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center text-xs font-medium text-text-primary border border-border-color relative flex-shrink-0">
              {auth?.currentUser?.displayName?.charAt(0) || 'S'}
              <div className="absolute w-2.5 h-2.5 bg-success rounded-full border-2 border-bg-base -bottom-1 -right-1"></div>
            </div>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col min-w-0"
              >
                <span className="text-[13px] font-medium text-text-primary leading-tight truncate">
                  {auth?.currentUser?.displayName || 'Shah R.'}
                </span>
                <span className="text-[10px] text-text-tertiary flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                  PRO PLAN
                </span>
              </motion.div>
            )}
          </div>
          <NavLink
            to="/settings"
            onClick={onNavigate}
            className={cn("text-text-tertiary hover:text-text-primary transition-colors", collapsed ? "mt-2 p-1" : "p-1.5")}
          >
            <Settings className="w-4 h-4" />
          </NavLink>
        </div>
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
