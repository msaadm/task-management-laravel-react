import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { taskListService } from '../services/taskListService';
import { NewTaskListData } from '../types/task';

export const useTaskList = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const createTaskList = async (data: NewTaskListData) => {
    setIsLoading(true);
    try {
      await taskListService.create(data);
      await queryClient.invalidateQueries({ queryKey: ['taskLists'] });
      toast.success('Task list created successfully');
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to create task list');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskList = async (id: number, name: string) => {
    setIsLoading(true);
    try {
      await taskListService.update(id, { name });
      await queryClient.invalidateQueries({ queryKey: ['taskLists'] });
      toast.success('Task list updated successfully');
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to update task list');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTaskList = async (id: number) => {
    setIsLoading(true);
    try {
      await taskListService.delete(id);
      await queryClient.invalidateQueries({ queryKey: ['taskLists'] });
      toast.success('Task list deleted successfully');
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to delete task list');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createTaskList,
    updateTaskList,
    deleteTaskList,
  };
};
