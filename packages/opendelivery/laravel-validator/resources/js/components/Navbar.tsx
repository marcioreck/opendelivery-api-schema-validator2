// OpenDelivery API Schema Validator 2 - Navbar Component

import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import { 
  Validation as ValidationIcon, 
  Compare as CompareIcon, 
  Verified as CertifiedIcon,
  Dashboard as DashboardIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

interface NavbarProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage = 'validation', onPageChange }) => {
  const handlePageChange = (page: string) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#007bff' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <DashboardIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ mr: 3 }}>
            OpenDelivery API Schema Validator 2
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              startIcon={<ValidationIcon />}
              onClick={() => handlePageChange('validation')}
              sx={{ 
                backgroundColor: currentPage === 'validation' ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderRadius: 1,
              }}
            >
              Validation
            </Button>
            
            <Button
              color="inherit"
              startIcon={<CompareIcon />}
              onClick={() => handlePageChange('compatibility')}
              sx={{ 
                backgroundColor: currentPage === 'compatibility' ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderRadius: 1,
              }}
            >
              Compatibility
            </Button>
            
            <Button
              color="inherit"
              startIcon={<CertifiedIcon />}
              onClick={() => handlePageChange('certification')}
              sx={{ 
                backgroundColor: currentPage === 'certification' ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderRadius: 1,
              }}
            >
              Certification
            </Button>
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
};

export default Navbar;
