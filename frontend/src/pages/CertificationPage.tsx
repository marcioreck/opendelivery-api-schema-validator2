import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';

const SCHEMA_VERSIONS = ['1.0.0', '1.1.0', '1.2.0', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc'];

function CertificationPage() {
  const [version, setVersion] = useState(SCHEMA_VERSIONS[SCHEMA_VERSIONS.length - 1]);
  const [code, setCode] = useState('{\n  // Enter your OpenDelivery JSON here\n}');
  const [certificationResult, setCertificationResult] = useState<any>(null);

  const handleCertify = async () => {
    try {
      const response = await fetch('/api/certify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schema_version: version,
          payload: JSON.parse(code),
        }),
      });

      const result = await response.json();
      setCertificationResult(result);
    } catch (error) {
      setCertificationResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">OpenDelivery Ready Certification</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Version</InputLabel>
            <Select
              value={version}
              label="Version"
              onChange={(e) => setVersion(e.target.value)}
            >
              {SCHEMA_VERSIONS.map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleCertify}>
            Certify
          </Button>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Paper sx={{ height: '100%' }}>
          <Editor
            height="100%"
            defaultLanguage="json"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </Paper>

        <Paper sx={{ height: '100%', p: 2, overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Certification Results
          </Typography>
          {certificationResult?.score !== undefined && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="body1">Overall Score:</Typography>
                <Chip
                  label={`${certificationResult.score}%`}
                  color={getScoreColor(certificationResult.score)}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={certificationResult.score}
                color={getScoreColor(certificationResult.score)}
              />
            </Box>
          )}
          {certificationResult?.checks && (
            <List>
              {certificationResult.checks.map((check: any, index: number) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {getStatusIcon(check.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={check.name}
                    secondary={check.message}
                  />
                </ListItem>
              ))}
            </List>
          )}
          {certificationResult?.status === 'error' && (
            <Typography color="error">
              {certificationResult.message}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default CertificationPage; 