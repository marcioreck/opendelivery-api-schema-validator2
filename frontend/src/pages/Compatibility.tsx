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

const versions: ApiVersion[] = ['1.0.0', '1.1.0', '1.2.0', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc'];

const Compatibility = () => {
  const [sourceVersion, setSourceVersion] = useState<ApiVersion | ''>('');
  const [targetVersion, setTargetVersion] = useState<ApiVersion | ''>('');
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

      const compatibilityResult = await checkCompatibility(sourceVersion, targetVersion);
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
        Check compatibility between different versions of the OpenDelivery API.
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
            <Alert severity={result.isCompatible ? 'success' : 'error'}>
              {result.isCompatible
                ? `Versions ${result.sourceVersion} and ${result.targetVersion} are compatible!`
                : `Incompatibilities found between versions ${result.sourceVersion} and ${result.targetVersion}`}
            </Alert>
            {result.incompatibilities && result.incompatibilities.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Incompatibility Issues:
                </Typography>
                {result.incompatibilities.map((issue, index) => (
                  <Alert
                    severity={issue.severity.toLowerCase() as 'error' | 'warning'}
                    key={index}
                    sx={{ mt: 1 }}
                  >
                    <Typography variant="body2">
                      <strong>Path:</strong> {issue.path}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Reason:</strong> {issue.reason}
                    </Typography>
                    {issue.suggestedFix && (
                      <Typography variant="body2">
                        <strong>Suggested Fix:</strong> {issue.suggestedFix}
                      </Typography>
                    )}
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