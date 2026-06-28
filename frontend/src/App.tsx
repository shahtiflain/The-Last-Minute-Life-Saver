import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthProvider';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { MainLayout } from './components/layout/MainLayout';

import { Suspense, lazy } from 'react';
import { PageSkeleton } from './components/ui/Skeleton';

const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Tasks = lazy(() => import('./pages/Tasks').then(module => ({ default: module.Tasks })));
const Goals = lazy(() => import('./pages/Goals').then(module => ({ default: module.Goals })));
const Habits = lazy(() => import('./pages/Habits').then(module => ({ default: module.Habits })));
const Calendar = lazy(() => import('./pages/Calendar').then(module => ({ default: module.Calendar })));
const AiCoach = lazy(() => import('./pages/AiCoach').then(module => ({ default: module.AiCoach })));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

import { Toaster } from 'react-hot-toast';
import { useSettingsStore } from './store/useSettingsStore';
import { useEffect } from 'react';
import { OfflineBanner } from './components/layout/OfflineBanner';

const ThemeSync = () => {
  const theme = useSettingsStore(state => state.theme);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
  return null;
};

import { AnimatePresence } from 'framer-motion';

const Landing = lazy(() => import('./pages/Landing').then(module => ({ default: module.Landing })));

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeSync />
      <OfflineBanner />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={
                <Suspense fallback={<PageSkeleton />}>
                  <Landing />
                </Suspense>
              } />
              
              {/* Main App (Demo Mode when unauthenticated) */}
              <Route
                path="/dashboard"
                element={<MainLayout />}
              >
                <Route index element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Dashboard />
                  </Suspense>
                } />
              </Route>
              
              <Route element={<MainLayout />}>
                <Route path="/tasks" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Tasks />
                  </Suspense>
                } />
                <Route path="/goals" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Goals />
                  </Suspense>
                } />
                <Route path="/habits" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Habits />
                  </Suspense>
                } />
                <Route path="/calendar" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Calendar />
                  </Suspense>
                } />
                <Route path="/ai-coach" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <AiCoach />
                  </Suspense>
                } />
                <Route path="/settings" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Settings />
                  </Suspense>
                } />
                <Route path="/profile" element={
                  <Suspense fallback={<PageSkeleton />}>
                    <Profile />
                  </Suspense>
                } />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </AuthProvider>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          className: '!bg-bg-surface !text-text-primary !border !border-border-color !shadow-premium !rounded-xl !px-4 !py-3',
          duration: 4000,
        }} 
      />
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
