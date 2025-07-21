import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  Compare as CompareIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import { CertificationResult } from '../types';
import { certifyPayload } from '../api';

const Certification = () => {
  const [payload, setPayload] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCertify = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payload);
      } catch (e) {
        setError('Invalid JSON format');
        return;
      }

      const certificationResult = await certifyPayload(parsedPayload);
      setResult(certificationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        OpenDelivery Certification
      </Typography>
      <Typography variant="body1" gutterBottom>
        Get your implementation certified as OpenDelivery Ready.
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            JSON Payload
          </Typography>
          <Editor
            height="400px"
            defaultLanguage="json"
            value={payload}
            onChange={(value) => setPayload(value || '')}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: 'on'
            }}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleCertify}
              disabled={loading || !payload}
            >
              {loading ? <CircularProgress size={24} /> : 'Certify'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Certification Result
            </Typography>
            <Alert
              severity={result.isPassing ? 'success' : 'error'}
              sx={{ mb: 2 }}
            >
              {result.isPassing
                ? 'Congratulations! Your implementation is OpenDelivery Ready!'
                : 'Your implementation needs some improvements to be certified.'}
            </Alert>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Overall Score: {result.score}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={result.score}
                color={result.isPassing ? 'success' : 'error'}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem>
                <ListItemIcon>
                  <CodeIcon color={result.details.schemaValidation.isValid ? 'success' : 'error'} />
                </ListItemIcon>
                <ListItemText
                  primary="Schema Validation"
                  secondary={
                    result.details.schemaValidation.isValid
                      ? 'Passed all schema validations'
                      : `Failed with ${result.details.schemaValidation.errors?.length} errors`
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <CompareIcon
                    color={
                      result.details.compatibilityChecks.every((c) => c.isCompatible)
                        ? 'success'
                        : 'error'
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Compatibility"
                  secondary={`${
                    result.details.compatibilityChecks.filter((c) => c.isCompatible).length
                  } of ${result.details.compatibilityChecks.length} versions compatible`}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <SecurityIcon
                    color={
                      result.details.securityChecks.every((c) => c.passed)
                        ? 'success'
                        : 'error'
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Security Checks"
                  secondary={`${
                    result.details.securityChecks.filter((c) => c.passed).length
                  } of ${result.details.securityChecks.length} checks passed`}
                />
              </ListItem>
            </List>

            {!result.isPassing && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                  Recommendations to achieve certification:
                </Typography>
                <List>
                  {result.details.schemaValidation.errors?.map((error, index) => (
                    <ListItem key={`schema-${index}`}>
                      <ListItemIcon>
                        <CancelIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Fix schema validation error at ${error.path}`}
                        secondary={error.message}
                      />
                    </ListItem>
                  ))}
                  {result.details.compatibilityChecks
                    .filter((check) => !check.isCompatible)
                    .map((check, index) => (
                      <ListItem key={`compat-${index}`}>
                        <ListItemIcon>
                          <CancelIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Resolve compatibility issues between versions ${check.sourceVersion} and ${check.targetVersion}`}
                        />
                      </ListItem>
                    ))}
                  {result.details.securityChecks
                    .filter((check) => !check.passed)
                    .map((check, index) => (
                      <ListItem key={`security-${index}`}>
                        <ListItemIcon>
                          <CancelIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary={check.check}
                          secondary={check.details}
                        />
                      </ListItem>
                    ))}
                </List>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Certification; 