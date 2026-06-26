import { Menu, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { auth } from '../../config/firebase';
import { Button } from '../ui/Button';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { isDark, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 border-b border-border-color bg-bg-surface sm:px-6">
      <div className="flex items-center">
        <button
          type="button"
          className="text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary md:hidden"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-base rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-sm text-right">
            <p className="font-medium leading-none text-text-primary">
              {auth.currentUser?.displayName || 'User'}
            </p>
            <p className="text-text-secondary text-xs mt-1">
              {auth.currentUser?.email}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
