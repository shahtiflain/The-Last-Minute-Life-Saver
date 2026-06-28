import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, type Task } from '../hooks/useTasks';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Plus, Inbox, Trash2, Edit2, CheckCircle, Wand2, Search, Sparkles } from 'lucide-react';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { motion } from 'framer-motion';
import { TasksKanban } from '../components/widgets/TasksKanban';

export function Tasks() {
  const queryClient = useQueryClient();
  const { data: tasks, isLoading, error } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: 'General',
    deadline: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  });

  const [aiIntent, setAiIntent] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const openCreateForm = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
      category: 'General',
      deadline: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
    });
    setIsFormOpen(true);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      deadline: new Date(task.deadline).toISOString().slice(0, 16)
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask._id, updates: formData },
        {
          onSuccess: () => {
            toast.success('Task updated');
            setIsFormOpen(false);
          },
          onError: () => toast.error('Failed to update task')
        }
      );
    } else {
      createTask.mutate(
        formData,
        {
          onSuccess: () => {
            toast.success('Task created');
            setIsFormOpen(false);
          },
          onError: () => toast.error('Failed to create task')
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(id, {
        onSuccess: () => toast.success('Task deleted'),
        onError: () => toast.error('Failed to delete task')
      });
    }
  };

  const handleToggleComplete = (task: Task) => {
    const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    updateTask.mutate(
      { id: task._id, updates: { status: newStatus } },
      {
        onSuccess: () => toast.success(`Task marked as ${newStatus}`),
        onError: () => toast.error('Failed to update task')
      }
    );
  };

  const handleAiPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiIntent) return;
    
    setIsAiLoading(true);
    try {
      const oauthToken = localStorage.getItem('google_oauth_token');
      const calendarTokens = oauthToken ? { token: oauthToken } : undefined;

      const response = await api.post('/api/ai/orchestrate', {
        intent: aiIntent,
        calendarTokens
      });
      
      const { agent_responses } = response.data;
      if (agent_responses && agent_responses.length > 0) {
        toast.success('Planner Agent successfully processed your request!');
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['analytics'] });
        setIsAiOpen(false);
        setAiIntent('');
      } else {
        toast.error('AI was unable to process your request.');
      }
    } catch (error) {
      toast.error('AI Orchestration failed. Check your API connections.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredTasks = tasks?.filter(t => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const [view, setView] = useState<'LIST' | 'KANBAN'>('LIST');

  const handleStatusChange = (task: Task, newStatus: string) => {
    updateTask.mutate(
      { id: task._id, updates: { status: newStatus as Task['status'] } },
      {
        onSuccess: () => toast.success(`Task moved to ${newStatus}`),
        onError: () => toast.error('Failed to move task')
      }
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
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Tasks</h1>
          <p className="text-text-secondary mt-1">Manage your pending work and upcoming deadlines.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="premium" className="flex items-center gap-2" onClick={() => setIsAiOpen(true)}>
            <Wand2 className="h-4 w-4" />
            AI Plan
          </Button>
          <Button className="flex items-center gap-2 bg-bg-surface-hover text-text-primary border border-border-color hover:bg-bg-surface" onClick={openCreateForm}>
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex bg-bg-surface-hover p-1 rounded-lg border border-border-color shadow-sm w-full sm:w-auto">
          <button 
            className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'LIST' ? 'bg-bg-surface shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'}`}
            onClick={() => setView('LIST')}
          >
            List
          </button>
          <button 
            className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'KANBAN' ? 'bg-bg-surface shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'}`}
            onClick={() => setView('KANBAN')}
          >
            Board
          </button>
        </div>

        <div className="flex gap-3 items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-9 h-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {view === 'LIST' && (
            <Select 
              className="w-32 h-9"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">Active</option>
              <option value="COMPLETED">Done</option>
            </Select>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        {isLoading ? (
          <Spinner className="h-64" />
        ) : error ? (
          <div className="text-danger text-center p-8">Failed to load tasks.</div>
        ) : filteredTasks && filteredTasks.length > 0 ? (
          view === 'LIST' ? (
            <div className="space-y-3 pb-4">
              {filteredTasks.map(task => (
                <Card key={task._id} className="hover:border-border-highlight transition-all duration-200 bg-bg-surface border border-border-color/60 rounded-xl shadow-sm group">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <button 
                        onClick={() => handleToggleComplete(task)}
                        className={`mt-1 flex-shrink-0 transition-all hover:scale-110 ${task.status === 'COMPLETED' ? 'text-success' : 'text-text-tertiary hover:text-primary'}`}
                      >
                        <CheckCircle className="h-6 w-6" />
                      </button>
                      <div>
                        <h3 className={`font-semibold text-base transition-colors ${task.status === 'COMPLETED' ? 'line-through text-text-tertiary' : 'text-text-primary group-hover:text-primary'}`}>{task.title}</h3>
                        {task.description && <p className="text-sm text-text-secondary line-clamp-1 mt-1">{task.description}</p>}
                        <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs">
                          <Badge variant="outline" className="text-text-tertiary border-border-color/50 font-medium px-2 py-0.5">{new Date(task.deadline).toLocaleDateString()}</Badge>
                          <Badge variant={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'warning' : 'default'} className="px-2 py-0.5">{task.status}</Badge>
                          <Badge variant={task.priority === 'CRITICAL' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'premium'} className="px-2 py-0.5">{task.priority}</Badge>
                          <Badge variant="outline" className="bg-bg-surface-hover px-2 py-0.5">{task.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => openEditForm(task)} className="h-8 w-8 p-0 rounded-lg bg-bg-surface-hover hover:bg-bg-surface border border-border-color/50">
                        <Edit2 className="h-4 w-4 text-text-secondary" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(task._id)} className="h-8 w-8 p-0 rounded-lg text-danger bg-danger/5 hover:bg-danger/10 border border-danger/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <TasksKanban 
              tasks={filteredTasks} 
              onStatusChange={handleStatusChange} 
              onTaskClick={openEditForm} 
            />
          )
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-text-secondary border-2 border-dashed border-border-color/50 rounded-2xl bg-bg-surface-hover/30">
            <Inbox className="h-12 w-12 mb-4 text-text-tertiary" />
            <p className="text-lg font-medium text-text-primary">No tasks found</p>
            <p className="text-sm">Create a new task to get started.</p>
          </div>
        )}
      </div>

      <Dialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingTask ? "Edit Task" : "Create Task"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">Title</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="What needs to be done?" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">Description</label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Add some details..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">Priority</label>
              <Select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary">Category</label>
              <Input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="E.g. Work, Personal" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">Deadline</label>
            <Input type="datetime-local" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={createTask.isPending || updateTask.isPending}>
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} title="AI Task Planner">
        <form onSubmit={handleAiPlan} className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary leading-relaxed">
              Describe what you want to achieve, and the AI will automatically break it down into actionable tasks and schedule them for you.
            </p>
          </div>
          <div>
            <Textarea 
              placeholder="E.g. I need to plan my brother's birthday party for next weekend..."
              required 
              value={aiIntent} 
              onChange={e => setAiIntent(e.target.value)} 
              rows={4}
              className="bg-bg-surface"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsAiOpen(false)}>Cancel</Button>
            <Button type="submit" variant="premium" disabled={isAiLoading}>
              {isAiLoading ? 'Thinking...' : 'Generate Plan'}
            </Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  );
}
