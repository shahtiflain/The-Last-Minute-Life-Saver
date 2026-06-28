import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useSettingsStore } from '../store/useSettingsStore';
import { Button } from '../components/ui/Button';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/* Google Calendar integration — only renders inside GoogleOAuthProvider */
function GoogleCalendarConnected() {
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    api.get('/api/auth/google/status').then((res: any) => {
      setIsCalendarConnected(res.data?.isConnected ?? res.isConnected ?? false);
    }).catch(() => {});
  }, []);

  const login = useGoogleLogin({
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
    onSuccess: async (codeResponse) => {
      setIsConnecting(true);
      try {
        await api.post('/api/auth/google/callback', { code: codeResponse.code });
        setIsCalendarConnected(true);
        toast.success('Google Calendar connected successfully!');
      } catch {
        toast.error('Failed to connect Google Calendar');
      } finally {
        setIsConnecting(false);
      }
    },
    onError: () => {
      toast.error('Google Login Failed');
    },
  });

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium flex items-center text-text-primary">Google Calendar</p>
        <p className="text-sm text-text-secondary">Sync your tasks and focus blocks.</p>
      </div>
      {isCalendarConnected ? (
        <span className="text-sm text-success font-medium px-4 py-2 bg-success/10 rounded-lg border border-success/20 shadow-sm">Connected</span>
      ) : (
        <Button onClick={() => login()} isLoading={isConnecting} variant="outline" className="shadow-sm">
          Connect Calendar
        </Button>
      )}
    </div>
  );
}

/* Fallback when Google Client ID is not configured */
function GoogleCalendarNotConfigured() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium flex items-center text-text-primary">Google Calendar</p>
        <p className="text-sm text-text-secondary">Sync your tasks and focus blocks.</p>
      </div>
      <span className="text-sm text-text-tertiary font-medium px-4 py-2 bg-bg-surface-hover rounded-lg border border-border-color/50">Not Configured</span>
    </div>
  );
}

export function Settings() {
  const { theme, setTheme, notifications, setNotifications, workingHours, setWorkingHours } = useSettingsStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-4xl mx-auto w-full"
    >
      <div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <Card className="shadow-sm border border-border-color/60 rounded-[16px] bg-bg-surface">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="font-medium text-text-primary">Theme Preference</p>
                <p className="text-sm text-text-secondary">Choose your interface theme.</p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-2 p-1 bg-bg-surface-hover rounded-lg border border-border-color shadow-inner">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-1.5 text-sm rounded-md capitalize transition-all ${
                      theme === t
                        ? 'bg-bg-surface text-primary shadow-sm font-medium border border-border-color/50'
                        : 'text-text-secondary hover:text-text-primary border border-transparent'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-sm border border-border-color/60 rounded-[16px] bg-bg-surface">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">Push Notifications</p>
                <p className="text-sm text-text-secondary">Receive alerts for tasks and goals.</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications.push, notifications.email)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary ${notifications.push ? 'bg-primary' : 'bg-bg-elevated ring-1 ring-border-color'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifications.push ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card className="shadow-sm border border-border-color/60 rounded-[16px] bg-bg-surface">
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <input
                type="time"
                value={workingHours.start}
                onChange={(e) => setWorkingHours(e.target.value, workingHours.end)}
                className="px-4 py-2 border border-border-color rounded-lg bg-bg-base text-text-primary focus:outline-none focus:border-primary shadow-inner"
              />
              <span className="text-text-secondary font-medium">to</span>
              <input
                type="time"
                value={workingHours.end}
                onChange={(e) => setWorkingHours(workingHours.start, e.target.value)}
                className="px-4 py-2 border border-border-color rounded-lg bg-bg-base text-text-primary focus:outline-none focus:border-primary shadow-inner"
              />
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="shadow-sm border border-border-color/60 rounded-[16px] bg-bg-surface">
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            {GOOGLE_CLIENT_ID ? (
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleCalendarConnected />
              </GoogleOAuthProvider>
            ) : (
              <GoogleCalendarNotConfigured />
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
