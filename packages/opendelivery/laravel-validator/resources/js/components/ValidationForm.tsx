// OpenDelivery API Schema Validator 2 - Validation Form Component

import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import MonacoEditor from './MonacoEditor';
import TestPayloads from './TestPayloads';
import CompatibilityChecker from './CompatibilityChecker';
import { validatePayload } from '../utils/api';

interface ValidationFormProps {
  onValidate?: (request: any) => Promise<any>;
  loading?: boolean;
  initialPayload?: string;
  initialVersion?: string;
}

interface ValidationResult {
  valid: boolean;
  errors?: Array<{
    property: string;
    message: string;
    constraint?: any;
    value?: any;
  }>;
  warnings?: Array<{
    type: string;
    message: string;
    severity: string;
  }>;
  score?: number;
  version?: string;
}

const SCHEMA_VERSIONS = ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta'];

const ValidationForm: React.FC<ValidationFormProps> = ({
  onValidate,
  loading = false,
  initialPayload = '{}',
  initialVersion = '1.5.0',
}) => {
  const [payload, setPayload] = useState(initialPayload);
  const [version, setVersion] = useState(initialVersion);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

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
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payload);
      } catch (parseError) {
        setError('Invalid JSON format. Please check your input.');
        return;
      }

      const validationResult = await validatePayload(parsedPayload, version);
      
      if (validationResult.status === 'success') {
        setResult(validationResult.data);
      } else {
        setError(validationResult.message || 'Validation failed');
      }
      
      if (onValidate) {
        await onValidate({ payload: parsedPayload, version });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during validation');
    } finally {
      setIsValidating(false);
    }
  }, [payload, version, onValidate]);

  // Handle payload change
  const handlePayloadChange = useCallback((newPayload: string) => {
    setPayload(newPayload);
    setResult(null);
    setError(null);
  }, []);

  // Handle payload select from test payloads
  const handlePayloadSelect = useCallback((selectedPayload: any) => {
    setPayload(JSON.stringify(selectedPayload, null, 2));
    setResult(null);
    setError(null);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  return (
    <Box sx={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>OpenDelivery API Schema Validator 2</strong> - Ferramenta para validação, compatibilidade e certificação de implementações da API OpenDelivery. 
          Desenvolvido por{' '}
          <Link href="https://fazmercado.com" target="_blank" rel="noopener noreferrer" color="primary">
            Márcio Reck
          </Link>
          {' '} | {' '}
          <Link href="https://github.com/marcioreck/opendelivery-api-schema-validator2" target="_blank" rel="noopener noreferrer" color="primary">
            GitHub
          </Link>
          {' '} | {' '}
          <Link href="https://www.opendelivery.com.br/" target="_blank" rel="noopener noreferrer" color="primary">
            OpenDelivery API
          </Link>
        </Typography>
      </Alert>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Schema Validator" />
          <Tab label="Verificador de Compatibilidade" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Schema Validator</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TestPayloads onSelectPayload={handlePayloadSelect} />
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
                onClick={handleValidation}
                disabled={isValidating || loading}
              >
                {isValidating || loading ? <CircularProgress size={20} /> : 'Validate'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                JSON Payload
              </Typography>
              <Paper sx={{ height: '100%', minHeight: 400 }}>
                <MonacoEditor
                  value={payload}
                  onChange={handlePayloadChange}
                  language="json"
                  height="100%"
                />
              </Paper>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Validation Results
              </Typography>
              <Paper sx={{ height: '100%', minHeight: 400, p: 2 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2">{error}</Typography>
                  </Alert>
                )}

                {result && (
                  <Box>
                    <Alert 
                      severity={result.valid ? 'success' : 'error'} 
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="body2">
                        {result.valid ? 'Payload is valid!' : 'Payload is invalid'}
                        {result.score !== undefined && ` (Score: ${result.score}%)`}
                      </Typography>
                    </Alert>

                    {result.errors && result.errors.length > 0 && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle1">
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
                                  secondary={error.property}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    )}

                    {result.warnings && result.warnings.length > 0 && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle1">
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
                                  secondary={warning.type}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        </>
      )}

      {activeTab === 1 && (
        <CompatibilityChecker />
      )}
    </Box>
  );
};

export default ValidationForm;
