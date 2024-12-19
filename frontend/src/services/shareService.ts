import { api } from '../contexts/AuthContext';
import { TaskList, ShareRequest } from '../types/task';

export const shareService = {
  shareList: async (taskListId: number, data: ShareRequest): Promise<void> => {
    await api.post(`/api/task-lists/${taskListId}/share`, data);
  },

  updatePermission: async (
    taskListId: number,
    userId: number,
    permission: 'view' | 'edit'
  ): Promise<void> => {
    await api.put(`/api/task-lists/${taskListId}/share/${userId}`, { permission });
  },

  removeShare: async (taskListId: number, userId: number): Promise<void> => {
    await api.delete(`/api/task-lists/${taskListId}/share/${userId}`);
  },

  getSharedWithMe: async (): Promise<TaskList[]> => {
    const response = await api.get('/api/task-lists/shared/with-me');
    return response.data.data;
  },
};
