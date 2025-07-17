// OpenDelivery API Schema Validator 2 - Compatibility Page

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  Grid,
  Paper,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Compare as CompareIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import MonacoEditor from '../components/MonacoEditor';
import type { CompatibilityResult, SchemaVersion } from '@/types';
import { checkCompatibility, getSchemaVersions, formatValidationError } from '@/utils/api';

const CompatibilityPage: React.FC = () => {
  const [fromVersion, setFromVersion] = useState('');
  const [toVersion, setToVersion] = useState('');
  const [payload, setPayload] = useState('');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<SchemaVersion[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [includePayload, setIncludePayload] = useState(false);

  // Load schema versions
  useEffect(() => {
    const loadVersions = async () => {
      try {
        const schemaVersions = await getSchemaVersions();
        setVersions(schemaVersions);
      } catch (err) {
        console.error('Failed to load schema versions:', err);
      }
    };
    
    loadVersions();
  }, []);

  // Handle compatibility check
  const handleCompatibilityCheck = useCallback(async () => {
    if (!fromVersion || !toVersion) {
      setError('Please select both source and target versions');
      return;
    }

    if (fromVersion === toVersion) {
      setError('Source and target versions cannot be the same');
      return;
    }

    setIsChecking(true);
    setError(null);
    setResult(null);

    try {
      const compatibilityResult = await checkCompatibility({
        fromVersion,
        toVersion,
        payload: includePayload && payload ? JSON.parse(payload) : undefined,
      });

      setResult(compatibilityResult);
    } catch (err: any) {
      setError(formatValidationError(err));
    } finally {
      setIsChecking(false);
    }
  }, [fromVersion, toVersion, payload, includePayload]);

  // Clear results
  const clearResults = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Schema Compatibility Checker
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Check compatibility between different OpenDelivery API Schema Validator 2 versions
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>From Version</InputLabel>
                <Select
                  value={fromVersion}
                  onChange={(e) => setFromVersion(e.target.value)}
                  label="From Version"
                >
                  {versions.map((v) => (
                    <MenuItem key={v.version} value={v.version}>
                      {v.version} - {v.name}
                      {v.isDefault && <Chip label="Default" size="small" sx={{ ml: 1 }} />}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>To Version</InputLabel>
                <Select
                  value={toVersion}
                  onChange={(e) => setToVersion(e.target.value)}
                  label="To Version"
                >
                  {versions.map((v) => (
                    <MenuItem key={v.version} value={v.version}>
                      {v.version} - {v.name}
                      {v.isDefault && <Chip label="Default" size="small" sx={{ ml: 1 }} />}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<CompareIcon />}
                  onClick={handleCompatibilityCheck}
                  disabled={isChecking}
                  sx={{ minWidth: 120 }}
                >
                  {isChecking ? <CircularProgress size={20} /> : 'Check'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={clearResults}
                  disabled={isChecking}
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>

          {includePayload && (
            <>
              <Typography variant="h6" gutterBottom>
                Test Payload (Optional)
              </Typography>
              
              <MonacoEditor
                value={payload}
                onChange={setPayload}
                language="json"
                height={300}
                options={{
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                }}
              />
            </>
          )}

          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIncludePayload(!includePayload)}
            >
              {includePayload ? 'Hide' : 'Show'} Payload Testing
            </Button>
            
            {includePayload && (
              <Typography variant="body2" color="text.secondary">
                Include a JSON payload to test compatibility with actual data
              </Typography>
            )}
          </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h6">
                Compatibility Result
              </Typography>
              
              <Chip
                label={result.compatible ? 'Compatible' : 'Not Compatible'}
                color={result.compatible ? 'success' : 'error'}
                icon={result.compatible ? <CheckCircleIcon /> : <ErrorIcon />}
              />
              
              <Typography variant="body2" color="text.secondary">
                {result.fromVersion} → {result.toVersion}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Summary Cards */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" color="error.main">
                    {result.breakingChanges.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Breaking Changes
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" color="warning.main">
                    {result.deprecatedFields.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Deprecated Fields
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" color="info.main">
                    {result.newFields.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    New Fields
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Breaking Changes */}
            {result.breakingChanges.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ErrorIcon color="error" />
                      Breaking Changes ({result.breakingChanges.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {result.breakingChanges.map((change, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Chip
                              label={change.impact.toUpperCase()}
                              color={getImpactColor(change.impact)}
                              size="small"
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={change.description}
                            secondary={`Field: ${change.field} | Type: ${change.type}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {/* Deprecated Fields */}
            {result.deprecatedFields.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WarningIcon color="warning" />
                      Deprecated Fields ({result.deprecatedFields.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {result.deprecatedFields.map((field, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <RemoveIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary={field.message}
                            secondary={
                              <Box>
                                <Typography variant="body2" component="span">
                                  Field: {field.field}
                                </Typography>
                                {field.replacement && (
                                  <Typography variant="body2" component="span" sx={{ ml: 2 }}>
                                    Use: {field.replacement}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {/* New Fields */}
            {result.newFields.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AddIcon color="info" />
                      New Fields ({result.newFields.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {result.newFields.map((field, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <AddIcon color="info" />
                          </ListItemIcon>
                          <ListItemText
                            primary={field.description}
                            secondary={
                              <Box>
                                <Typography variant="body2" component="span">
                                  Field: {field.field} | Type: {field.type}
                                </Typography>
                                {field.required && (
                                  <Chip label="Required" color="error" size="small" sx={{ ml: 1 }} />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {/* Success Message */}
            {result.compatible && result.breakingChanges.length === 0 && (
              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body1">
                  🎉 Perfect compatibility! No breaking changes detected between versions {result.fromVersion} and {result.toVersion}.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CompatibilityPage;
