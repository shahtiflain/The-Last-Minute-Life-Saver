import { useState } from 'react';
import { useHabits, useCreateHabit, useUpdateHabit, useDeleteHabit, type Habit } from '../hooks/useHabits';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Activity, Plus, Trash2, Edit2, CheckCircle, Flame, Trophy } from 'lucide-react';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { toast } from 'react-hot-toast';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
} as const;

export function Habits() {
  const { data: habits, isLoading, error } = useHabits();
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const [formData, setFormData] = useState<Partial<Habit>>({
    title: '',
    frequencyDays: [0, 1, 2, 3, 4, 5, 6],
    reminderEnabled: false,
  });

  const openCreateForm = () => {
    setEditingHabit(null);
    setFormData({
      title: '',
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      reminderEnabled: false,
    });
    setIsFormOpen(true);
  };

  const openEditForm = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData({
      title: habit.title,
      frequencyDays: habit.frequencyDays,
      reminderEnabled: habit.reminderEnabled,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHabit) {
      updateHabit.mutate(
        { id: editingHabit._id, updates: formData },
        {
          onSuccess: () => {
            toast.success('Habit updated');
            setIsFormOpen(false);
          },
          onError: () => toast.error('Failed to update habit')
        }
      );
    } else {
      createHabit.mutate(
        formData,
        {
          onSuccess: () => {
            toast.success('Habit created');
            setIsFormOpen(false);
          },
          onError: () => toast.error('Failed to create habit')
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit.mutate(id, {
        onSuccess: () => toast.success('Habit deleted'),
        onError: () => toast.error('Failed to delete habit')
      });
    }
  };

  const toggleDay = (dayIndex: number) => {
    setFormData(prev => {
      const days = prev.frequencyDays || [];
      if (days.includes(dayIndex)) {
        return { ...prev, frequencyDays: days.filter(d => d !== dayIndex) };
      } else {
        return { ...prev, frequencyDays: [...days, dayIndex] };
      }
    });
  };

  const toggleCompletedToday = (habit: Habit) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const completedDates = habit.completedDates || [];
    
    // Check if any date in completedDates matches today
    const hasCompletedToday = completedDates.some(date => date.startsWith(todayStr));
    
    let newCompletedDates = [...completedDates];
    let newStreak = habit.currentStreak || 0;
    
    if (hasCompletedToday) {
      // Un-complete
      newCompletedDates = newCompletedDates.filter(date => !date.startsWith(todayStr));
      newStreak = Math.max(0, newStreak - 1);
    } else {
      // Complete
      newCompletedDates.push(new Date().toISOString());
      newStreak += 1;
    }
    
    const longestStreak = Math.max(habit.longestStreak || 0, newStreak);
    
    updateHabit.mutate({
      id: habit._id,
      updates: {
        completedDates: newCompletedDates,
        currentStreak: newStreak,
        longestStreak
      }
    }, {
      onSuccess: () => {
        if (!hasCompletedToday) toast.success(`Completed ${habit.title} for today!`);
      }
    });
  };

  const daysLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Generate a mock heatmap array (e.g., last 21 days) for visual appeal
  const renderHeatmap = (habit: Habit) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const completedDates = habit.completedDates || [];
    const hasCompletedToday = completedDates.some(date => date.startsWith(todayStr));
    
    return (
      <div className="flex gap-1 mt-4 justify-end opacity-80">
        {Array(21).fill(0).map((_, i) => {
          // Mocking historical data based on current streak if actual dates aren't available to make it look good
          const isToday = i === 20;
          const isInStreak = i >= 21 - (habit.currentStreak || 0);
          const isCompleted = isToday ? hasCompletedToday : isInStreak;
          const isFuture = false;
          
          return (
            <div 
              key={i}
              className={cn(
                "w-2.5 h-6 rounded-sm transition-all duration-300",
                isFuture ? "bg-bg-surface-hover opacity-50" :
                isCompleted ? "bg-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)]" : "bg-bg-surface-hover border border-border-color/30"
              )}
            />
          );
        })}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 h-full flex flex-col max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Habits</h1>
          <p className="text-text-secondary mt-1">Build positive routines and maintain your streaks.</p>
        </div>
        <Button className="flex items-center gap-2 bg-bg-surface-hover text-text-primary border border-border-color hover:bg-bg-surface shadow-sm" onClick={openCreateForm}>
          <Plus className="h-4 w-4" />
          New Habit
        </Button>
      </div>

      <div className="flex-1 overflow-auto premium-scrollbar pb-4">
        {isLoading ? (
          <Spinner className="h-64" />
        ) : error ? (
          <div className="text-danger text-center p-8">Failed to load habits.</div>
        ) : habits && habits.length > 0 ? (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map(habit => {
              const todayStr = new Date().toISOString().slice(0, 10);
              const isCompletedToday = (habit.completedDates || []).some(date => date.startsWith(todayStr));
              const isOnFire = (habit.currentStreak || 0) > 2;
              
              return (
                <motion.div variants={item} key={habit._id}>
                  <Card className="hover:border-border-highlight transition-all duration-300 h-full bg-gradient-to-br from-bg-surface to-bg-surface-hover border border-border-color/60 rounded-[16px] shadow-sm hover:shadow-md group">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-text-primary group-hover:text-primary transition-colors">{habit.title}</h3>
                            <div className="flex gap-4 mt-3">
                              <div className="flex items-center gap-1.5 text-sm font-medium">
                                <Flame className={cn("w-4 h-4", isOnFire ? "text-orange-500" : "text-text-tertiary")} />
                                <span className={isOnFire ? "text-orange-500" : "text-text-secondary"}>{habit.currentStreak}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm font-medium">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <span className="text-text-secondary">{habit.longestStreak}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" onClick={() => openEditForm(habit)} className="p-1 h-8 w-8 text-text-secondary hover:text-primary">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(habit._id)} className="p-1 h-8 w-8 text-danger hover:bg-danger/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mb-2">
                          {daysLabels.map((day, i) => {
                            const isScheduled = habit.frequencyDays.includes(i);
                            return (
                              <div 
                                key={i} 
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                  isScheduled 
                                    ? "bg-primary text-white shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.3)]" 
                                    : "bg-bg-surface border border-border-color/50 text-text-tertiary"
                                )}
                              >
                                {day}
                              </div>
                            );
                          })}
                        </div>
                        {renderHeatmap(habit)}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-border-color/30 flex justify-end">
                        <Button 
                          variant={isCompletedToday ? "outline" : "premium"} 
                          className={cn(
                            "w-full transition-all duration-300 shadow-sm",
                            isCompletedToday ? "text-success border-success/30 hover:bg-success/5 hover:border-success" : ""
                          )}
                          onClick={() => toggleCompletedToday(habit)}
                        >
                          {isCompletedToday ? (
                            <span className="flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Completed</span>
                          ) : "Complete Today"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="flex-1 overflow-auto flex flex-col items-center justify-center text-text-secondary border-2 border-dashed border-border-color/50 rounded-3xl bg-bg-surface-hover/30 p-12 min-h-[400px]">
            <div className="w-24 h-24 mb-6 rounded-full bg-bg-surface flex items-center justify-center shadow-sm border border-border-color/50">
              <Activity className="h-10 w-10 text-text-tertiary" />
            </div>
            <p className="text-2xl font-bold text-text-primary mb-2">No Habits Set Yet</p>
            <p className="text-sm max-w-sm text-center leading-relaxed">
              Start building better routines today. Small consistent actions lead to massive results.
            </p>
          </div>
        )}
      </div>

      <Dialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingHabit ? "Edit Habit" : "Create Habit"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">Habit Title</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Read 10 pages, Meditate, Exercise" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-3 text-text-secondary">Frequency (Days of Week)</label>
            <div className="flex justify-between gap-1">
              {daysLabels.map((day, i) => {
                const isSelected = (formData.frequencyDays || []).includes(i);
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => toggleDay(i)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      isSelected 
                        ? "bg-primary text-white shadow-md transform scale-110" 
                        : "bg-bg-surface border border-border-color/50 text-text-secondary hover:bg-border-color/50"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-3 pt-4 border-t border-border-color/30 mt-4">
            <input 
              type="checkbox" 
              id="reminder" 
              checked={formData.reminderEnabled} 
              onChange={e => setFormData({...formData, reminderEnabled: e.target.checked})} 
              className="rounded bg-bg-surface border-border-color text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            />
            <label htmlFor="reminder" className="text-sm font-medium cursor-pointer">Enable notifications for this habit</label>
          </div>
          
          <div className="flex justify-end gap-2 pt-6">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={createHabit.isPending || updateHabit.isPending}>
              {editingHabit ? 'Save Changes' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  );
}
