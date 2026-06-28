import { useState } from 'react';
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal, type Goal } from '../hooks/useGoals';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Target, Plus, Trash2, Edit2 } from 'lucide-react';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
} as const;

function ProgressRing({ progress }: { progress: number }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-20 h-20">
        <circle
          className="text-bg-base border-border-color"
          strokeWidth="6"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
        <motion.circle
          className={`${progress === 100 ? 'text-success' : 'text-primary'}`}
          strokeWidth="6"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-text-primary">{progress}%</span>
      </div>
    </div>
  );
}

export function Goals() {
  const { data: goals, isLoading, error } = useGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [formData, setFormData] = useState<Partial<Goal>>({
    title: '',
    description: '',
    goalType: 'PERSONAL',
    progress: 0,
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16)
  });

  const openCreateForm = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      goalType: 'PERSONAL',
      progress: 0,
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16)
    });
    setIsFormOpen(true);
  };

  const openEditForm = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      goalType: goal.goalType,
      progress: goal.progress,
      deadline: new Date(goal.deadline).toISOString().slice(0, 16)
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
    };

    if (editingGoal) {
      updateGoal.mutate(
        { id: editingGoal._id, updates: payload },
        {
          onSuccess: () => {
            toast.success('Goal updated');
            setIsFormOpen(false);
          },
          onError: () => toast.error('Failed to update goal')
        }
      );
    } else {
      createGoal.mutate(
        payload,
        {
          onSuccess: () => {
            toast.success('Goal created');
            setIsFormOpen(false);
          },
          onError: () => toast.error('Failed to create goal')
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this goal? Note: Tasks associated with this goal will remain intact.')) {
      deleteGoal.mutate(id, {
        onSuccess: () => toast.success('Goal deleted (Tasks retained)'),
        onError: () => toast.error('Failed to delete goal')
      });
    }
  };

  const updateProgress = (goal: Goal, newProgress: number) => {
    if (newProgress < 0 || newProgress > 100) return;
    updateGoal.mutate({ id: goal._id, updates: { progress: newProgress } });
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
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Goals</h1>
          <p className="text-text-secondary mt-1">Track your long-term objectives and milestones.</p>
        </div>
        <Button className="flex items-center gap-2 bg-bg-surface-hover text-text-primary border border-border-color hover:bg-bg-surface shadow-sm" onClick={openCreateForm}>
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      <div className="flex-1 overflow-auto premium-scrollbar pb-4">
        {isLoading ? (
          <Spinner className="h-64" />
        ) : error ? (
          <div className="text-danger text-center p-8">Failed to load goals.</div>
        ) : goals && goals.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {goals.map(goal => (
              <motion.div variants={item} key={goal._id}>
                <Card className="h-full hover:border-border-highlight transition-all duration-300 bg-gradient-to-br from-bg-surface to-bg-surface-hover border border-border-color/60 rounded-[16px] shadow-sm hover:shadow-md group">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-4">
                          <Badge variant="outline" className="mb-2 bg-bg-base/50">{goal.goalType}</Badge>
                          <h3 className={`font-bold text-xl leading-tight ${goal.progress === 100 ? 'text-success' : 'text-text-primary group-hover:text-primary transition-colors'}`}>
                            {goal.title}
                          </h3>
                        </div>
                        <ProgressRing progress={goal.progress} />
                      </div>
                      {goal.description && <p className="text-sm text-text-secondary line-clamp-3 mb-4 leading-relaxed">{goal.description}</p>}
                    </div>
                    
                    <div className="pt-4 border-t border-border-color/30 mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Target Date</span>
                        <span className="text-sm font-semibold text-text-secondary">{new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => updateProgress(goal, goal.progress - 10)} disabled={goal.progress <= 0}>-10%</Button>
                          <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => updateProgress(goal, goal.progress + 10)} disabled={goal.progress >= 100}>+10%</Button>
                        </div>
                        <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditForm(goal)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" className="text-danger hover:bg-danger/10 h-8 w-8 p-0" size="sm" onClick={() => handleDelete(goal._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex-1 overflow-auto flex flex-col items-center justify-center text-text-secondary border-2 border-dashed border-border-color/50 rounded-3xl bg-bg-surface-hover/30 p-12 min-h-[400px]">
            <div className="w-24 h-24 mb-6 rounded-full bg-bg-surface flex items-center justify-center shadow-sm border border-border-color/50">
              <Target className="h-10 w-10 text-text-tertiary" />
            </div>
            <p className="text-2xl font-bold text-text-primary mb-2">No Goals Set Yet</p>
            <p className="text-sm max-w-sm text-center leading-relaxed">
              Define your big-picture objectives here. AI will help break them down into actionable tasks over time.
            </p>
          </div>
        )}
      </div>

      <Dialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingGoal ? "Edit Goal" : "Create Goal"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">Title</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="What do you want to achieve?" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">Description</label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Why is this important?" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">Type</label>
              <Select value={formData.goalType} onChange={e => setFormData({...formData, goalType: e.target.value as any})}>
                <option value="PERSONAL">Personal</option>
                <option value="CAREER">Career</option>
                <option value="ACADEMIC">Academic</option>
                <option value="SHORT_TERM">Short Term</option>
                <option value="LONG_TERM">Long Term</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">Deadline</label>
              <Input type="datetime-local" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
            </div>
          </div>
          {editingGoal && (
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">Progress (%)</label>
              <Input type="number" min="0" max="100" required value={formData.progress} onChange={e => setFormData({...formData, progress: parseInt(e.target.value)})} />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4 border-t border-border-color/50 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={createGoal.isPending || updateGoal.isPending}>
              {editingGoal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  );
}
