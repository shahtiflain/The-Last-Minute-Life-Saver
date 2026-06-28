import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-warning text-warning-foreground px-4 py-2 flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
      <WifiOff size={18} />
      <span className="font-medium text-sm">You are currently offline. Some features may be unavailable.</span>
    </div>
  );
}
