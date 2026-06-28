import { Menu, Moon, Sun, Search, Bell, Sparkles } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { auth } from '../../config/firebase';
import { Button } from '../ui/Button';
import { useAuth } from '../../features/auth/AuthProvider';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { isDark, toggleTheme } = useThemeStore();
  const { currentUser } = useAuth();

  const handleLogout = () => {
    if (auth) {
      auth.signOut();
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 border-b border-border-color/50 bg-bg-surface/60 backdrop-blur-md sm:px-6 sticky top-0 z-30 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary md:hidden p-2 -ml-2 rounded-lg"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        
        {/* Global Search / Command Palette Trigger */}
        <button className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-bg-base border border-border-color rounded-lg text-text-tertiary hover:text-text-secondary hover:border-border-highlight transition-all shadow-sm w-64 group">
          <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
          <span className="text-sm font-medium">Quick search...</span>
          <kbd className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded bg-bg-surface border border-border-color text-[10px] font-bold text-text-secondary shadow-sm">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          title="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button className="relative p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary hidden sm:block">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-danger rounded-full border-2 border-bg-surface"></span>
        </button>
        
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20 rounded-full cursor-pointer hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-shadow">
          <Sparkles className="w-3.5 h-3.5 text-warning" />
          <span className="text-xs font-bold text-warning tracking-wide">PRO PLAN</span>
        </div>
        
        <div className="h-6 w-px bg-border-color hidden sm:block"></div>
        
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <div className="hidden sm:block text-sm text-right">
                <p className="font-medium leading-none text-text-primary">
                  {currentUser.displayName || 'User'}
                </p>
                <p className="text-text-tertiary text-xs mt-1 truncate max-w-[150px]">
                  {currentUser.email}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10">
                Logout
              </Button>
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={() => window.dispatchEvent(new CustomEvent('auth:unauthorized'))} className="rounded-[10px]">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
