import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useAuth } from '../../features/auth/AuthProvider';
import { useTasks } from '../../hooks/useTasks';
import { cn } from '../../utils/cn';
import { Card, CardContent } from '../ui/Card';

const BRIEFINGS = [
  "You have {tasks} active tasks and {habits} habits due today. Your productivity score is strong — keep this momentum.",
  "Based on your task load, I recommend prioritizing your high-priority items before 2pm. You have {tasks} tasks due this week.",
  "Your habit streak is on track! {habits} habits are scheduled for today. A focused 90-minute session can clear your backlog.",
  "Looking great! You're in the top momentum zone. {tasks} tasks pending — tackle the hardest one first.",
];

function useTypewriter(text: string, speed = 22) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

export function AiSummaryWidget() {
  const { data: analytics } = useAnalytics();
  const { currentUser } = useAuth();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const name = currentUser?.displayName?.split(' ')[0] ?? 'there';
  const { data: tasks } = useTasks();

  const taskCount = tasks?.filter(t => t.status !== 'COMPLETED').length ?? 0;
  const habitCount = analytics?.habitCompletion?.totalDueToday ?? 0;
  
  const template = BRIEFINGS[new Date().getDay() % BRIEFINGS.length];
  const briefing = template
    .replace('{tasks}', String(taskCount))
    .replace('{habits}', String(habitCount));

  const fullText = `Good ${greeting}, ${name}. ${briefing}`;
  const { displayed, done } = useTypewriter(fullText, 18);

  return (
    <Card className="h-full relative overflow-hidden bg-gradient-to-br from-primary/5 via-bg-surface to-secondary/5 border-primary/10">
      <CardContent className="h-full flex flex-col p-6">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#383838] to-[#1E1E1E] flex items-center justify-center shadow-sm border border-[#444]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-primary uppercase tracking-wider">AI Briefing</div>
              <div className="text-[10px] text-text-tertiary">Updated now</div>
            </div>
            <div className="ml-auto flex items-center gap-1 text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3" />
              Live
            </div>
          </div>

          <p className={cn(
            "text-text-primary text-sm leading-relaxed font-medium flex-1",
            !done && "typing-cursor"
          )}>
            {displayed}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-text-tertiary">Intelligence mode active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
