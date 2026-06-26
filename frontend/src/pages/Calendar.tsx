import { Calendar as CalendarIcon } from 'lucide-react';

export function Calendar() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Calendar</h1>
        <p className="text-text-secondary mt-1">Your upcoming schedule and focus blocks.</p>
      </div>

      <div className="flex-1 overflow-auto flex flex-col items-center justify-center text-text-secondary border-2 border-dashed border-border-color rounded-xl bg-bg-surface/50 p-8">
        <CalendarIcon className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-xl font-medium text-text-primary">Calendar view coming soon</p>
        <p className="text-sm mt-2 max-w-md text-center">
          We will integrate Google Calendar and show your time-blocked tasks here.
        </p>
      </div>
    </div>
  );
}
