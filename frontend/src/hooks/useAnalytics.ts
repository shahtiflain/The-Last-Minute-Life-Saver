import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export interface DashboardAnalytics {
  productivityScore: {
    score: number;
    trend: string;
  };
  deadlineRisk: {
    level: string;
    message: string;
    highRiskCount: number;
    dueSoonCount: number;
  };
  habitCompletion: {
    completedToday: number;
    totalDueToday: number;
    progressPercent: number;
  };
}

export function useAnalytics() {
  return useQuery<DashboardAnalytics>({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/api/analytics/dashboard');
      return data.data as DashboardAnalytics;
    },
  });
}
