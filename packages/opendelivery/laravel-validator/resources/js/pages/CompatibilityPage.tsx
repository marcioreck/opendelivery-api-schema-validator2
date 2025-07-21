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
  Grid,
} from '@mui/material';
import MonacoEditor from '../components/MonacoEditor';
import { checkCompatibility } from '../utils/api';
import TestPayloads from '../components/TestPayloads';

const SCHEMA_VERSIONS = ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta'];

// Payload básico que é compatível com v1.5.0+
const INITIAL_PAYLOAD = {
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

export default function CompatibilityPage() {
  const [sourceVersion, setSourceVersion] = useState<string>('1.0.0');
  const [targetVersion, setTargetVersion] = useState<string>('1.5.0');
  const [payload, setPayload] = useState<string>(JSON.stringify(INITIAL_PAYLOAD, null, 2));
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleCompatibilityCheck = async () => {
    try {
      setLoading(true);
      setError('');
      
      const parsedPayload = JSON.parse(payload);
      const response = await checkCompatibility(sourceVersion, targetVersion, parsedPayload);
      
      setResult(response);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Payload JSON inválido. Por favor, verifique a sintaxe.');
      } else {
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao verificar compatibilidade');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayloadSelect = (selectedPayload: any) => {
    setPayload(JSON.stringify(selectedPayload, null, 2));
  };

  const isValidJson = (str: string): boolean => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const getCompatibilityStatusColor = (compatible: boolean) => {
    return compatible ? 'success' : 'error';
  };

  const getCompatibilityStatusText = (compatible: boolean) => {
    return compatible ? 'Compatível' : 'Incompatível';
  };

  const getCompatibilityLevelText = (level: string) => {
    switch (level) {
      case 'fully_compatible':
        return 'Totalmente Compatível';
      case 'upgraded_compatibility':
        return 'Compatibilidade Melhorada';
      case 'partially_compatible':
        return 'Parcialmente Compatível';
      case 'regression':
        return 'Regressão';
      case 'same_issues':
        return 'Mesmos Problemas';
      default:
        return 'Incompatível';
    }
  };

  const getCompatibilityLevelColor = (level: string) => {
    switch (level) {
      case 'fully_compatible':
        return 'success';
      case 'upgraded_compatibility':
        return 'info';
      case 'partially_compatible':
        return 'warning';
      case 'regression':
        return 'error';
      case 'same_issues':
        return 'warning';
      default:
        return 'error';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Verificador de Compatibilidade entre Versões
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Verifique se um payload é compatível entre diferentes versões do esquema OpenDelivery.
        Você pode comparar versões diferentes ou usar versões iguais para validar um payload específico.
      </Typography>

      <Grid container spacing={3}>
        {/* Configuração */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Configuração
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Versão de Origem</InputLabel>
              <Select
                value={sourceVersion}
                onChange={(e) => setSourceVersion(e.target.value)}
                label="Versão de Origem"
              >
                {SCHEMA_VERSIONS.map((version) => (
                  <MenuItem key={version} value={version}>
                    {version}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Versão de Destino</InputLabel>
              <Select
                value={targetVersion}
                onChange={(e) => setTargetVersion(e.target.value)}
                label="Versão de Destino"
              >
                {SCHEMA_VERSIONS.map((version) => (
                  <MenuItem key={version} value={version}>
                    {version}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleCompatibilityCheck}
              disabled={loading || !isValidJson(payload)}
              fullWidth
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verificar Compatibilidade'}
            </Button>

            {sourceVersion === targetVersion && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Verificando compatibilidade na mesma versão ({sourceVersion}). Isso validará se o payload é válido para esta versão específica.
              </Alert>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Exemplos de Payload:
              </Typography>
              <TestPayloads onSelectPayload={handlePayloadSelect} />
            </Box>
          </Paper>
        </Grid>

        {/* Editor */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payload para Teste
            </Typography>
            
            <Box sx={{ height: 400, border: '1px solid #ddd', borderRadius: 1 }}>
              <MonacoEditor
                height="400px"
                language="json"
                value={payload}
                onChange={(value) => setPayload(value || '')}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </Box>
            
            {!isValidJson(payload) && (
              <Alert severity="error" sx={{ mt: 1 }}>
                JSON inválido. Por favor, corrija a sintaxe.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Resultado */}
      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Resultado da Verificação
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Status de Compatibilidade
                </Typography>
                <Chip 
                  label={getCompatibilityStatusText(result.compatible)}
                  color={getCompatibilityStatusColor(result.compatible)}
                  size="large"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Nível de Compatibilidade
                </Typography>
                <Chip 
                  label={getCompatibilityLevelText(result.compatibility_level)}
                  color={getCompatibilityLevelColor(result.compatibility_level)}
                  size="large"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Versões Comparadas
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {result.details?.source_version} → {result.details?.target_version}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {result.recommendations && result.recommendations.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recomendações
              </Typography>
              {result.recommendations.map((recommendation: string, index: number) => (
                <Alert key={index} severity="info" sx={{ mb: 1 }}>
                  {recommendation}
                </Alert>
              ))}
            </Box>
          )}

          {result.changes && result.changes.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Alterações Identificadas
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Caminho</TableCell>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Severidade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.changes.map((change: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip 
                            label={change.type} 
                            size="small" 
                            color={change.type === 'new_error' ? 'error' : change.type === 'fixed_error' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>{change.path}</TableCell>
                        <TableCell>{change.description}</TableCell>
                        <TableCell>
                          <Chip 
                            label={change.severity} 
                            size="small"
                            color={change.severity === 'high' ? 'error' : change.severity === 'medium' ? 'warning' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Detalhes da Validação
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Validação na Versão de Origem ({result.details?.source_version})
              </Typography>
              <Alert 
                severity={result.details?.source_validation?.valid ? 'success' : 'error'}
                sx={{ mb: 1 }}
              >
                {result.details?.source_validation?.valid 
                  ? 'Payload válido na versão de origem' 
                  : 'Payload inválido na versão de origem'}
              </Alert>
              {result.details?.source_validation?.errors && result.details.source_validation.errors.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {result.details.source_validation.errors.map((error: any, index: number) => (
                    <Alert key={index} severity="error" sx={{ mb: 1 }}>
                      {error.path ? `${error.path}: ${error.message}` : error.message}
                    </Alert>
                  ))}
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Validação na Versão de Destino ({result.details?.target_version})
              </Typography>
              <Alert 
                severity={result.details?.target_validation?.valid ? 'success' : 'error'}
                sx={{ mb: 1 }}
              >
                {result.details?.target_validation?.valid 
                  ? 'Payload válido na versão de destino' 
                  : 'Payload inválido na versão de destino'}
              </Alert>
              {result.details?.target_validation?.errors && result.details.target_validation.errors.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {result.details.target_validation.errors.map((error: any, index: number) => (
                    <Alert key={index} severity="error" sx={{ mb: 1 }}>
                      {error.path ? `${error.path}: ${error.message}` : error.message}
                    </Alert>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
} 