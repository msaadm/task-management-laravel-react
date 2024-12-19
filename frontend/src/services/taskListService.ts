import { api } from '../contexts/AuthContext';
import { TaskList, TaskListStats, NewTaskListData } from '../types/task';

export const taskListService = {
  // Task List Operations
  getAll: async (): Promise<TaskList[]> => {
    const response = await api.get('/api/task-lists');
    return response.data.data;
  },

  getSharedWithMe: async (): Promise<TaskList[]> => {
    const response = await api.get('/api/task-lists/shared/with-me');
    return response.data.data;
  },

  getStats: async (): Promise<TaskListStats> => {
    const response = await api.get('/api/task-lists/stats/all');
    return response.data.data;
  },

  get: async (id: number): Promise<TaskList> => {
    const response = await api.get(`/api/task-lists/${id}`);
    return response.data.data;
  },

  create: async (data: NewTaskListData): Promise<boolean> => {
    try {
      await api.post('/api/task-lists', data);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  },

  update: async (taskListId: number, data: { name: string }): Promise<boolean> => {
    try {
      await api.put(`/api/task-lists/${taskListId}`, data);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  },

  delete: async (taskListId: number): Promise<boolean> => {
    try {
      await api.delete(`/api/task-lists/${taskListId}`);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  },

  // Task Operations within a List
  addTask: async (listId: number, data: { title: string}): Promise<void> => {
    await api.post(`/api/task-lists/${listId}/tasks`, data);
  },

  updateTask: async (
    taskId: number,
    data: { title: string}
  ): Promise<void> => {
    await api.put(`/api/tasks/${taskId}`, data);
  },

  deleteTask: async (taskId: number): Promise<void> => {
    await api.delete(`/api/tasks/${taskId}`);
  },

  toggleTaskComplete: async (taskId: number): Promise<void> => {
    await api.patch(`/api/tasks/${taskId}/toggle-complete`);
  },

  reorderTasks: async (listId: number, taskIds: number[]): Promise<void> => {
    await api.post(`/api/task-lists/${listId}/reorder`, { taskIds });
  },
};
