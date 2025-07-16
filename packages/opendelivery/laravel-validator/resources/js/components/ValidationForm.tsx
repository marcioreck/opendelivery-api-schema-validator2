// OpenDelivery API Schema Validator 2 - Validation Form Component

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import MonacoEditor from './MonacoEditor';
import type { ValidationFormProps, ValidationResult, SchemaVersion } from '@/types';
import { validatePayload, getSchemaVersions, formatValidationError, getScoreColor } from '@/utils/api';

const ValidationForm: React.FC<ValidationFormProps> = ({
  onValidate,
  loading = false,
  initialPayload = '',
  initialVersion = '',
}) => {
  const [payload, setPayload] = useState(initialPayload);
  const [version, setVersion] = useState(initialVersion);
  const [strict, setStrict] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<SchemaVersion[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // Load schema versions
  useEffect(() => {
    const loadVersions = async () => {
      try {
        const schemaVersions = await getSchemaVersions();
        setVersions(schemaVersions);
        
        // Set default version if not provided
        if (!version) {
          const defaultVersion = schemaVersions.find(v => v.isDefault);
          if (defaultVersion) {
            setVersion(defaultVersion.version);
          }
        }
      } catch (err) {
        console.error('Failed to load schema versions:', err);
      }
    };
    
    loadVersions();
  }, [version]);

  // Handle validation
  const handleValidation = useCallback(async () => {
    if (!payload.trim()) {
      setError('Please enter a JSON payload to validate');
      return;
    }

    if (!version) {
      setError('Please select a schema version');
      return;
    }

    setIsValidating(true);
    setError(null);
    setResult(null);

    try {
      const validationResult = await validatePayload({
        payload: JSON.parse(payload),
        version,
        strict,
      });

      setResult(validationResult);
      
      if (onValidate) {
        onValidate({ payload: JSON.parse(payload), version, strict });
      }
    } catch (err: any) {
      setError(formatValidationError(err));
    } finally {
      setIsValidating(false);
    }
  }, [payload, version, strict, onValidate]);

  // Handle payload change
  const handlePayloadChange = useCallback((newPayload: string) => {
    setPayload(newPayload);
    setResult(null);
    setError(null);
  }, []);

  // Clear results
  const clearResults = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  // Get result color
  const getResultColor = (valid: boolean, score: number) => {
    if (valid) {
      return getScoreColor(score);
    }
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        JSON Schema Validation
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Validate your JSON payload against OpenDelivery API Schema Validator 2 specifications
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Schema Version</InputLabel>
              <Select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                label="Schema Version"
              >
                {versions.map((v) => (
                  <MenuItem key={v.version} value={v.version}>
                    {v.version} - {v.name}
                    {v.isDefault && <Chip label="Default" size="small" sx={{ ml: 1 }} />}
                    {v.status === 'beta' && <Chip label="Beta" size="small" color="warning" sx={{ ml: 1 }} />}
                    {v.status === 'deprecated' && <Chip label="Deprecated" size="small" color="error" sx={{ ml: 1 }} />}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControlLabel
                control={<Switch checked={strict} onChange={(e) => setStrict(e.target.checked)} />}
                label="Strict Mode"
              />
              
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={handleValidation}
                disabled={isValidating || loading}
                sx={{ minWidth: 120 }}
              >
                {isValidating || loading ? <CircularProgress size={20} /> : 'Validate'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={clearResults}
                disabled={isValidating || loading}
              >
                Clear
              </Button>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom>
            JSON Payload
          </Typography>
          
          <MonacoEditor
            value={payload}
            onChange={handlePayloadChange}
            language="json"
            height={400}
            options={{
              minimap: { enabled: false },
              wordWrap: 'on',
              lineNumbers: 'on',
              folding: true,
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h6">
                Validation Result
              </Typography>
              
              <Chip
                label={result.valid ? 'Valid' : 'Invalid'}
                color={getResultColor(result.valid, result.score)}
                icon={result.valid ? <CheckCircleIcon /> : <ErrorIcon />}
              />
              
              <Chip
                label={`Score: ${result.score}%`}
                color={getScoreColor(result.score)}
                variant="outlined"
              />
              
              <Chip
                label={`Version: ${result.version}`}
                variant="outlined"
              />
            </Box>

            {result.errors.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ErrorIcon color="error" />
                    Errors ({result.errors.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {result.errors.map((error, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ErrorIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary={error.message}
                          secondary={`Field: ${error.field} | Code: ${error.code}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}

            {result.warnings.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="warning" />
                    Warnings ({result.warnings.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {result.warnings.map((warning, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <WarningIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary={warning.message}
                          secondary={`Field: ${warning.field} | Code: ${warning.code}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}

            {result.valid && result.errors.length === 0 && result.warnings.length === 0 && (
              <Alert severity="success">
                <Typography variant="body1">
                  🎉 Perfect! Your JSON payload is fully compliant with OpenDelivery API Schema Validator 2 version {result.version}.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ValidationForm;
