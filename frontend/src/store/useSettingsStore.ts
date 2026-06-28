import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  workingHours: {
    start: string;
    end: string;
  };
  notifications: {
    push: boolean;
    email: boolean;
  };
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setWorkingHours: (start: string, end: string) => void;
  setNotifications: (push: boolean, email: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      workingHours: { start: '09:00', end: '17:00' },
      notifications: { push: true, email: true },
      setTheme: (theme) => set({ theme }),
      setWorkingHours: (start, end) => set({ workingHours: { start, end } }),
      setNotifications: (push, email) => set({ notifications: { push, email } }),
    }),
    {
      name: 'user-settings',
    }
  )
);
