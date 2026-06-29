import { useState, useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { Button } from '../components/ui/Button';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../features/auth/AuthProvider';
import { 
  Search, Bell, User as UserIcon, Type, 
  Target, Calendar as CalendarIcon, Clock, 
  Info, Smartphone, 
  Sliders, MonitorPlay,
  Palette, Mail, CreditCard
} from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function Toggle({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 ${checked ? 'bg-primary' : 'bg-bg-elevated ring-1 ring-border-color shadow-inner'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function PremiumCard({ title, icon, children, show = true }: { title: string, icon: React.ReactNode, children: React.ReactNode, show?: boolean }) {
  if (!show) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-bg-surface border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-border-color/30 flex items-center gap-3 bg-bg-surface/50">
        <div className="text-primary bg-primary/10 p-2 rounded-xl">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-text-primary tracking-tight">{title}</h2>
      </div>
      <div className="px-6 py-4">
        {children}
      </div>
    </motion.div>
  );
}

function SettingRow({ icon, title, description, control, show = true }: { icon: React.ReactNode, title: string, description: string, control: React.ReactNode, show?: boolean }) {
  if (!show) return null;
  return (
    <div className="flex items-center justify-between py-4 border-b border-border-color/30 last:border-0 group hover:bg-bg-surface-hover/30 px-3 -mx-3 rounded-xl transition-colors">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 text-text-tertiary group-hover:text-primary transition-colors duration-200">
          {icon}
        </div>
        <div>
          <p className="font-medium text-text-primary">{title}</p>
          <p className="text-[13px] text-text-secondary mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">
        {control}
      </div>
    </div>
  );
}

/* Google Calendar integration — only renders inside GoogleOAuthProvider */
function GoogleCalendarConnected({ matches }: { matches: (t: string) => boolean }) {
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
    <SettingRow
      show={matches('Google Calendar Sync Tasks Focus')}
      icon={<CalendarIcon className="w-5 h-5" />}
      title="Google Calendar"
      description="Sync your tasks and focus blocks."
      control={
        isCalendarConnected ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-success font-semibold px-2.5 py-1 bg-success/10 rounded-md border border-success/20">Connected</span>
            <Button 
              onClick={async () => {
                try {
                  await api.delete('/api/auth/google/disconnect');
                  setIsCalendarConnected(false);
                  toast.success('Calendar disconnected');
                } catch {
                  toast.error('Failed to disconnect');
                }
              }} 
              variant="ghost" 
              size="sm"
              className="text-text-tertiary hover:text-danger"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button onClick={() => login()} isLoading={isConnecting} variant="outline" size="sm" className="shadow-sm">
            Connect
          </Button>
        )
      }
    />
  );
}

export function Settings() {
  const { currentUser } = useAuth();
  const store = useSettingsStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSave = (updater: () => void) => {
    updater();
    toast.success('Preferences Saved', { id: 'settings-saved', position: 'bottom-right' });
  };

  const m = (text: string) => text.toLowerCase().includes(searchQuery.toLowerCase());
  
  const showAppearance = m('Appearance Theme Light Dark System');
  const showNotifications = m('Notifications Push Email');
  const showProductivity = m('Productivity Working Hours');
  const showIntegrations = m('Integrations Calendar');
  const showAccount = m('Account Avatar Name Email Plan');
  const showAbout = m('About Hustlr Version Environment Status');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-[1280px] mx-auto w-full pb-32 px-2 sm:px-4"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-border-color/40 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden border border-border-color shadow-sm">
            <img src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.displayName}&background=random`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">Settings</h1>
            <div className="text-text-secondary mt-1.5 flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
              <span className="font-medium text-text-primary">{currentUser?.displayName}</span>
              <span className="w-1 h-1 rounded-full bg-border-color hidden sm:block"></span>
              <span>{currentUser?.email}</span>
              <span className="w-1 h-1 rounded-full bg-border-color hidden sm:block"></span>
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wide">Pro Plan</span>
            </div>
          </div>
        </div>
        <div className="relative w-full lg:w-80 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Settings..." 
            className="w-full pl-10 pr-4 py-2.5 bg-bg-surface border border-border-color/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Column 1 */}
        <div className="space-y-8">
          
          {/* Appearance */}
          <PremiumCard title="Appearance" icon={<Palette className="w-5 h-5" />} show={showAppearance}>
            <div className="space-y-2">
              <SettingRow 
                show={m('Theme Light Dark System Appearance')}
                icon={<MonitorPlay className="w-5 h-5" />}
                title="Theme Preference"
                description="Choose your interface theme."
                control={
                  <div className="flex gap-1 p-1 bg-bg-surface-hover rounded-lg border border-border-color shadow-inner">
                    {(['light', 'dark', 'system'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => handleSave(() => store.setTheme(t))}
                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-md capitalize transition-all ${
                          store.theme === t ? 'bg-bg-surface text-primary shadow-sm font-medium border border-border-color/50' : 'text-text-secondary hover:text-text-primary border border-transparent'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                }
              />
            </div>
          </PremiumCard>

          {/* Notifications */}
          <PremiumCard title="Notifications" icon={<Bell className="w-5 h-5" />} show={showNotifications}>
            <div className="space-y-2">
              <SettingRow show={m('Push Notifications')} icon={<Smartphone className="w-5 h-5" />} title="Push Notifications" description="Receive alerts on this device." control={<Toggle checked={store.notifications.push} onChange={v => handleSave(() => store.updateNotifications({ push: v }))} />} />
              <SettingRow show={m('Email Notifications')} icon={<Mail className="w-5 h-5" />} title="Email Notifications" description="Weekly digests and important updates." control={<Toggle checked={store.notifications.email} onChange={v => handleSave(() => store.updateNotifications({ email: v }))} />} />
            </div>
          </PremiumCard>

          {/* Integrations */}
          <PremiumCard title="Integrations" icon={<Sliders className="w-5 h-5" />} show={showIntegrations}>
            <div className="space-y-2">
              {GOOGLE_CLIENT_ID ? (
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <GoogleCalendarConnected matches={m} />
                </GoogleOAuthProvider>
              ) : (
                <SettingRow show={m('Google Calendar')} icon={<CalendarIcon className="w-5 h-5" />} title="Google Calendar" description="Sync your tasks and focus blocks." control={<span className="text-xs font-medium px-2 py-1 bg-bg-surface-hover rounded-md border border-border-color">Not Configured</span>} />
              )}
            </div>
          </PremiumCard>
          
          {/* Account */}
          <PremiumCard title="Account" icon={<UserIcon className="w-5 h-5" />} show={showAccount}>
            <div className="space-y-2">
              <SettingRow show={m('Display Name')} icon={<Type className="w-5 h-5" />} title="Display Name" description={currentUser?.displayName || 'Not set'} control={<span></span>} />
              <SettingRow show={m('Email Address')} icon={<Mail className="w-5 h-5" />} title="Email Address" description={currentUser?.email || 'Not set'} control={<span></span>} />
              <SettingRow show={m('Current Plan Subscription')} icon={<CreditCard className="w-5 h-5" />} title="Current Plan" description="Pro (Active)" control={<span></span>} />
            </div>
          </PremiumCard>
        </div>

        {/* Column 2 */}
        <div className="space-y-8">
          
          {/* Productivity */}
          <PremiumCard title="Productivity Preferences" icon={<Target className="w-5 h-5" />} show={showProductivity}>
            <div className="space-y-2">
              <SettingRow 
                show={m('Working Hours')}
                icon={<Clock className="w-5 h-5" />}
                title="Working Hours"
                description="Core hours for AI scheduling."
                control={
                  <div className="flex items-center gap-2">
                    <input type="time" value={store.workingHours.start} onChange={e => handleSave(() => store.setWorkingHours(e.target.value, store.workingHours.end))} className="bg-bg-surface-hover border border-border-color rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-primary/50 outline-none w-24" />
                    <span className="text-text-tertiary text-xs">to</span>
                    <input type="time" value={store.workingHours.end} onChange={e => handleSave(() => store.setWorkingHours(store.workingHours.start, e.target.value))} className="bg-bg-surface-hover border border-border-color rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-primary/50 outline-none w-24" />
                  </div>
                }
              />
            </div>
          </PremiumCard>

          {/* About */}
          <PremiumCard title="About Hustlr" icon={<Info className="w-5 h-5" />} show={showAbout}>
            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex justify-between py-2 border-b border-border-color/30"><span>Version</span><span className="font-medium text-text-primary">v2.4.0 (Build 492)</span></div>
              <div className="flex justify-between py-2 border-b border-border-color/30"><span>Environment</span><span className="font-medium text-text-primary">Production</span></div>
              <div className="flex justify-between py-2 border-b border-border-color/30"><span>AI Provider</span><span className="font-medium text-text-primary">Google Gemini 1.5 Pro</span></div>
              <div className="flex justify-between py-2 border-b border-border-color/30"><span>Backend Status</span><span className="font-medium text-success flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success"></span> Operational</span></div>
            </div>
          </PremiumCard>

        </div>
      </div>
    </motion.div>
  );
}
