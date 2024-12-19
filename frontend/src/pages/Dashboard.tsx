import { Box, Typography, Tab, Tabs } from '@mui/material';
import SharedTaskLists from '../components/dashboard/SharedTaskLists';
import PersonalTaskLists from '../components/dashboard/PersonalTaskLists';
import Stats from '../components/dashboard/Stats';
import { useDashboard } from '../hooks/useDashboard';
import { TaskListStats } from '../types/task';

export default function Dashboard() {
  const {
    activeTab,
    setActiveTab,
    stats,
  }: { activeTab: number; setActiveTab: (activeTab: number) => void; stats: TaskListStats } =
    useDashboard();

  return (
    <Box sx={{ width: '800px', mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Typography variant="h1" color="primary" sx={{ mb: 4 }}>
        Task Management System
      </Typography>

      <Stats stats={stats} />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue: number) => setActiveTab(newValue)}>
          <Tab label="My Lists" />
          <Tab label="Shared with me" />
        </Tabs>
      </Box>

      {activeTab === 0 ? <PersonalTaskLists /> : <SharedTaskLists />}
    </Box>
  );
}
