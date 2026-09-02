import { Menu, Moon, Sun, Bell, Search, Calendar, Sparkles } from 'lucide-react';
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
    <header className="flex items-center justify-between h-16 px-3 sm:px-6 border-b border-border-color/50 bg-bg-surface/60 backdrop-blur-md sticky top-0 z-30 transition-all duration-300 gap-2">
      
      {/* Left Section */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          className="text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary p-2 -ml-1 rounded-lg"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        </button>
        <div className="flex items-center md:hidden">
          <img src={logo} alt="Hustlr Logo" className="w-7 h-7 object-contain mix-blend-screen" />
        </div>
      </div>

      {/* Center Section - Search Bar */}
      <div className="flex-1 flex justify-center px-1 sm:px-4 max-w-2xl min-w-0">
        <button 
          onClick={triggerSearch}
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-bg-base border border-border-color rounded-xl text-text-tertiary hover:text-text-secondary hover:border-border-highlight transition-all w-full max-w-lg group shadow-sm"
        >
          <Search className="w-4 h-4 flex-shrink-0 group-hover:text-primary transition-colors" />
          <span className="text-xs sm:text-sm font-medium flex-1 text-left truncate">Search tasks, goals...</span>
          <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-bg-surface border border-border-color text-[10px] font-bold text-text-secondary shadow-sm flex-shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0 justify-end">
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          title="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
        </button>

        <button 
          onClick={() => {
            toast("No new notifications", { icon: "🔔" });
          }}
          className="relative p-1.5 sm:p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          title="Notifications"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-primary text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-bg-surface">
            3
          </span>
        </button>
        
        <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all hidden sm:block">
          <Calendar className="h-5 w-5" />
        </button>
        
        <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all hidden sm:block">
          <Sparkles className="h-5 w-5" />
        </button>

        {!currentUser && (
          <Button variant="primary" size="sm" onClick={() => window.dispatchEvent(new CustomEvent('auth:unauthorized'))} className="rounded-[10px] text-xs px-2.5 py-1.5 sm:px-3">
            Sign In
          </Button>
        )}

        {currentUser && <ProfileDropdown />}
      </div>
    </header>
  );
}
