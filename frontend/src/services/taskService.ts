import { api } from '../contexts/AuthContext';
import { Task } from '../types/task';

export const taskService = {
  create: async (listId: number, data: { title: string }): Promise<Task> => {
    const response = await api.post(`/api/task-lists/${listId}/tasks`, data);
    return response.data.data;
  },

  update: async (taskId: number, data: { title: string }): Promise<boolean> => {
    try {
      await api.put(`/api/tasks/${taskId}`, data);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  },

  delete: async (taskId: number): Promise<void> => {
    await api.delete(`/api/tasks/${taskId}`);
  },

  toggleComplete: async (taskId: number): Promise<Task> => {
    const response = await api.patch(`/api/tasks/${taskId}/toggle-complete`);
    return response.data.data;
  },

  reorder: async (listId: number, taskIds: number[]): Promise<void> => {
    await api.post(`/api/task-lists/${listId}/reorder`, { tasks: taskIds });
  },
};
