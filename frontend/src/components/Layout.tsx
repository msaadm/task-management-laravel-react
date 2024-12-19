import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Box, CssBaseline, Toolbar, Typography, Button, Container } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Task Management System
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user?.name} ({user?.username})
            </Typography>
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      <Container
        component="main"
        maxWidth={false}
        sx={{
          flexGrow: 1,
          pt: { xs: 8, sm: 9 },
          pb: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
