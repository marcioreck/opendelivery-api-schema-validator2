import { useState } from 'react';
import { Box, Card, CardContent, Button, Typography, Alert, CircularProgress } from '@mui/material';
import Editor from '@monaco-editor/react';
import { ValidationResult } from '../types';
import { validatePayload } from '../api';

const Validator = () => {
  const [payload, setPayload] = useState('');
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

      const validationResult = await validatePayload(parsedPayload);
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
        Validate your OpenDelivery API payload against the latest schema version.
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
            <Alert severity={result.isValid ? 'success' : 'error'}>
              {result.isValid
                ? 'Payload is valid!'
                : 'Payload validation failed. See errors below.'}
            </Alert>
            {result.errors && result.errors.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Validation Errors:
                </Typography>
                {result.errors.map((error, index) => (
                  <Alert severity="error" key={index} sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      <strong>Path:</strong> {error.path}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Message:</strong> {error.message}
                    </Typography>
                  </Alert>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Validator; 