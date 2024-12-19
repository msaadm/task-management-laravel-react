export interface ShareListParams {
  taskListId: number;
  username: string | '';
  permission: 'view' | 'edit';
}

export interface UpdatePermissionParams {
  taskListId: number;
  userId: number;
  permission: 'view' | 'edit';
}

export interface RemoveShareParams {
  taskListId: number;
  userId: number;
}

export interface ShareHookReturn {
  isLoading: boolean;
  shareList: (params: ShareListParams) => Promise<boolean>;
  updatePermission: (params: UpdatePermissionParams) => Promise<boolean>;
  removeShare: (params: RemoveShareParams) => Promise<boolean>;
}

export interface TaskHookReturn {
  isLoading: boolean;
  addTask: (taskListId: number, title: string) => Promise<boolean>;
  updateTask: (taskId: number, title: string) => Promise<boolean>;
  deleteTask: (taskId: number) => Promise<boolean>;
  toggleTaskComplete: (taskId: number) => Promise<boolean>;
}

export interface TaskListHookReturn {
  isLoading: boolean;
  createTaskList: (data: { name: string}) => Promise<boolean>;
  updateTaskList: (id: number, name: string) => Promise<boolean>;
  deleteTaskList: (id: number) => Promise<boolean>;
}
