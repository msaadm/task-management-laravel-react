import { Typography, Box, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { taskListService } from '../../services/taskListService';
import { TaskList } from '../../types/task';
import TaskListAccordion from '../TaskList/TaskListAccordion';

export default function SharedTaskLists() {
  const { data: sharedLists = [], isLoading } = useQuery<TaskList[]>({
    queryKey: ['sharedTaskLists'],
    queryFn: taskListService.getSharedWithMe,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!sharedLists.length) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
        No shared lists found. When someone shares a task list with you, it will appear here.
      </Typography>
    );
  }

  return (
    <>
      {sharedLists.map(taskList => (
        <TaskListAccordion key={taskList.id} taskList={taskList} isShared />
      ))}
    </>
  );
}
