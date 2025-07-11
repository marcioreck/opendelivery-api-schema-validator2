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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import Editor from '@monaco-editor/react';

const SCHEMA_VERSIONS = ['1.0.0', '1.1.0', '1.2.0', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc'];

const SAMPLE_PAYLOAD = {
  "id": "12345",
  "type": "DELIVERY",
  "displayId": "12345",
  "createdAt": "2023-01-01T00:00:00Z",
  "orderTiming": "INSTANT",
  "preparationStartDateTime": "2023-01-01T00:00:00Z",
  "merchant": {
    "id": "merchant-123",
    "name": "Restaurante Teste"
  },
  "items": [
    {
      "id": "item-123",
      "name": "Produto Teste",
      "unit": "UN",
      "quantity": 1,
      "unitPrice": {
        "value": 100.0,
        "currency": "BRL"
      },
      "totalPrice": {
        "value": 100.0,
        "currency": "BRL"
      },
      "externalCode": "item-123"
    }
  ],
  "total": {
    "itemsPrice": {
      "value": 100.0,
      "currency": "BRL"
    },
    "totalPrice": {
      "value": 110.0,
      "currency": "BRL"
    },
    "otherFees": {
      "value": 0.0,
      "currency": "BRL"
    },
    "orderAmount": {
      "value": 110.0,
      "currency": "BRL"
    },
    "discount": {
      "value": 0.0,
      "currency": "BRL"
    }
  },
  "payments": {
    "prepaid": 110.0,
    "pending": 0.0,
    "methods": [
      {
        "value": 110.0,
        "currency": "BRL",
        "type": "PENDING",
        "method": "CREDIT",
        "methodInfo": "Credit Card"
      }
    ]
  }
};

function CompatibilityPage() {
  const [sourceVersion, setSourceVersion] = useState('1.5.0');
  const [targetVersion, setTargetVersion] = useState('1.6.0-rc');
  const [code, setCode] = useState(JSON.stringify(SAMPLE_PAYLOAD, null, 2));
  const [compatibilityResult, setCompatibilityResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/compatibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_version: sourceVersion,
          target_version: targetVersion,
          payload: JSON.parse(code),
        }),
      });

      const result = await response.json();
      setCompatibilityResult(result);
    } catch (error) {
      setCompatibilityResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'upgrade': return 'success';
      case 'downgrade': return 'warning';
      case 'version_change': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Compatibility Checker</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Source Version</InputLabel>
            <Select
              value={sourceVersion}
              label="Source Version"
              onChange={(e) => setSourceVersion(e.target.value)}
            >
              {SCHEMA_VERSIONS.map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Target Version</InputLabel>
            <Select
              value={targetVersion}
              label="Target Version"
              onChange={(e) => setTargetVersion(e.target.value)}
            >
              {SCHEMA_VERSIONS.map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleCheck} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Check Compatibility'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">OpenDelivery JSON Payload</Typography>
                <Typography variant="body2" color="text.secondary">
                  Edit the JSON payload to test compatibility between schema versions
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setCode(JSON.stringify(SAMPLE_PAYLOAD, null, 2))}
              >
                Load Example
              </Button>
            </Box>
          </Box>
          <Editor
            height="100%"
            defaultLanguage="json"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </Paper>

        <Paper sx={{ height: '100%', p: 2, overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Compatibility Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {sourceVersion} → {targetVersion}
          </Typography>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {compatibilityResult?.status === 'success' && (
            <>
              <Box sx={{ mb: 2 }}>
                <Alert severity={compatibilityResult.compatible ? 'success' : 'error'}>
                  {compatibilityResult.compatible 
                    ? 'The payload is compatible with the target version' 
                    : 'The payload has compatibility issues with the target version'}
                </Alert>
              </Box>

              {compatibilityResult.details && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Validation Summary
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip 
                      label={`Source (${sourceVersion}): ${compatibilityResult.details.source_validation.valid ? 'Valid' : 'Invalid'}`}
                      color={compatibilityResult.details.source_validation.valid ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip 
                      label={`Target (${targetVersion}): ${compatibilityResult.details.target_validation.valid ? 'Valid' : 'Invalid'}`}
                      color={compatibilityResult.details.target_validation.valid ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </Box>
              )}
            </>
          )}
          
          {compatibilityResult?.changes && compatibilityResult.changes.length > 0 && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Compatibility Details
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Path</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {compatibilityResult.changes.map((change: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip 
                            label={change.type} 
                            color={getTypeColor(change.type)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {change.path}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {change.description}
                          </Typography>
                          {change.severity && (
                            <Chip 
                              label={change.severity} 
                              color={getSeverityColor(change.severity)}
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          
          {compatibilityResult?.status === 'error' && (
            <Alert severity="error">
              {compatibilityResult.message}
            </Alert>
          )}
          
          {!compatibilityResult && !loading && (
            <Typography variant="body2" color="text.secondary">
              Select source and target versions and click "Check Compatibility" to see the analysis.
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default CompatibilityPage; 