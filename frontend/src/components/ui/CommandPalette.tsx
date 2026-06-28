import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, LayoutDashboard, CheckSquare, Target, Activity,
  Settings, Sparkles, Plus, ArrowRight, User,
  Brain, CalendarDays, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../hooks/useTasks';
import { useGoals } from '../../hooks/useGoals';
import { useHabits } from '../../hooks/useHabits';
import { cn } from '../../utils/cn';

interface Command {
  id: string;
  name: string;
  description?: string;
  icon: React.ElementType;
  iconColor?: string;
  section: string;
  action: () => void;
  keywords?: string[];
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);

  const { data: tasks } = useTasks();
  const { data: goals } = useGoals();
  const { data: habits } = useHabits();

  const close = useCallback(() => {
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(o => {
          if (o) { close(); return false; }
          setTimeout(() => inputRef.current?.focus(), 50);
          return true;
        });
      }
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [close]);

  const staticCommands: Command[] = [
    // Navigation
    { id: 'nav-dashboard', name: 'Dashboard', description: 'Go to Dashboard', icon: LayoutDashboard, section: 'Navigate', action: () => { navigate('/dashboard'); close(); }, keywords: ['home', 'overview'] },
    { id: 'nav-tasks', name: 'Tasks', description: 'View all tasks', icon: CheckSquare, section: 'Navigate', action: () => { navigate('/tasks'); close(); }, keywords: ['todo', 'work'] },
    { id: 'nav-calendar', name: 'Calendar', description: 'Open Calendar', icon: CalendarDays, section: 'Navigate', action: () => { navigate('/calendar'); close(); }, keywords: ['schedule', 'events'] },
    { id: 'nav-goals', name: 'Goals', description: 'View your goals', icon: Target, section: 'Navigate', action: () => { navigate('/goals'); close(); }, keywords: ['objectives'] },
    { id: 'nav-habits', name: 'Habits', description: 'Track habits', icon: Activity, section: 'Navigate', action: () => { navigate('/habits'); close(); }, keywords: ['routine', 'streak'] },
    { id: 'nav-ai-coach', name: 'AI Coach', description: 'Open AI Planner', icon: Brain, section: 'Navigate', iconColor: 'text-primary', action: () => { navigate('/ai-coach'); close(); }, keywords: ['ai', 'assistant', 'planner'] },
    { id: 'nav-settings', name: 'Settings', description: 'App preferences', icon: Settings, section: 'Navigate', action: () => { navigate('/settings'); close(); } },
    { id: 'nav-profile', name: 'Profile', description: 'Your account', icon: User, section: 'Navigate', action: () => { navigate('/profile'); close(); } },
    // Create
    { id: 'create-task', name: 'Create Task', description: 'Add a new task', icon: Plus, iconColor: 'text-info', section: 'Create', action: () => { navigate('/tasks?new=task'); close(); }, keywords: ['add task', 'new task'] },
    { id: 'create-goal', name: 'Create Goal', description: 'Set a new goal', icon: Plus, iconColor: 'text-secondary', section: 'Create', action: () => { navigate('/goals?new=goal'); close(); }, keywords: ['add goal', 'new goal'] },
    { id: 'create-habit', name: 'Create Habit', description: 'Start a new habit', icon: Plus, iconColor: 'text-accent', section: 'Create', action: () => { navigate('/habits?new=habit'); close(); }, keywords: ['add habit', 'new habit'] },
    // AI
    { id: 'ai-planner', name: 'Run AI Planner', description: 'Generate smart schedule', icon: Zap, iconColor: 'text-warning', section: 'AI', action: () => { navigate('/calendar?run=planner'); close(); }, keywords: ['schedule', 'plan', 'generate'] },
    { id: 'ai-coach', name: 'Ask AI Coach', description: 'Chat with your coach', icon: Sparkles, iconColor: 'text-primary', section: 'AI', action: () => { navigate('/ai-coach'); close(); }, keywords: ['chat', 'help', 'advice'] },
  ];

  // Dynamic task/goal/habit search results
  const dynamicCommands: Command[] = search.length >= 2 ? [
    ...(tasks?.filter(t => t.title.toLowerCase().includes(search.toLowerCase())).slice(0, 3).map(t => ({
      id: `task-${t._id}`,
      name: t.title,
      description: `Task · ${t.status}`,
      icon: CheckSquare,
      iconColor: 'text-info',
      section: 'Tasks',
      action: () => { navigate('/tasks'); close(); },
    })) ?? []),
    ...(goals?.filter(g => g.title.toLowerCase().includes(search.toLowerCase())).slice(0, 3).map(g => ({
      id: `goal-${g._id}`,
      name: g.title,
      description: `Goal · ${g.progress}% complete`,
      icon: Target,
      iconColor: 'text-secondary',
      section: 'Goals',
      action: () => { navigate('/goals'); close(); },
    })) ?? []),
    ...(habits?.filter(h => h.title.toLowerCase().includes(search.toLowerCase())).slice(0, 3).map(h => ({
      id: `habit-${h._id}`,
      name: h.title,
      description: 'Habit',
      icon: Activity,
      iconColor: 'text-accent',
      section: 'Habits',
      action: () => { navigate('/habits'); close(); },
    })) ?? []),
  ] : [];

  const allCommands = search.length >= 2
    ? [...dynamicCommands, ...staticCommands.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase()) ||
        c.keywords?.some(k => k.toLowerCase().includes(search.toLowerCase()))
      )]
    : staticCommands;

  // Group by section
  const sections = allCommands.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.section]) acc[cmd.section] = [];
    acc[cmd.section].push(cmd);
    return acc;
  }, {});

  const flat = allCommands;

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, flat.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && flat[selectedIndex]) {
        flat[selectedIndex].action();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, flat, selectedIndex]);

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  let globalIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-md"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full max-w-xl mx-4 bg-bg-surface/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border-highlight/50 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center px-4 py-3.5 border-b border-border-color/50 gap-3">
              <Search className="h-4 w-4 text-text-tertiary flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search or jump to..."
                className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-tertiary text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-text-tertiary hover:text-text-secondary text-xs px-2 py-0.5 rounded bg-bg-surface-hover border border-border-color"
                >
                  Clear
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center rounded border border-border-color bg-bg-surface-hover px-2 py-0.5 font-mono text-xs text-text-tertiary">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-80 overflow-y-auto p-2 premium-scrollbar">
              {flat.length === 0 ? (
                <div className="py-10 text-center text-sm text-text-tertiary">
                  <Search className="h-7 w-7 mx-auto mb-2 opacity-30" />
                  No results for "{search}"
                </div>
              ) : (
                Object.entries(sections).map(([section, cmds]) => (
                  <div key={section} className="mb-2">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                      {section}
                    </div>
                    {cmds.map(cmd => {
                      const idx = globalIndex++;
                      const isSelected = idx === selectedIndex;
                      return (
                        <button
                          key={cmd.id}
                          data-index={idx}
                          className={cn(
                            'w-full flex items-center px-3 py-2.5 text-sm rounded-xl transition-all duration-100 group text-left gap-3',
                            isSelected
                              ? 'bg-primary/10 text-primary'
                              : 'text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary'
                          )}
                          onClick={cmd.action}
                          onMouseEnter={() => setSelectedIndex(idx)}
                        >
                          <div className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                            isSelected ? 'bg-primary/20' : 'bg-bg-base group-hover:bg-primary/10'
                          )}>
                            <cmd.icon className={cn('h-3.5 w-3.5', cmd.iconColor ?? (isSelected ? 'text-primary' : 'text-text-tertiary'))} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{cmd.name}</div>
                            {cmd.description && (
                              <div className="text-xs text-text-tertiary truncate">{cmd.description}</div>
                            )}
                          </div>
                          {isSelected && <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-border-color/50 flex items-center gap-4 text-xs text-text-tertiary">
              <span className="flex items-center gap-1"><kbd className="font-mono bg-bg-surface-hover border border-border-color px-1.5 py-0.5 rounded text-[10px]">↑↓</kbd> navigate</span>
              <span className="flex items-center gap-1"><kbd className="font-mono bg-bg-surface-hover border border-border-color px-1.5 py-0.5 rounded text-[10px]">↵</kbd> select</span>
              <span className="flex items-center gap-1"><kbd className="font-mono bg-bg-surface-hover border border-border-color px-1.5 py-0.5 rounded text-[10px]">ESC</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
