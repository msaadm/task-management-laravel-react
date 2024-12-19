import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskListService } from '../services/taskListService';
import { TaskListStats } from '../types/task';

const defaultStats: TaskListStats = {
  totalTaskLists: 0,
  totalTasks: 0,
  completedTasks: 0,
  personal: {
    totalTaskLists: 0,
    totalTasks: 0,
    completedTasks: 0,
  },
  shared: {
    totalSharedLists: 0,
    totalSharedTasks: 0,
    completedSharedTasks: 0,
  },
};

export const useDashboard = (): {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  stats: TaskListStats;
} => {
  const [activeTab, setActiveTab] = useState(0);

  const { data: stats = defaultStats } = useQuery<TaskListStats>({
    queryKey: ['taskListStats'],
    queryFn: taskListService.getStats,
  });

  return {
    activeTab,
    setActiveTab,
    stats,
  };
};
