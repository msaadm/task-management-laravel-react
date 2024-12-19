import { SharePermission } from './share';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  is_completed: boolean;
  task_list_id: number;
  order: number;
}

export interface TaskList {
  id: number;
  name: string;
  tasks: Task[];
  tasks_count: number;
  completed_tasks_count: number;
  shares: Share[];
  owner?: User;
  share_permission?: SharePermission;
}

export interface EditingTask {
  taskListId: number;
  taskId?: number;
  title: string;
}

export interface ShareRequest {
  username: string;
  permission: SharePermission;
}

export interface Share {
  id: number;
  user: User;
  permission: SharePermission;
  user_id: number;
  task_list_id: number;
}

export interface NewTaskData {
  title: string;
  is_completed: boolean;
  order?: number;
}

export interface NewTaskListData {
  name: string;
}

interface TaskListDetailedStats {
  totalTaskLists: number;
  totalTasks: number;
  completedTasks: number;
}

export interface TaskListStats {
  totalTaskLists: number;
  totalTasks: number;
  completedTasks: number;
  personal: TaskListDetailedStats;
  shared: {
    totalSharedLists: number;
    totalSharedTasks: number;
    completedSharedTasks: number;
  };
}
