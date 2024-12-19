import React, { useEffect, useState } from 'react';
import { List, ListItem, TextField, InputAdornment, Tooltip, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Task } from '../../types/task';
import { useTask } from '../../hooks/useTask';
import { useQueryClient } from '@tanstack/react-query';
import DeleteTaskDialog from '../dialogs/DeleteTaskDialog';
import TaskItem from './TaskItem';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';

interface TaskListItemsProps {
  tasks: Task[];
  taskListId: number;
  isReadOnly?: boolean;
  isShared?: boolean;
}

export default function TaskListItems({
  tasks,
  taskListId,
  isReadOnly = false,
  isShared = false,
}: TaskListItemsProps) {
  const [tasksData, setTasksData] = useState<Task[]>(tasks);
  const { deleteTask, addTask, reorderTasks } = useTask();
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  useEffect(() => {
    setTasksData(tasks);
  }, [tasks]);

  const handleDeleteTask = async (taskId: number) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      const success = await deleteTask(taskToDelete);
      if (success) {
        await queryClient.invalidateQueries({ queryKey: ['taskLists'] });
        await queryClient.invalidateQueries({ queryKey: ['taskListStats'] });
      }
    }
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      const success = await addTask(taskListId, newTaskTitle.trim());
      if (success) {
        setNewTaskTitle('');
        await queryClient.invalidateQueries({ queryKey: ['taskLists'] });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, handler: () => void) => {
    if (e.key === 'Enter') {
      handler();
    } else if (e.key === 'Escape') {
      setNewTaskTitle('');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Create new array with updated order
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(sourceIndex, 1);
    reorderedTasks.splice(destinationIndex, 0, removed);

    setTasksData(reorderedTasks);

    // Get task IDs in new order
    const taskIds = reorderedTasks.map(task => task.id);

    const success = await reorderTasks(taskListId, taskIds);
    if (success) {
      if (isShared) {
        await queryClient.invalidateQueries({ queryKey: ['sharedTaskLists'] });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['taskLists'] });
      }
    }
  };

  return (
    <>
      <List>
        {!isReadOnly && !isShared && (
          <ListItem>
            <TextField
              fullWidth
              size="small"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => handleKeyPress(e, handleAddTask)}
              placeholder="Add a new task..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Add task">
                      <IconButton
                        edge="end"
                        onClick={handleAddTask}
                        disabled={!newTaskTitle.trim()}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
        )}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={`list-${taskListId}`} isDropDisabled={isReadOnly}>
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tasksData.map((task, index) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    index={index}
                    isReadOnly={isReadOnly}
                    isShared={isShared}
                    onDeleteClick={handleDeleteTask}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </List>

      <DeleteTaskDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}
