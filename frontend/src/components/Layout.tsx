import { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OpenDelivery Validator
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ fontWeight: isActive('/') ? 'bold' : 'normal' }}
          >
            Validator
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/compatibility')}
            sx={{ fontWeight: isActive('/compatibility') ? 'bold' : 'normal' }}
          >
            Compatibility
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/certification')}
            sx={{ fontWeight: isActive('/certification') ? 'bold' : 'normal' }}
          >
            Certification
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            OpenDelivery Validator © {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 