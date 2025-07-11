import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  LinearProgress, 
  Alert, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { validatePayload } from '../api';

interface CompatibilityResult {
  version: string;
  isValid: boolean;
  details?: any;
  errors?: any[];
}

interface TestProgress {
  current: number;
  total: number;
  currentVersion: string;
}

const CompatibilityChecker: React.FC = () => {
  const [results, setResults] = useState<CompatibilityResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<TestProgress>({ current: 0, total: 0, currentVersion: '' });
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  const SCHEMA_VERSIONS = ["1.0.0", "1.1.0", "1.2.0", "1.3.0", "1.4.0", "1.5.0", "1.6.0-rc"];
  
  // Payload básico compatível com padrão OpenDelivery
  const getTestPayload = () => ({
    id: "123e4567-e89b-12d3-a456-426614174000",
    type: "DELIVERY",
    displayId: "ODV-123456",
    createdAt: "2024-01-20T10:30:00Z",
    orderTiming: "INSTANT",
    preparationStartDateTime: "2024-01-20T10:30:00Z",
    merchant: {
      id: "merchant-abc123",
      name: "Restaurante Exemplo"
    },
    items: [
      {
        id: "item-001",
        name: "Produto Exemplo",
        quantity: 1,
        unit: "UN",
        unitPrice: {
          value: 25.90,
          currency: "BRL"
        },
        totalPrice: {
          value: 25.90,
          currency: "BRL"
        },
        externalCode: "PROD-001"
      }
    ],
    total: {
      itemsPrice: {
        value: 25.90,
        currency: "BRL"
      },
      otherFees: {
        value: 0.00,
        currency: "BRL"
      },
      discount: {
        value: 0.00,
        currency: "BRL"
      },
      orderAmount: {
        value: 25.90,
        currency: "BRL"
      }
    },
    payments: {
      prepaid: 0.00,
      pending: 25.90,
      methods: [
        {
          value: 25.90,
          currency: "BRL",
          type: "PENDING",
          method: "CREDIT",
          methodInfo: "Cartão de Crédito"
        }
      ]
    }
  });

  const toggleExpanded = (version: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedResults(newExpanded);
  };

  const runCompatibilityTest = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress({ current: 0, total: SCHEMA_VERSIONS.length, currentVersion: '' });

    const testPayload = getTestPayload();
    const newResults: CompatibilityResult[] = [];

    for (let i = 0; i < SCHEMA_VERSIONS.length; i++) {
      const version = SCHEMA_VERSIONS[i];
      setProgress({ current: i + 1, total: SCHEMA_VERSIONS.length, currentVersion: version });

      try {
        const result = await validatePayload(testPayload, version);
        newResults.push({
          version,
          isValid: result.valid,
          details: result.details,
          errors: result.errors
        });
      } catch (error) {
        newResults.push({
          version,
          isValid: false,
          details: null,
          errors: [{ message: `Erro ao validar versão ${version}: ${error}` }]
        });
      }

      // Pequena pausa para mostrar o progresso
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setResults(newResults);
    setIsRunning(false);
  };

  const getCompatibilityStatusColor = (isValid: boolean) => {
    return isValid ? 'success' : 'error';
  };

  const getCompatibilityStatusText = (isValid: boolean) => {
    return isValid ? 'Compatível' : 'Incompatível';
  };

  const compatibleVersions = results.filter(r => r.isValid).length;
  const totalVersions = results.length;
  const compatibilityPercentage = totalVersions > 0 ? Math.round((compatibleVersions / totalVersions) * 100) : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Verificador de Compatibilidade
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Teste a compatibilidade de um payload com todas as versões do esquema OpenDelivery disponíveis.
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={runCompatibilityTest}
          disabled={isRunning}
          sx={{ mb: 2 }}
        >
          {isRunning ? 'Executando Teste...' : 'Executar Teste de Compatibilidade'}
        </Button>

        {isRunning && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Testando versão: {progress.currentVersion}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(progress.current / progress.total) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}

        {results.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo dos Resultados
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    Versões Compatíveis
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {compatibleVersions}/{totalVersions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    Taxa de Compatibilidade
                  </Typography>
                  <Typography variant="h4" color={compatibilityPercentage >= 70 ? 'success.main' : 'error.main'}>
                    {compatibilityPercentage}%
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    Status Geral
                  </Typography>
                  <Chip 
                    label={compatibilityPercentage >= 70 ? 'Boa Compatibilidade' : 'Baixa Compatibilidade'} 
                    color={compatibilityPercentage >= 70 ? 'success' : 'error'}
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Paper>

      {results.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Resultados Detalhados
          </Typography>
          
          {results.map((result, index) => (
            <Accordion 
              key={result.version}
              expanded={expandedResults.has(result.version)}
              onChange={() => toggleExpanded(result.version)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Typography variant="h6">
                    Versão {result.version}
                  </Typography>
                  <Chip 
                    label={getCompatibilityStatusText(result.isValid)}
                    color={getCompatibilityStatusColor(result.isValid)}
                    size="small"
                  />
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                {result.isValid ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    O payload é compatível com a versão {result.version} do esquema OpenDelivery.
                  </Alert>
                ) : (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    O payload não é compatível com a versão {result.version} do esquema OpenDelivery.
                  </Alert>
                )}

                {result.errors && result.errors.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Erros de Validação:
                    </Typography>
                    {result.errors.map((error, errorIndex) => (
                      <Alert key={errorIndex} severity="error" sx={{ mb: 1 }}>
                        {error.path ? `${error.path}: ${error.message}` : error.message}
                      </Alert>
                    ))}
                  </Box>
                )}

                {result.details && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Detalhes da Validação:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Versão do esquema: {result.details.schema_version}
                    </Typography>
                    {result.details.validated_at && (
                      <Typography variant="body2" color="textSecondary">
                        Validado em: {new Date(result.details.validated_at).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default CompatibilityChecker; 