import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export interface DashboardMetrics {
  jobsDiscovered: number;
  highMatches: number;
  pendingReviews: number;
  submitted: number;
}

export interface RecentJob {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  createdAt: string;
}

export const useMetrics = () => {
  return useQuery<DashboardMetrics>({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async () => {
      const response = await api.get('/dashboard/metrics');
      return response.data.data;
    },
    staleTime: 30000, // 30 seconds
  });
};

export const useRecentJobs = () => {
  return useQuery<RecentJob[]>({
    queryKey: ['dashboard', 'recent-jobs'],
    queryFn: async () => {
      const response = await api.get('/dashboard/recent-jobs');
      return response.data.data;
    },
    staleTime: 30000,
  });
};
