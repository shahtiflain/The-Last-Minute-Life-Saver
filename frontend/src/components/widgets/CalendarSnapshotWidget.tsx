import { Calendar, Clock } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { Card, CardContent } from '../ui/Card';

// Static/derived focus blocks for snapshot
const TODAY_BLOCKS = [
  { id: '1', title: 'Deep Work — Task Planning', start: '09:00', end: '10:30', type: 'focus', color: '#818CF8' },
  { id: '2', title: 'Team Sync', start: '11:00', end: '11:30', type: 'meeting', color: '#34D399' },
  { id: '3', title: 'Learning Block', start: '14:00', end: '15:00', type: 'focus', color: '#F472B6' },
  { id: '4', title: 'Email & Admin', start: '16:00', end: '17:00', type: 'admin', color: '#60A5FA' },
];

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

const TIMELINE_START = 8 * 60; // 8am
const TIMELINE_END = 18 * 60; // 6pm
const RANGE = TIMELINE_END - TIMELINE_START;

export function CalendarSnapshotWidget() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentPct = Math.max(0, Math.min(100, ((currentMinutes - TIMELINE_START) / RANGE) * 100));

  return (
    <Card className="h-full">
      <CardContent className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Today's Calendar</div>
            <div className="text-lg font-bold text-text-primary tracking-tight">
              {format(now, 'EEE, MMM d')}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-bg-surface-hover flex items-center justify-center border border-border-color">
            <Calendar className="w-4 h-4 text-info" />
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 relative mt-2">
          {/* Hour labels */}
          <div className="flex justify-between text-[10px] text-text-tertiary mb-3 font-medium">
            <span>8am</span>
            <span>12pm</span>
            <span>6pm</span>
          </div>

          {/* Track */}
          <div className="relative h-full min-h-[80px]">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-border-color/50 rounded-full" />

            {/* Event blocks */}
            {TODAY_BLOCKS.map(block => {
              const startPct = ((timeToMinutes(block.start) - TIMELINE_START) / RANGE) * 100;
              const widthPct = ((timeToMinutes(block.end) - timeToMinutes(block.start)) / RANGE) * 100;
              return (
                <div
                  key={block.id}
                  className="absolute top-2 h-8 rounded-md flex items-center px-2 overflow-hidden shadow-sm"
                  style={{
                    left: `${Math.max(0, startPct)}%`,
                    width: `${Math.min(widthPct, 100 - startPct)}%`,
                    backgroundColor: `${block.color}15`,
                    borderLeft: `2.5px solid ${block.color}`,
                    borderTop: `1px solid ${block.color}20`,
                    borderRight: `1px solid ${block.color}20`,
                    borderBottom: `1px solid ${block.color}20`,
                  }}
                >
                  <span className="text-[10px] font-semibold truncate" style={{ color: block.color }}>
                    {block.title}
                  </span>
                </div>
              );
            })}

            {/* Current time indicator */}
            {isToday(now) && currentPct >= 0 && currentPct <= 100 && (
              <div
                className="absolute top-0 w-[2px] h-12 bg-danger/80 rounded-full z-10"
                style={{ left: `${currentPct}%` }}
              >
                <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 bg-danger rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)] border-2 border-bg-surface" />
              </div>
            )}
          </div>

          {/* Upcoming block */}
          <div className="mt-4 space-y-2">
            {TODAY_BLOCKS.filter(b => timeToMinutes(b.start) > currentMinutes).slice(0, 2).map(block => (
              <div key={block.id} className="flex items-center gap-3 text-xs bg-bg-surface-hover/50 p-2 rounded-lg border border-border-color/50">
                <Clock className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
                <span className="text-text-tertiary font-medium">{block.start}</span>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: block.color }} />
                <span className="text-text-secondary font-medium truncate">{block.title}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
