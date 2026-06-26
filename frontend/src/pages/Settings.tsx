import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useThemeStore } from '../store/themeStore';
import { ComingSoonBadge } from '../components/ui/ComingSoonBadge';

export function Settings() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-text-secondary">Toggle between light and dark mode.</p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary bg-bg-base ring-1 ring-border-color"
                role="switch"
                aria-checked={isDark}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-primary shadow ring-0 transition duration-200 ease-in-out ${isDark ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium flex items-center">
                  Google Calendar <ComingSoonBadge />
                </p>
                <p className="text-sm text-text-secondary">Sync your tasks and focus blocks.</p>
              </div>
              <span className="text-sm text-text-secondary italic">Not connected</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
