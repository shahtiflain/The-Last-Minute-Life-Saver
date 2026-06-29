import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  accentColor: 'purple' | 'blue' | 'indigo' | 'emerald' | 'orange' | 'rose' | 'slate';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  reducedMotion: boolean;
  highContrast: boolean;

  workingHours: {
    start: string;
    end: string;
    lunchStart: string;
    lunchEnd: string;
    defaultFocusDuration: string; // '25', '45', '60', etc.
    pomodoroDuration: string;
    dailyGoal: string; // hours
    weekendSchedule: boolean;
    productivityStyle: 'balanced' | 'aggressive' | 'relaxed';
  };

  notifications: {
    push: boolean;
    email: boolean;
    deadlineAlerts: boolean;
    aiPlannerAlerts: boolean;
    aiRiskAlerts: boolean;
    habitReminders: boolean;
    goalReminders: boolean;
    weeklySummary: boolean;
    monthlyReport: boolean;
    sound: boolean;
    desktop: boolean;
  };

  aiPreferences: {
    personality: 'coach' | 'professional' | 'friendly' | 'strict';
    planningStyle: 'conservative' | 'balanced' | 'aggressive';
    riskSensitivity: 'low' | 'medium' | 'high';
    autoSchedule: boolean;
    autoPrioritize: boolean;
    explainDecisions: boolean;
    showConfidence: boolean;
    reasoningDetail: 'minimal' | 'balanced' | 'detailed';
  };

  security: {
    twoFactor: boolean;
  };

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateAppearance: (updates: Partial<SettingsState>) => void;
  setWorkingHours: (start: string, end: string) => void;
  updateWorkingHours: (updates: Partial<SettingsState['workingHours']>) => void;
  setNotifications: (push: boolean, email: boolean) => void;
  updateNotifications: (updates: Partial<SettingsState['notifications']>) => void;
  updateAiPreferences: (updates: Partial<SettingsState['aiPreferences']>) => void;
  updateSecurity: (updates: Partial<SettingsState['security']>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      accentColor: 'indigo',
      fontSize: 'medium',
      compactMode: false,
      reducedMotion: false,
      highContrast: false,

      workingHours: { 
        start: '09:00', 
        end: '17:00',
        lunchStart: '12:00',
        lunchEnd: '13:00',
        defaultFocusDuration: '45',
        pomodoroDuration: '25',
        dailyGoal: '6',
        weekendSchedule: false,
        productivityStyle: 'balanced',
      },

      notifications: { 
        push: true, 
        email: true,
        deadlineAlerts: true,
        aiPlannerAlerts: true,
        aiRiskAlerts: false,
        habitReminders: true,
        goalReminders: true,
        weeklySummary: true,
        monthlyReport: false,
        sound: true,
        desktop: true,
      },

      aiPreferences: {
        personality: 'coach',
        planningStyle: 'balanced',
        riskSensitivity: 'medium',
        autoSchedule: true,
        autoPrioritize: true,
        explainDecisions: true,
        showConfidence: true,
        reasoningDetail: 'balanced',
      },

      security: {
        twoFactor: false,
      },

      setTheme: (theme) => set({ theme }),
      updateAppearance: (updates) => set((state) => ({ ...state, ...updates })),
      setWorkingHours: (start, end) => set((state) => ({ workingHours: { ...state.workingHours, start, end } })),
      updateWorkingHours: (updates) => set((state) => ({ workingHours: { ...state.workingHours, ...updates } })),
      setNotifications: (push, email) => set((state) => ({ notifications: { ...state.notifications, push, email } })),
      updateNotifications: (updates) => set((state) => ({ notifications: { ...state.notifications, ...updates } })),
      updateAiPreferences: (updates) => set((state) => ({ aiPreferences: { ...state.aiPreferences, ...updates } })),
      updateSecurity: (updates) => set((state) => ({ security: { ...state.security, ...updates } })),
    }),
    {
      name: 'user-settings',
    }
  )
);
