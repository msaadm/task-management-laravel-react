export type SharePermission = 'view' | 'edit';

export interface ShareListRequest {
  listId: string;
  username: string;
  permission: SharePermission;
}

export interface SharedUser {
  id: string;
  username: string;
  permission: SharePermission;
  sharedAt: string;
}

export interface Share {
  id: number;
  task_list_id: number;
  user_id: number;
  permission: SharePermission;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    username: string;
  };
}

export interface SharedList {
  id: string;
  name: string;
  ownerId: string;
  ownerUsername: string;
  permission: SharePermission;
  sharedAt: string;
}
