import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, CheckSquare, Target, Activity, Calendar, Settings } from 'lucide-react';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!isOpen) return null;

  const commands = [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { name: 'Tasks', icon: CheckSquare, route: '/tasks' },
    { name: 'Goals', icon: Target, route: '/goals' },
    { name: 'Habits', icon: Activity, route: '/habits' },
    { name: 'Calendar', icon: Calendar, route: '/calendar' },
    { name: 'Settings', icon: Settings, route: '/settings' },
  ];

  const filtered = commands.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (route: string) => {
    navigate(route);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-lg mx-4 bg-bg-surface rounded-xl shadow-2xl border border-border-color overflow-hidden transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-border-color">
          <Search className="h-5 w-5 text-text-secondary mr-3" />
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary text-base h-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border-color bg-bg-base px-1.5 font-mono text-[10px] font-medium text-text-secondary">
            ESC
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-sm text-text-secondary">No results found.</div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.name}
                className="w-full flex items-center px-4 py-3 text-sm text-text-primary hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                onClick={() => handleSelect(cmd.route)}
              >
                <cmd.icon className="h-4 w-4 mr-3" />
                {cmd.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
