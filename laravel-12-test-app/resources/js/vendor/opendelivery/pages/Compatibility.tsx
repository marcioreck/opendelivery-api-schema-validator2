import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { ApiVersion, CompatibilityReport } from '../types';
import { checkCompatibility } from '../api';

const versions: ApiVersion[] = ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta'];

// Test payload for compatibility checking
const TEST_PAYLOAD = {
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "type": "DELIVERY",
  "displayId": "ODV-123456",
  "createdAt": "2024-01-20T10:30:00Z",
  "orderTiming": "INSTANT",
  "preparationStartDateTime": "2024-01-20T10:30:00Z",
  "merchant": {
    "id": "merchant-abc123",
    "name": "Pizzaria Bella Vista"
  },
  "items": [
    {
      "id": "item-pizza-001",
      "name": "Pizza Margherita",
      "quantity": 1,
      "unit": "UN",
      "unitPrice": {
        "value": 32.90,
        "currency": "BRL"
      },
      "totalPrice": {
        "value": 32.90,
        "currency": "BRL"
      },
      "externalCode": "PIZZA-MARG-001"
    }
  ],
  "total": {
    "itemsPrice": {
      "value": 32.90,
      "currency": "BRL"
    },
    "otherFees": {
      "value": 0.00,
      "currency": "BRL"
    },
    "discount": {
      "value": 0.00,
      "currency": "BRL"
    },
    "orderAmount": {
      "value": 32.90,
      "currency": "BRL"
    }
  },
  "payments": {
    "prepaid": 0.00,
    "pending": 32.90,
    "methods": [
      {
        "value": 32.90,
        "currency": "BRL",
        "type": "PENDING",
        "method": "CREDIT",
        "methodInfo": "Cartão de Crédito"
      }
    ]
  }
};

const Compatibility = () => {
  const [sourceVersion, setSourceVersion] = useState<ApiVersion | ''>('1.5.0');
  const [targetVersion, setTargetVersion] = useState<ApiVersion | ''>('1.5.0');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!sourceVersion || !targetVersion) {
      setError('Please select both source and target versions');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const compatibilityResult = await checkCompatibility(sourceVersion, targetVersion, TEST_PAYLOAD);
      setResult(compatibilityResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Compatibility Checker
      </Typography>
      <Typography variant="body1" gutterBottom>
        Check compatibility between different versions of the OpenDelivery API using a standard test payload.
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel>Source Version</InputLabel>
                <Select
                  value={sourceVersion}
                  label="Source Version"
                  onChange={(e) => setSourceVersion(e.target.value as ApiVersion)}
                >
                  {versions.map((version) => (
                    <MenuItem key={version} value={version}>
                      {version}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel>Target Version</InputLabel>
                <Select
                  value={targetVersion}
                  label="Target Version"
                  onChange={(e) => setTargetVersion(e.target.value as ApiVersion)}
                >
                  {versions.map((version) => (
                    <MenuItem key={version} value={version}>
                      {version}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheck}
                disabled={loading || !sourceVersion || !targetVersion}
                sx={{ height: '56px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Check'}
              </Button>
            </Grid>
          </Grid>
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
              Compatibility Result
            </Typography>
            <Alert severity={result.compatible ? 'success' : 'error'}>
              {result.compatible
                ? `Versions ${result.details?.source_version} and ${result.details?.target_version} are compatible!`
                : `Incompatibilities found between versions ${result.details?.source_version} and ${result.details?.target_version}`}
            </Alert>
            
            {result.changes && result.changes.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Changes Identified:
                </Typography>
                {result.changes.map((change: any, index: number) => (
                  <Alert
                    severity={change.severity === 'high' ? 'error' : change.severity === 'medium' ? 'warning' : 'info'}
                    key={index}
                    sx={{ mt: 1 }}
                  >
                    <Typography variant="body2">
                      <strong>Type:</strong> {change.type}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Path:</strong> {change.path}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Description:</strong> {change.description}
                    </Typography>
                  </Alert>
                ))}
              </Box>
            )}

            {result.recommendations && result.recommendations.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Recommendations:
                </Typography>
                {result.recommendations.map((recommendation: string, index: number) => (
                  <Alert key={index} severity="info" sx={{ mt: 1 }}>
                    {recommendation}
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

export default Compatibility; 