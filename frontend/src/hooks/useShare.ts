import { useState } from 'react';
import { toast } from 'react-toastify';
import { shareService } from '../services/shareService';
import {
  ShareHookReturn,
  ShareListParams,
  UpdatePermissionParams,
  RemoveShareParams,
} from '../types/hooks';

export const useShare = (): ShareHookReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const shareList = async ({ taskListId, username, permission }: ShareListParams) => {
    setIsLoading(true);
    try {
      await shareService.shareList(taskListId, { username: username.toLowerCase(), permission });
      toast.success('List shared successfully');
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePermission = async ({ taskListId, userId, permission }: UpdatePermissionParams) => {
    setIsLoading(true);
    try {
      await shareService.updatePermission(taskListId, userId, permission);
      toast.success('Permission updated successfully');
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to update permission');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeShare = async ({ taskListId, userId }: RemoveShareParams) => {
    setIsLoading(true);
    try {
      await shareService.removeShare(taskListId, userId);
      toast.success('Share removed successfully');
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error('Failed to remove share');
      toast.error(error?.response?.data?.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    shareList,
    updatePermission,
    removeShare,
  };
};
