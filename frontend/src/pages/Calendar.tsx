import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';

interface FocusBlock {
  _id: string;
  taskId: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  pomodorosAssigned: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
} as const;

export function Calendar() {
  const [blocks, setBlocks] = useState<FocusBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);

  const fetchBlocks = async () => {
    try {
      const res: any = await api.get('/api/focus-blocks');
      // Sort blocks by start time
      const sortedBlocks = res.data.sort((a: FocusBlock, b: FocusBlock) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      setBlocks(sortedBlocks);
    } catch (err) {
      toast.error('Failed to load schedule');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleApprove = async () => {
    const pendingBlocks = blocks.filter(b => b.status === 'PENDING_APPROVAL');
    if (pendingBlocks.length === 0) {
      toast.success('No pending blocks to approve');
      return;
    }
    
    setIsApproving(true);
    try {
      await api.post('/api/ai/schedule/approve', { blocks: pendingBlocks });
      toast.success('Schedule approved and synced to Google Calendar!');
      fetchBlocks();
    } catch (err) {
      toast.error('Failed to approve schedule');
    } finally {
      setIsApproving(false);
    }
  };

  const pendingCount = blocks.filter(b => b.status === 'PENDING_APPROVAL').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 h-full flex flex-col max-w-5xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Schedule</h1>
          <p className="text-text-secondary mt-1">Review AI-proposed focus blocks and your synced calendar.</p>
        </div>
        <Button 
          onClick={handleApprove} 
          isLoading={isApproving}
          disabled={pendingCount === 0}
          variant={pendingCount > 0 ? 'premium' : 'outline'}
          className="flex items-center gap-2"
        >
          {pendingCount > 0 && <Sparkles className="w-4 h-4" />}
          Approve {pendingCount > 0 ? `${pendingCount} Pending` : 'Schedule'}
        </Button>
      </div>

      <div className="flex-1 overflow-auto bg-bg-surface-hover/30 rounded-3xl p-6 border border-border-color/50 premium-scrollbar">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : blocks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text-secondary">
            <div className="w-24 h-24 mb-6 rounded-full bg-bg-surface flex items-center justify-center shadow-sm border border-border-color/50">
              <CalendarIcon className="h-10 w-10 text-text-tertiary" />
            </div>
            <p className="text-xl font-semibold text-text-primary mb-2">No Focus Blocks Yet</p>
            <p className="text-sm max-w-sm text-center leading-relaxed">
              Create tasks and ask the AI Orchestrator to plan and schedule them for you. They will appear here on your timeline.
            </p>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="relative ml-4">
            {/* Timeline track */}
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-border-color/60"></div>
            
            <div className="space-y-6">
              {blocks.map((block) => {
                const isPending = block.status === 'PENDING_APPROVAL';
                const startTime = new Date(block.startTime);
                const endTime = new Date(block.endTime);
                const isPast = endTime < new Date();
                
                return (
                  <motion.div variants={item} key={block._id} className="relative pl-16">
                    {/* Timeline Node */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center z-10 ${
                      isPending ? 'bg-primary/20 ring-4 ring-bg-surface' : 
                      isPast ? 'bg-bg-surface border border-border-color/50 text-text-tertiary' : 'bg-success/20 ring-4 ring-bg-surface text-success'
                    }`}>
                      {isPending ? (
                        <Sparkles className="w-5 h-5 text-primary" />
                      ) : isPast ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    
                    <Card className={`transition-all duration-300 hover:scale-[1.01] rounded-[16px] ${
                      isPending ? 'bg-gradient-to-r from-primary/5 to-bg-surface shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)] border border-primary/40' : 
                      isPast ? 'bg-bg-surface/50 opacity-70 border border-border-color/30' : 'bg-bg-surface shadow-sm border border-border-color/60 hover:border-border-highlight'
                    }`}>
                      <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-semibold text-primary/80 uppercase tracking-wider">
                              {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-text-tertiary text-sm">-</span>
                            <span className="text-sm font-medium text-text-secondary">
                              {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <h3 className={`font-bold text-lg ${isPast ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>
                            {block.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end">
                            <Badge variant={isPending ? 'premium' : isPast ? 'outline' : 'success'} className="mb-1">
                              {isPending ? 'AI Proposed' : block.status}
                            </Badge>
                            <span className="text-xs text-text-tertiary font-medium">
                              {block.pomodorosAssigned} Pomodoro{block.pomodorosAssigned > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
