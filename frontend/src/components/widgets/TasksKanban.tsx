import { useMemo, useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../hooks/useTasks';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface KanbanProps {
  tasks: Task[];
  onStatusChange: (task: Task, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
}

const COLUMNS = [
  { id: 'TODO', title: 'To Do', icon: Clock, color: 'text-text-secondary' },
  { id: 'IN_PROGRESS', title: 'In Progress', icon: CheckCircle, color: 'text-warning' },
  { id: 'COMPLETED', title: 'Completed', icon: CheckCircle2, color: 'text-success' },
];

function SortableTaskCard({ task, onClick }: { task: Task, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id, data: { type: 'Task', task } });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick} className="touch-none pb-3">
      <Card className="cursor-grab active:cursor-grabbing hover:border-border-highlight transition-all duration-200 shadow-sm bg-bg-surface border border-border-color/60 rounded-xl group">
        <CardContent className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <h4 className={"font-semibold text-sm group-hover:text-primary transition-colors"}>
              {task.title}
            </h4>
            <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1", task.priority === 'CRITICAL' ? 'bg-danger' : task.priority === 'HIGH' ? 'bg-warning' : 'bg-transparent')} />
          </div>
          {task.description && <p className="text-xs text-text-secondary line-clamp-2 mt-0.5">{task.description}</p>}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-color/30">
            <Badge variant="outline" className="text-[10px] py-0.5 px-1.5 font-medium bg-bg-surface-hover">{task.category}</Badge>
            <span className="text-[10px] text-text-tertiary font-medium">{new Date(task.deadline).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function TasksKanban({ tasks, onStatusChange, onTaskClick }: KanbanProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columns = useMemo(() => {
    const cols: Record<string, Task[]> = { TODO: [], IN_PROGRESS: [], COMPLETED: [] };
    tasks.forEach(t => {
      if (cols[t.status]) cols[t.status].push(t);
    });
    return cols;
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task;
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeTask = active.data.current?.task as Task;
    const overId = over.id as string;
    
    if (COLUMNS.find(c => c.id === overId)) {
      if (activeTask.status !== overId) onStatusChange(activeTask, overId);
      return;
    }

    const overTask = over.data.current?.task as Task;
    if (overTask && activeTask.status !== overTask.status) {
      onStatusChange(activeTask, overTask.status);
    }
  };

  return (
    <div className="flex h-full w-full gap-6 overflow-x-auto pb-4 premium-scrollbar">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {COLUMNS.map(col => (
          <div key={col.id} className="flex flex-col min-w-[300px] max-w-[350px] flex-1 bg-bg-surface-hover/30 rounded-2xl p-4 border border-border-color/50">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <col.icon className={"w-5 h-5 "} />
                <h3 className="font-semibold text-text-primary">{col.title}</h3>
              </div>
              <Badge variant="outline" className="bg-bg-surface">{columns[col.id].length}</Badge>
            </div>
            
            <SortableContext id={col.id} items={columns[col.id].map(t => t._id)} strategy={verticalListSortingStrategy}>
              <div className="flex-1 overflow-y-auto min-h-[150px]" style={{ minHeight: '150px' }}>
                {columns[col.id].map(task => (
                  <SortableTaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
        <DragOverlay>
          {activeTask ? (
            <Card className="shadow-2xl border-primary bg-bg-surface opacity-90 rotate-3 scale-105">
              <CardContent className="p-4 flex flex-col gap-2">
                <h4 className="font-semibold text-sm">{activeTask.title}</h4>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-color/30">
                  <Badge variant="outline" className="text-[10px] py-0">{activeTask.category}</Badge>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
