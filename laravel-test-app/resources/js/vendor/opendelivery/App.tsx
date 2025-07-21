// OpenDelivery API Schema Validator 2 - Main App Component

import React, { useState, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import ValidationForm from './components/ValidationForm';
import CompatibilityPage from './pages/CompatibilityPage';
import CertificationPage from './pages/CertificationPage';
import { theme } from './theme';
import type { ValidationRequest, ValidationResult } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('validation');
  const [loading, setLoading] = useState(false);

  // Handle page change
  const handlePageChange = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  // Handle validation
  const handleValidation = useCallback(async (request: ValidationRequest): Promise<ValidationResult> => {
    setLoading(true);
    try {
      // This would normally call the API
      // For now, return mock result
      return {
        valid: true,
        errors: [],
        warnings: [],
        score: 100,
        version: request.version,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'validation':
        return (
          <ValidationForm
            onValidate={handleValidation}
            loading={loading}
            initialPayload={JSON.stringify({
              "id": "123",
              "status": "delivered",
              "timestamp": "2024-01-15T10:30:00Z"
            }, null, 2)}
            initialVersion="1.5.0"
          />
        );
      case 'compatibility':
        return <CompatibilityPage />;
      case 'certification':
        return <CertificationPage />;
      default:
        return (
          <ValidationForm
            onValidate={handleValidation}
            loading={loading}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar 
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        
        <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#f5f5f5' }}>
          <Container maxWidth="xl">
            {renderCurrentPage()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
