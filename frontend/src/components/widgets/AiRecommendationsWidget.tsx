import { Brain, ChevronDown, ChevronUp, Zap, Target, Clock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';
import { Card, CardContent } from '../ui/Card';

interface Recommendation {
  id: string;
  title: string;
  reasoning: string;
  confidence: number; // 0-100
  category: 'focus' | 'goal' | 'habit' | 'schedule';
  action?: string;
  steps?: string[];
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    title: 'Start your hardest task first',
    reasoning: 'Your productivity score peaks between 9-11am. Tackling cognitively demanding work during this window can yield 40% better output.',
    confidence: 88,
    category: 'focus',
    action: 'Open Tasks',
    steps: ['Identify your #1 priority task', 'Block distractions for 90 minutes', 'Start with a 5-minute planning session'],
  },
  {
    id: '2',
    title: 'You\'re 2 habits away from a streak record',
    reasoning: 'Based on your habit history, completing your evening habits today would set a new 7-day streak — your highest this month.',
    confidence: 94,
    category: 'habit',
    action: 'View Habits',
  },
  {
    id: '3',
    title: 'Schedule a review session for Goal "Launch MVP"',
    reasoning: 'This goal\'s deadline is in 3 weeks but progress is at 45%. A dedicated 2-hour review block would significantly reduce risk.',
    confidence: 76,
    category: 'goal',
    action: 'Open Calendar',
    steps: ['Book 2h block this week', 'Review task breakdown', 'Identify blockers'],
  },
];

const categoryConfig = {
  focus: { icon: Zap, color: 'text-warning', bg: 'bg-warning/10', label: 'Focus' },
  goal: { icon: Target, color: 'text-secondary', bg: 'bg-secondary/10', label: 'Goal' },
  habit: { icon: Zap, color: 'text-accent', bg: 'bg-accent/10', label: 'Habit' },
  schedule: { icon: Clock, color: 'text-info', bg: 'bg-info/10', label: 'Schedule' },
};

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const level = confidence >= 85 ? 'high' : confidence >= 65 ? 'medium' : 'low';
  const styles = {
    high: 'bg-success/10 text-success border-success/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    low: 'bg-danger/10 text-danger border-danger/20',
  };
  return (
    <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border', styles[level])}>
      <div className="w-1 h-1 rounded-full bg-current" />
      {confidence}% confidence
    </div>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = categoryConfig[rec.category];
  const Icon = cfg.icon;

  return (
    <div className="rounded-xl border border-border-color/50 bg-bg-surface-hover/40 overflow-hidden">
      <div
        className="flex items-start gap-3 p-3 cursor-pointer hover:bg-bg-surface-hover/70 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', cfg.bg)}>
          <Icon className={cn('w-3.5 h-3.5', cfg.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-text-primary leading-tight mb-1">{rec.title}</div>
          <ConfidenceBadge confidence={rec.confidence} />
        </div>
        <div className="text-text-tertiary flex-shrink-0 mt-0.5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-border-color/30 pt-3">
          <div className="text-xs text-text-secondary leading-relaxed">
            <span className="font-semibold text-text-tertiary uppercase text-[10px] tracking-wider block mb-1">Why this?</span>
            {rec.reasoning}
          </div>
          {rec.steps && (
            <div>
              <span className="font-semibold text-text-tertiary uppercase text-[10px] tracking-wider block mb-2">Steps</span>
              <ol className="space-y-1">
                {rec.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                    <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AiRecommendationsWidget() {
  return (
    <Card className="h-full">
      <CardContent className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">AI Recommendations</div>
            <div className="text-lg font-bold text-text-primary tracking-tight">{RECOMMENDATIONS.length} insights</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-bg-surface-hover flex items-center justify-center border border-border-color">
            <Brain className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto premium-scrollbar pr-1 -mr-1">
          {RECOMMENDATIONS.map(rec => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
