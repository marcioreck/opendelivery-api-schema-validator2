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
import { validatePayload } from '../utils/api';

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

  const SCHEMA_VERSIONS = ["1.0.0", "1.0.1", "1.1.0", "1.1.1", "1.2.0", "1.2.1", "1.3.0", "1.4.0", "1.5.0", "1.6.0-rc", "beta"];
  
  // Payload básico compatível com padrão OpenDelivery v1.5.0+
  const getTestPayload = () => ({
    id: "123e4567-e89b-12d3-a456-426614174000",
    type: "DELIVERY",
    displayId: "ODV-123456",
    createdAt: "2024-01-20T10:30:00Z",
    orderTiming: "INSTANT",
    preparationStartDateTime: "2024-01-20T10:30:00Z",
    merchant: {
      id: "merchant-abc123",
      name: "Restaurante Teste"
    },
    customer: {
      id: "customer-123",
      name: "João Silva",
      phone: {
        number: "11987654321"
      },
      documentNumber: "12345678901",
      ordersCountOnMerchant: 1
    },
    items: [
      {
        id: "item-001",
        name: "Produto Teste",
        quantity: 1,
        unit: "UNIT",
        unitPrice: {
          value: 25.50,
          currency: "BRL"
        },
        totalPrice: {
          value: 25.50,
          currency: "BRL"
        },
        externalCode: "PROD-001"
      }
    ],
    total: {
      items: {
        value: 25.50,
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
        value: 25.50,
        currency: "BRL"
      }
    },
    payments: {
      prepaid: 0.00,
      pending: 25.50,
      methods: [
        {
          value: 25.50,
          currency: "BRL",
          type: "PENDING",
          method: "CREDIT",
          methodInfo: "Cartão de Crédito"
        }
      ]
    }
  });

  const runCompatibilityTest = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress({ current: 0, total: SCHEMA_VERSIONS.length, currentVersion: '' });

    const testPayload = getTestPayload();
    const newResults: CompatibilityResult[] = [];

    for (let i = 0; i < SCHEMA_VERSIONS.length; i++) {
      const version = SCHEMA_VERSIONS[i];
      
      setProgress({
        current: i + 1,
        total: SCHEMA_VERSIONS.length,
        currentVersion: version
      });

      try {
        const result = await validatePayload(testPayload, version);
        
        newResults.push({
          version,
          isValid: result.status === 'success' && result.data?.valid === true,
          details: result.data,
          errors: result.data?.errors || []
        });
      } catch (error) {
        newResults.push({
          version,
          isValid: false,
          details: { error: error instanceof Error ? error.message : 'Unknown error' },
          errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }]
        });
      }

      // Pequeno delay para mostrar o progresso
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setResults(newResults);
    setIsRunning(false);
  };

  const getSuccessRate = () => {
    if (results.length === 0) return 0;
    const successCount = results.filter(r => r.isValid).length;
    return Math.round((successCount / results.length) * 100);
  };

  const getStatusColor = (isValid: boolean) => {
    return isValid ? 'success' : 'error';
  };

  const getStatusText = (isValid: boolean) => {
    return isValid ? 'Compatible' : 'Incompatible';
  };

  const toggleExpanded = (version: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedResults(newExpanded);
  };

  const getRecommendations = () => {
    const validVersions = results.filter(r => r.isValid).map(r => r.version);
    const invalidVersions = results.filter(r => !r.isValid).map(r => r.version);

    if (validVersions.length === 0) {
      return "❌ Payload is not compatible with any OpenDelivery version. Please check the payload structure.";
    }

    if (invalidVersions.length === 0) {
      return "✅ Payload is compatible with all OpenDelivery versions tested!";
    }

    const latestValid = validVersions[validVersions.length - 1];
    return `✅ Compatible with ${validVersions.length} versions. Latest compatible: ${latestValid}`;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Verificador de Compatibilidade
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Este teste verifica a compatibilidade do payload padrão com todas as versões do schema OpenDelivery.
      </Alert>

      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={runCompatibilityTest}
          disabled={isRunning}
          sx={{ mr: 2 }}
        >
          {isRunning ? 'Testando...' : 'Executar Teste de Compatibilidade'}
        </Button>
        
        {results.length > 0 && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            Taxa de Sucesso: {getSuccessRate()}% ({results.filter(r => r.isValid).length}/{results.length})
          </Typography>
        )}
      </Box>

      {isRunning && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Testando versão: {progress.currentVersion}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(progress.current / progress.total) * 100}
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {progress.current} de {progress.total} versões testadas
          </Typography>
        </Box>
      )}

      {results.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Resultados do Teste
          </Typography>
          
          <Alert severity={getSuccessRate() >= 80 ? 'success' : getSuccessRate() >= 60 ? 'warning' : 'error'} sx={{ mb: 2 }}>
            {getRecommendations()}
          </Alert>

          <Grid container spacing={2}>
            {results.map((result) => (
              <Grid item xs={12} sm={6} md={4} key={result.version}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: result.isValid ? '2px solid #4caf50' : '2px solid #f44336',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => toggleExpanded(result.version)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6">
                        {result.version}
                      </Typography>
                      <Chip 
                        label={getStatusText(result.isValid)}
                        color={getStatusColor(result.isValid)}
                        size="small"
                      />
                    </Box>
                    
                    {result.isValid ? (
                      <Typography variant="body2" color="success.main">
                        ✅ Payload válido
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="error.main">
                        ❌ {result.errors?.length || 0} erro(s) encontrado(s)
                      </Typography>
                    )}

                    {expandedResults.has(result.version) && (
                      <Box sx={{ mt: 2 }}>
                        {result.details && (
                          <Typography variant="caption" component="pre" sx={{ 
                            fontSize: '0.75rem',
                            maxHeight: '200px',
                            overflow: 'auto',
                            backgroundColor: '#f5f5f5',
                            p: 1,
                            borderRadius: 1,
                            display: 'block'
                          }}>
                            {JSON.stringify(result.details, null, 2)}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default CompatibilityChecker;
