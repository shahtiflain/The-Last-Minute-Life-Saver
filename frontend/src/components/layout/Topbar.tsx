import { Menu, Moon, Sun } from 'lucide-react';
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
      <div className="flex items-center">
        <button
          type="button"
          className="text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary md:hidden p-2 -ml-2 rounded-lg"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
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
