import { useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { taskListService } from '../../services/taskListService';
import TaskListAccordion from '../TaskList/TaskListAccordion';
import ShareListDialog from '../dialogs/ShareListDialog';
import CreateListDialog from '../dialogs/CreateListDialog';
import DeleteListDialog from '../dialogs/DeleteListDialog';
import { toast } from 'react-toastify';

export default function PersonalTaskLists() {
  const queryClient = useQueryClient();
  const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskListToDelete, setTaskListToDelete] = useState<number | null>(null);

  const { data: taskLists, isLoading } = useQuery({
    queryKey: ['taskLists'],
    queryFn: taskListService.getAll,
  });

  const handleCreateTaskList = async () => {
    if (newListName.trim()) {
      const success = await taskListService.create({ name: newListName.trim() });
      if (success) {
        setNewListName('');
        setNewListDialogOpen(false);
        await queryClient.invalidateQueries({ queryKey: ['taskLists'] });
        await queryClient.invalidateQueries({ queryKey: ['taskListStats'] });
        toast.success('Task List created successfully');
      }
    }
  };

  const handleDeleteTaskList = async (taskListId: number) => {
    setTaskListToDelete(taskListId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (taskListToDelete) {
      const success = await taskListService.delete(taskListToDelete);
      if (success) {
        await queryClient.invalidateQueries({ queryKey: ['taskLists'] });
        await queryClient.invalidateQueries({ queryKey: ['taskListStats'] });
        toast.success('Task List deleted successfully');
      }
    }
    setDeleteConfirmOpen(false);
    setTaskListToDelete(null);
  };

  const handleShareList = (listId: number) => {
    setSelectedTaskListId(listId);
    setShareDialogOpen(true);
  };

  const handleUpdateTaskListName = async (taskListId: number, newName: string) => {
    const success = await taskListService.update(taskListId, { name: newName });
    if (success) {
      await queryClient.invalidateQueries({ queryKey: ['taskLists'] });
      await queryClient.invalidateQueries({ queryKey: ['taskListStats'] });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={() => setNewListDialogOpen(true)}>
          <AddIcon />
          New List
        </Button>
      </Box>

      {taskLists?.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            No task lists yet
          </Typography>
        </Box>
      ) : (
        taskLists?.map(taskList => (
          <TaskListAccordion
            key={taskList.id}
            taskList={taskList}
            onShare={handleShareList}
            onDelete={handleDeleteTaskList}
            onUpdateName={handleUpdateTaskListName}
          />
        ))
      )}

      {selectedTaskListId && (
        <ShareListDialog
          open={shareDialogOpen}
          taskListId={selectedTaskListId}
          onClose={() => {
            setShareDialogOpen(false);
            setSelectedTaskListId(null);
          }}
        />
      )}

      <CreateListDialog
        open={newListDialogOpen}
        onClose={() => {
          setNewListDialogOpen(false);
          setNewListName('');
        }}
        onSubmit={handleCreateTaskList}
        name={newListName}
        onNameChange={setNewListName}
      />

      <DeleteListDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setTaskListToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
