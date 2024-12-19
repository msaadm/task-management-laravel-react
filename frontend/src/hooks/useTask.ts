import { useState } from 'react';
import { toast } from 'react-toastify';
import { taskService } from '../services/taskService';

export const useTask = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addTask = async (listId: number, title: string) => {
    if (!title.trim()) return false;

    setIsLoading(true);
    try {
      await taskService.create(listId, { title });
      toast.success('Task added successfully');
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to add task');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (taskId: number, title: string) => {
    if (!title.trim()) return false;

    setIsLoading(true);
    try {
      await taskService.update(taskId, { title });
      toast.success('Task updated successfully');
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to update task');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: number) => {
    setIsLoading(true);
    try {
      await taskService.delete(taskId);
      toast.success('Task deleted successfully');
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to delete task');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskComplete = async (taskId: number) => {
    setIsLoading(true);
    try {
      await taskService.toggleComplete(taskId);
      toast.success('Task status updated');
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to update task status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reorderTasks = async (taskListId: number, taskIds: number[]) => {
    try {
      await taskService.reorder(taskListId, taskIds);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to reorder tasks');
      return false;
    }
  };

  return {
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    reorderTasks,
    isLoading,
  };
};
