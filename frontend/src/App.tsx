import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';
import ValidatorPage from '@/pages/ValidatorPage';
import CompatibilityPage from '@/pages/CompatibilityPage';
import CertificationPage from '@/pages/CertificationPage';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<ValidatorPage />} />
          <Route path="/compatibility" element={<CompatibilityPage />} />
          <Route path="/certification" element={<CertificationPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App; 