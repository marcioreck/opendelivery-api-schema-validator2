import { useState } from 'react';
import { Box, Card, CardContent, Button, Typography, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Editor from '@monaco-editor/react';
import { ValidationResult } from '../types';
import { validatePayload } from '../api';

const SCHEMA_VERSIONS = ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta'];

const Validator = () => {
  const [payload, setPayload] = useState('');
  const [version, setVersion] = useState('1.5.0');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
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

      const validationResult = await validatePayload(parsedPayload, version);
      setResult(validationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        OpenDelivery Validator
      </Typography>
      <Typography variant="body1" gutterBottom>
        Validate your OpenDelivery API payload against the specified schema version.
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              JSON Payload
            </Typography>
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
          </Box>
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
              onClick={handleValidate}
              disabled={loading || !payload}
            >
              {loading ? <CircularProgress size={24} /> : 'Validate'}
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
              Validation Result
            </Typography>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Validator; 