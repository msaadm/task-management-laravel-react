import { useState } from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Box,
  Tooltip,
  Checkbox,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { Task } from '../../types/task';
import { useTask } from '../../hooks/useTask';
import { useQueryClient } from '@tanstack/react-query';
import { Draggable } from '@hello-pangea/dnd';

interface TaskItemProps {
  task: Task;
  index: number;
  isReadOnly?: boolean;
  isShared?: boolean;
  onDeleteClick: (taskId: number) => void;
}

interface EditingTask {
  id: number;
  title: string;
}

export default function TaskItem({
  task,
  index,
  isReadOnly = false,
  isShared = false,
  onDeleteClick,
}: TaskItemProps) {
  const { toggleTaskComplete, updateTask } = useTask();
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState<EditingTask | null>(null);

  const handleToggleComplete = async (taskId: number) => {
    const success = await toggleTaskComplete(taskId);
    if (success) {
      if (isShared) {
        await queryClient.invalidateQueries({ queryKey: ['sharedTaskLists'] });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['taskLists'] });
      }
      await queryClient.invalidateQueries({ queryKey: ['taskListStats'] });
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingTask({ id: task.id, title: task.title });
  };

  const handleSave = async () => {
    if (editingTask && editingTask.title.trim() !== '') {
      const success = await updateTask(editingTask.id, editingTask.title.trim());
      if (success) {
        if (isShared) {
          await queryClient.invalidateQueries({ queryKey: ['sharedTaskLists'] });
        } else {
          await queryClient.invalidateQueries({ queryKey: ['taskLists'] });
        }
        await queryClient.invalidateQueries({ queryKey: ['taskListStats'] });
      }
    }
    setEditingTask(null);
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index} isDragDisabled={isReadOnly}>
      {(provided, snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          divider
          sx={{
            background: snapshot.isDragging ? 'rgba(0, 0, 0, 0.05)' : 'inherit',
          }}
        >
          <Box {...provided.dragHandleProps} sx={{ mr: 1, cursor: 'grab' }}>
            <DragIcon />
          </Box>
          <Checkbox
            edge="start"
            checked={task.is_completed}
            onChange={() => handleToggleComplete(task.id)}
            disabled={isReadOnly}
          />
          {editingTask?.id === task.id ? (
            <TextField
              fullWidth
              value={editingTask.title}
              onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
              onKeyDown={handleKeyPress}
              autoFocus
              onClick={e => e.stopPropagation()}
              style={{ marginRight: '0' }}
            />
          ) : (
            <ListItemText
              primary={task.title}
              sx={{
                textDecoration: task.is_completed ? 'line-through' : 'none',
                color: task.is_completed ? 'text.secondary' : 'text.primary',
              }}
            />
          )}
          {!isReadOnly && (
            <Box>
              {editingTask?.id === task.id ? (
                <div style={{ display: 'flex' }}>
                  <Tooltip title="Save">
                    <IconButton edge="end" onClick={handleSave}>
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancel">
                    <IconButton edge="end" onClick={handleCancel}>
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              ) : (
                <>
                  {!task.is_completed && (
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          edge="end"
                          onClick={e => {
                            e.stopPropagation();
                            handleStartEdit(task);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {!isShared && (
                        <Tooltip title="Delete">
                          <IconButton edge="end" onClick={() => onDeleteClick(task.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          )}
        </ListItem>
      )}
    </Draggable>
  );
}
