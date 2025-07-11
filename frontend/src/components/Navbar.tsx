import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Validator' },
    { path: '/compatibility', label: 'Compatibility' },
    { path: '/certification', label: 'Certification' },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          OpenDelivery API Schema Validator 2
        </Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          {navItems.map(({ path, label }) => (
            <Button
              key={path}
              component={RouterLink}
              to={path}
              color="inherit"
              sx={{
                backgroundColor: location.pathname === path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 