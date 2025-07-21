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
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import MonacoEditor from '../components/MonacoEditor';
import { certifyPayload } from '../utils/api';

const SCHEMA_VERSIONS = ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta'];

function CertificationPage() {
  const [version, setVersion] = useState(SCHEMA_VERSIONS[SCHEMA_VERSIONS.length - 2]); // Use 1.5.0 as default
  const [code, setCode] = useState('{\n  // Enter your OpenDelivery JSON here\n}');
  const [certificationResult, setCertificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleCertify = async () => {
    try {
      setLoading(true);
      setError('');
      setCertificationResult(null);

      let parsedPayload;
      try {
        parsedPayload = JSON.parse(code);
      } catch (parseError) {
        setError('Invalid JSON format. Please check your input.');
        return;
      }

      const result = await certifyPayload(parsedPayload, version);
      setCertificationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Schema Certification
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Certify your OpenDelivery payload against comprehensive quality checks including schema validation, 
        business rules, security requirements, and best practices.
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            OpenDelivery Payload
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
            <Button
              variant="contained"
              onClick={handleCertify}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Certify'}
            </Button>
          </Box>
        </Box>

        <Box sx={{ height: 400, border: '1px solid #ddd', borderRadius: 1 }}>
          <MonacoEditor
            height="400px"
            language="json"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: 'on',
            }}
          />
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {certificationResult && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Certification Results
          </Typography>

          {/* Overall Score */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" color={getScoreColor(certificationResult.score)}>
              {certificationResult.score}/100
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Certification Score
            </Typography>
            <Chip 
              label={certificationResult.details?.certification_level || 'Unknown'}
              color={getScoreColor(certificationResult.score)}
              sx={{ mt: 1 }}
            />
          </Box>

          {/* Detailed Checks */}
          {certificationResult.checks && certificationResult.checks.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Detailed Checks
              </Typography>
              <List>
                {certificationResult.checks.map((check: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {getStatusIcon(check.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={check.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {check.message}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Score: {check.score}/100
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Certification Details */}
          {certificationResult.details && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Certification Details:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Schema Version: {certificationResult.details.schema_version}
              </Typography>
              {certificationResult.details.certified_at && (
                <Typography variant="body2" color="textSecondary">
                  Certified At: {new Date(certificationResult.details.certified_at).toLocaleString()}
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default CertificationPage; 