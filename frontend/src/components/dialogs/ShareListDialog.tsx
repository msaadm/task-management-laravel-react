import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useShare } from '../../hooks/useShare';
import { taskListService } from '../../services/taskListService';
import { useQuery } from '@tanstack/react-query';

interface ShareListDialogProps {
  open: boolean;
  onClose: () => void;
  taskListId: number;
}

export default function ShareListDialog({ open, onClose, taskListId }: ShareListDialogProps) {
  const [username, setUsername] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const { data: taskList, isLoading: isTaskListLoading } = useQuery({
    queryKey: ['taskList', taskListId],
    queryFn: async () => {
      if (!taskListId) return null;
      return await taskListService.get(taskListId);
    },
    enabled: !!taskListId && open,
  });
  const { shareList, updatePermission, removeShare, isLoading } = useShare();

  const handleShare = async () => {
    if (!taskList || !username.trim()) return;

    if (
      await shareList({
        taskListId: taskList.id,
        username: username.trim(),
        permission,
      })
    ) {
      setUsername('');
      setPermission('view');
      onClose();
    }
  };

  const handleUpdatePermission = async (userId: number, newPermission: 'view' | 'edit') => {
    if (!taskList) return;
    await updatePermission({
      taskListId: taskList.id,
      userId,
      permission: newPermission,
    });
    onClose();
  };

  const handleRemoveShare = async (userId: number) => {
    if (!taskList) return;
    if (
      await removeShare({
        taskListId: taskList.id,
        userId,
      })
    ) {
      onClose();
    }
  };

  if (!open) {
    return;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isTaskListLoading ? 'Loading...' : `Share "${taskList?.name || ''}"`}
      </DialogTitle>
      <DialogContent>
        {isTaskListLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth>
                <InputLabel>Permission</InputLabel>
                <Select
                  value={permission}
                  label="Permission"
                  onChange={e => setPermission(e.target.value as 'view' | 'edit')}
                >
                  <MenuItem value="view">View Only</MenuItem>
                  <MenuItem value="edit">Can Edit</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Shared With
            </Typography>
            <List>
              {taskList?.shares?.map(share => (
                <ListItem key={share.user.id}>
                  <ListItemText primary={share.user.username} />
                  <ListItemSecondaryAction>
                    <FormControl size="small" sx={{ mr: 1 }}>
                      <Select
                        value={share.permission}
                        onChange={e =>
                          handleUpdatePermission(share.user.id, e.target.value as 'view' | 'edit')
                        }
                        size="small"
                      >
                        <MenuItem value="view">View Only</MenuItem>
                        <MenuItem value="edit">Can Edit</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton edge="end" onClick={() => handleRemoveShare(share.user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {taskList && !taskList.shares?.length && (
                <Typography variant="body2" color="text.secondary">
                  This list hasn't been shared with anyone yet.
                </Typography>
              )}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleShare}
          variant="contained"
          disabled={!username.trim() || isLoading || isTaskListLoading}
        >
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
}
