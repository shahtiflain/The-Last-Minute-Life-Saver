import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Target, Activity, Calendar,
  Settings, Sparkles, Search, ChevronLeft, ChevronRight, User
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', to: '/tasks', icon: CheckSquare },
  { name: 'Calendar', to: '/calendar', icon: Calendar },
  { name: 'Goals', to: '/goals', icon: Target },
  { name: 'Habits', to: '/habits', icon: Activity },
  { name: 'AI Coach', to: '/ai-coach', icon: Sparkles },
];

const bottomItems = [
  { name: 'Profile', to: '/profile', icon: User },
  { name: 'Settings', to: '/settings', icon: Settings },
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
}

export function Sidebar({ onCollapsedChange }: SidebarProps) {
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

  const triggerCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  };

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
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#383838] to-[#1E1E1E] dark:from-[#3a3a3a] dark:to-[#222222] flex items-center justify-center shadow-sm border border-[#444] flex-shrink-0">
            <span className="text-white font-bold text-lg font-serif leading-none">H</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[17px] font-semibold tracking-tight text-text-primary overflow-hidden whitespace-nowrap pl-1"
              >
                Hustlr
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search button */}
      <div className="px-3 py-3 flex-shrink-0">
        <Tooltip label="Search (Ctrl+K)" show={collapsed}>
          <button
            onClick={triggerCommandPalette}
            className={cn(
              "flex items-center gap-2 text-sm text-text-tertiary bg-bg-surface-hover/60 border border-border-color rounded-xl hover:bg-bg-surface-hover hover:text-text-secondary transition-all",
              collapsed ? "w-10 h-10 justify-center p-0" : "w-full px-3 py-2"
            )}
          >
            <Search className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 overflow-hidden whitespace-nowrap flex-1"
                >
                  <span className="flex-1 text-left">Search...</span>
                  <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-xs font-semibold text-text-tertiary bg-bg-base border border-border-color rounded-md">
                    ⌘K
                  </kbd>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </Tooltip>
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

      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute bottom-20 -right-3 w-6 h-6 bg-bg-surface border border-border-color rounded-full flex items-center justify-center shadow-premium hover:bg-bg-surface-hover hover:shadow-glow transition-all z-10 text-text-tertiary hover:text-text-primary"
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
