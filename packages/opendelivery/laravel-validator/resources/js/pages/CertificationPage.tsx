// OpenDelivery API Schema Validator 2 - Certification Page

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
  LinearProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Verified as VerifiedIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import MonacoEditor from '../components/MonacoEditor';
import type { CertificationResult, SchemaVersion } from '@/types';
import { certifyPayload, getSchemaVersions, formatValidationError, getCertificationLevel } from '@/utils/api';

const CertificationPage: React.FC = () => {
  const [payload, setPayload] = useState('');
  const [version, setVersion] = useState('');
  const [includeWarnings, setIncludeWarnings] = useState(true);
  const [result, setResult] = useState<CertificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<SchemaVersion[]>([]);
  const [isCertifying, setIsCertifying] = useState(false);

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

  // Handle certification
  const handleCertification = useCallback(async () => {
    if (!payload.trim()) {
      setError('Please enter a JSON payload to certify');
      return;
    }

    if (!version) {
      setError('Please select a schema version');
      return;
    }

    setIsCertifying(true);
    setError(null);
    setResult(null);

    try {
      const certificationResult = await certifyPayload({
        payload: JSON.parse(payload),
        version,
        includeWarnings,
      });

      setResult(certificationResult);
    } catch (err: any) {
      setError(formatValidationError(err));
    } finally {
      setIsCertifying(false);
    }
  }, [payload, version, includeWarnings]);

  // Clear results
  const clearResults = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  // Get level color
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'success';
      case 'advanced': return 'info';
      case 'intermediate': return 'warning';
      case 'basic': return 'error';
      default: return 'default';
    }
  };

  // Get level icon
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'expert': return <TrophyIcon />;
      case 'advanced': return <StarIcon />;
      case 'intermediate': return <SpeedIcon />;
      case 'basic': return <CheckCircleIcon />;
      default: return <CheckCircleIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        OpenDelivery Ready Certification
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Get your implementation certified as OpenDelivery Ready by testing against comprehensive validation criteria
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
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={includeWarnings} 
                    onChange={(e) => setIncludeWarnings(e.target.checked)} 
                  />
                }
                label="Include Warnings"
              />
              
              <Button
                variant="contained"
                startIcon={<VerifiedIcon />}
                onClick={handleCertification}
                disabled={isCertifying}
                sx={{ minWidth: 120 }}
              >
                {isCertifying ? <CircularProgress size={20} /> : 'Certify'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={clearResults}
                disabled={isCertifying}
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
            onChange={setPayload}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h6">
                Certification Result
              </Typography>
              
              <Chip
                label={result.certified ? 'OpenDelivery Ready' : 'Not Certified'}
                color={result.certified ? 'success' : 'error'}
                icon={result.certified ? <VerifiedIcon /> : <ErrorIcon />}
              />
              
              <Chip
                label={result.level.toUpperCase()}
                color={getLevelColor(result.level)}
                icon={getLevelIcon(result.level)}
                variant="outlined"
              />
              
              <Typography variant="body2" color="text.secondary">
                Version: {version}
              </Typography>
            </Box>

            {/* Score Overview */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" color="primary.main">
                    {result.score}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Score
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" color="success.main">
                    {result.percentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compliance Rate
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    {getLevelIcon(result.level)}
                    <Typography variant="h6" color="text.primary">
                      {result.level.toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Certification Level
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Progress Bar */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Progress: {result.score}/{result.maxScore} points
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.percentage.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={result.percentage}
                sx={{ height: 8, borderRadius: 1 }}
                color={result.percentage >= 90 ? 'success' : result.percentage >= 70 ? 'warning' : 'error'}
              />
            </Box>

            {/* Certification Checks */}
            <Typography variant="h6" gutterBottom>
              Certification Checks
            </Typography>
            
            {Object.entries(
              result.checks.reduce((acc, check) => {
                if (!acc[check.category]) acc[check.category] = [];
                acc[check.category].push(check);
                return acc;
              }, {} as Record<string, any[]>)
            ).map(([category, checks]) => (
              <Accordion key={category} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography variant="h6">
                      {category}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`${checks.filter(c => c.passed).length}/${checks.length}`}
                        color={checks.every(c => c.passed) ? 'success' : 'error'}
                        size="small"
                      />
                      
                      <Chip
                        label={`${checks.reduce((sum, c) => sum + c.score, 0)}/${checks.reduce((sum, c) => sum + c.maxScore, 0)} pts`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {checks.map((check, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {check.passed ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <ErrorIcon color="error" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={check.name}
                          secondary={
                            <Box>
                              <Typography variant="body2" component="div">
                                {check.description}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Score: {check.score}/{check.maxScore} points
                              </Typography>
                              {check.errors && check.errors.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  {check.errors.map((error, errorIndex) => (
                                    <Typography key={errorIndex} variant="caption" color="error.main" component="div">
                                      • {error}
                                    </Typography>
                                  ))}
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}

            {/* Certification Message */}
            {result.certified ? (
              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body1">
                  🎉 Congratulations! Your implementation is <strong>OpenDelivery Ready</strong> at <strong>{result.level.toUpperCase()}</strong> level 
                  with {result.percentage.toFixed(1)}% compliance rate.
                </Typography>
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ mt: 3 }}>
                <Typography variant="body1">
                  Your implementation needs improvement to achieve OpenDelivery Ready certification. 
                  Current score: {result.score}/{result.maxScore} points ({result.percentage.toFixed(1)}%).
                  Review the failed checks above to improve your implementation.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CertificationPage;
