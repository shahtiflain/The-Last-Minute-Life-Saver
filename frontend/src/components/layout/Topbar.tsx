import { Menu, Moon, Sun, Search, Calendar, Sparkles, User } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { Button } from '../ui/Button';
import { useAuth } from '../../features/auth/AuthProvider';
import toast from 'react-hot-toast';
import { ProfileDropdown } from './ProfileDropdown';
import logo from '../../assets/logo.png';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { isDark, toggleTheme } = useThemeStore();
  const { currentUser } = useAuth();

  const triggerSearch = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  };

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b border-border-color bg-bg-surface sm:px-6">
      <div className="flex items-center flex-1">
        <button
          type="button"
          className="text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary md:hidden mr-4"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        
        {/* Search Input */}
        <div className="hidden md:flex flex-1 max-w-md relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-1.5 border border-border-color rounded-md leading-5 bg-bg-base text-text-primary placeholder-text-tertiary focus:outline-none focus:bg-bg-surface focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
            placeholder="Search tasks, goals, or prompt AI..."
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <kbd className="inline-flex items-center border border-border-color rounded px-1.5 text-[10px] font-sans font-medium text-text-tertiary">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Status Badge */}
        <div className="hidden lg:flex items-center px-2.5 py-1 rounded-full bg-success/10 border border-success/20">
          <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
          <span className="text-xs font-medium text-success">All systems operational</span>
        </div>

        <div className="h-5 w-px bg-border-color hidden sm:block"></div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-base rounded-md transition-colors focus:outline-none"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications / Calendar */}
        <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-base rounded-md transition-colors focus:outline-none relative">
          <Calendar className="h-4 w-4" />
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-danger text-[8px] font-bold text-white flex items-center justify-center -translate-y-1/2 translate-x-1/2 border-2 border-bg-surface">
            3
          </span>
        </button>

        {/* Ask AI Button */}
        <Button variant="primary" size="sm" className="hidden sm:flex bg-gradient-to-r from-primary to-purple-500 border-0 h-8 text-xs px-3 shadow-sm shadow-primary/20">
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Ask AI
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
          <div className="h-7 w-7 rounded-full bg-bg-base border border-border-color flex items-center justify-center text-text-secondary overflow-hidden">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
