import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { TaskListStats } from '../../types/task';

interface StatsProps {
  stats: TaskListStats;
}

export default function Stats({ stats }: StatsProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Overall Statistics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Total Task Lists
              </Typography>
              <Typography variant="h3">{stats.totalTaskLists}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {stats.personal.totalTaskLists} personal • {stats.shared.totalSharedLists} shared
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h3">{stats.totalTasks}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {stats.personal.totalTasks} personal • {stats.shared.totalSharedTasks} shared
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Completed Tasks
              </Typography>
              <Typography variant="h3">{stats.completedTasks}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {stats.personal.completedTasks} personal • {stats.shared.completedSharedTasks}{' '}
                shared
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
