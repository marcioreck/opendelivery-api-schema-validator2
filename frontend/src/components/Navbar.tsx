import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  CheckCircle as ValidationIcon, 
  Compare as CompareIcon, 
  Verified as CertifiedIcon,
  Dashboard as DashboardIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Validation', icon: ValidationIcon },
    { path: '/compatibility', label: 'Compatibility', icon: CompareIcon },
    { path: '/certification', label: 'Certification', icon: CertifiedIcon },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#007bff' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <DashboardIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ mr: 3 }}>
            OpenDelivery API Schema Validator 2
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                component={RouterLink}
                to={path}
                color="inherit"
                startIcon={<Icon />}
                sx={{
                  backgroundColor: location.pathname === path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            v2.0.0
          </Typography>
          
          <IconButton
            color="inherit"
            href="https://github.com/marcioreck/opendelivery-api-schema-validator2"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ opacity: 0.8 }}
          >
            <GitHubIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 