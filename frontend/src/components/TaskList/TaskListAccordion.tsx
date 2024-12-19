import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  IconButton,
  Box,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  TaskAlt as TaskIcon,
  FormatListBulleted as ListIcon,
} from '@mui/icons-material';
import { TaskList } from '../../types/task';
import TaskListItems from './TaskListItems';

interface TaskListAccordionProps {
  taskList: TaskList;
  isShared?: boolean;
  onShare?: (listId: number) => void;
  onDelete?: (listId: number) => void;
  onUpdateName?: (listId: number, newName: string) => void;
}

export default function TaskListAccordion({
  taskList,
  isShared = false,
  onShare,
  onDelete,
  onUpdateName,
}: TaskListAccordionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(taskList.name);
  const isReadOnly = isShared && taskList.share_permission === 'view';

  const handleSave = () => {
    if (editedName.trim() !== taskList.name) {
      onUpdateName?.(taskList.id, editedName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(taskList.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editedName.trim()) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '& .MuiAccordionSummary-content': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mr: 1,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {isEditing ? (
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={editedName}
                  onChange={e => setEditedName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  onClick={e => e.stopPropagation()}
                />
                <Tooltip title="Save">
                  <IconButton
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      handleSave();
                    }}
                    sx={{ ml: 1 }}
                  >
                    <CheckIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      handleCancel();
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ListIcon color="primary" />
                  <Typography variant="h4">{taskList.name}</Typography>
                </Box>
                {isShared && taskList.owner && (
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    (Shared by {taskList.owner.username})
                    {isReadOnly && (
                      <Chip label="Read Only" size="small" sx={{ ml: 1 }} color="primary" />
                    )}
                  </Typography>
                )}
              </>
            )}
          </Box>
          {!isEditing && (
            <Tooltip title="Completed / Total Tasks">
              <Chip
                size="small"
                icon={<TaskIcon />}
                label={`${taskList.completed_tasks_count} / ${taskList.tasks_count}`}
                color={
                  taskList.completed_tasks_count === taskList.tasks_count &&
                  taskList.tasks_count > 0
                    ? 'success'
                    : 'default'
                }
                onClick={e => e.stopPropagation()}
                sx={{ mr: 2 }}
              />
            </Tooltip>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            visibility: isEditing ? 'hidden' : 'visible',
          }}
          onClick={e => e.stopPropagation()}
        >
          {!isShared && (
            <>
              <Tooltip title="Edit Name">
                <IconButton size="small" onClick={() => setIsEditing(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share List">
                <IconButton size="small" onClick={() => onShare?.(taskList.id)}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete List">
                <IconButton size="small" onClick={() => onDelete?.(taskList.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </AccordionSummary>
      <Divider />
      <AccordionDetails>
        <TaskListItems
          tasks={taskList.tasks || []}
          taskListId={taskList.id}
          isReadOnly={isReadOnly}
          isShared={isShared}
        />
      </AccordionDetails>
    </Accordion>
  );
}
