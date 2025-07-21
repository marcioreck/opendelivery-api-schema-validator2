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
      name: "Pizzaria Bella Vista"
    },
    items: [
      {
        id: "item-pizza-001",
        name: "Pizza Margherita",
        quantity: 1,
        unit: "UN",
        unitPrice: {
          value: 32.90,
          currency: "BRL"
        },
        totalPrice: {
          value: 32.90,
          currency: "BRL"
        },
        externalCode: "PIZZA-MARG-001"
      }
    ],
    total: {
      itemsPrice: {
        value: 32.90,
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
        value: 32.90,
        currency: "BRL"
      }
    },
    payments: {
      prepaid: 0.00,
      pending: 32.90,
      methods: [
        {
          value: 32.90,
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
          isValid: result.status === 'success',
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
  
  // Calcular pontuação inteligente baseada em intervalos de compatibilidade
  const calculateIntelligentScore = () => {
    if (results.length === 0) return 0;
    
    const compatibleVersionsList = results.filter(r => r.isValid).map(r => r.version);
    const versionNumbers = SCHEMA_VERSIONS.map(v => {
      const cleanVersion = v.replace('-rc', '').replace('beta', '0.9');
      const parts = cleanVersion.split('.');
      return parseFloat(`${parts[0]}.${parts[1]}`);
    });
    
    // Encontrar o maior intervalo contínuo de compatibilidade
    const compatibleIndices = results
      .map((r, i) => ({ result: r, index: i }))
      .filter(({ result }) => result.isValid)
      .map(({ index }) => index);
    
    if (compatibleIndices.length === 0) return 0;
    
    // Calcular intervalo contínuo mais longo
    let maxContinuousLength = 0;
    let currentLength = 1;
    let maxContinuousStart = compatibleIndices[0];
    let maxContinuousEnd = compatibleIndices[0];
    
    for (let i = 1; i < compatibleIndices.length; i++) {
      if (compatibleIndices[i] === compatibleIndices[i-1] + 1) {
        currentLength++;
      } else {
        if (currentLength > maxContinuousLength) {
          maxContinuousLength = currentLength;
          maxContinuousStart = compatibleIndices[i - currentLength];
          maxContinuousEnd = compatibleIndices[i - 1];
        }
        currentLength = 1;
      }
    }
    
    // Verificar o último intervalo
    if (currentLength > maxContinuousLength) {
      maxContinuousLength = currentLength;
      maxContinuousStart = compatibleIndices[compatibleIndices.length - currentLength];
      maxContinuousEnd = compatibleIndices[compatibleIndices.length - 1];
    }
    
    // Calcular pontuação baseada no intervalo contínuo
    const continuousScore = (maxContinuousLength / SCHEMA_VERSIONS.length) * 100;
    
    // Bonus para versões mais recentes/importantes
    const recentVersionsBonus = compatibleVersionsList.filter(v => {
      const versionNum = parseFloat(v.replace('-rc', '').replace('beta', '0.9'));
      return versionNum >= 1.2; // Versões 1.2.0+ são mais importantes
    }).length * 10;
    
    // Bonus especial para compatibilidade v1.2.0 até v1.5.0 (intervalo chave)
    const keyIntervalBonus = compatibleVersionsList.includes('1.2.0') && 
                           compatibleVersionsList.includes('1.5.0') &&
                           compatibleVersionsList.includes('1.3.0') &&
                           compatibleVersionsList.includes('1.4.0') ? 25 : 0;
    
    // Pontuação final
    const totalScore = Math.min(100, continuousScore + recentVersionsBonus + keyIntervalBonus);
    
    return Math.round(totalScore);
  };
  
  const compatibilityPercentage = calculateIntelligentScore();
  
  // Determinar nível de compatibilidade baseado na pontuação ajustada
  const getCompatibilityLevel = () => {
    if (compatibilityPercentage >= 90) return { level: 'GOLD', color: '#FFD700', description: 'Alta Compatibilidade' };
    if (compatibilityPercentage >= 70) return { level: 'SILVER', color: '#C0C0C0', description: 'Boa Compatibilidade' };
    if (compatibilityPercentage >= 50) return { level: 'BRONZE', color: '#CD7F32', description: 'Compatibilidade Básica' };
    return { level: 'BAIXA', color: '#FF6B6B', description: 'Baixa Compatibilidade' };
  };
  
  const compatibilityLevel = getCompatibilityLevel();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Verificador de Compatibilidade
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Este verificador testa a compatibilidade de um payload padrão com todas as versões do esquema OpenDelivery disponíveis,
        garantindo que nossa implementação está seguindo corretamente o padrão oficial.
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={runCompatibilityTest}
          disabled={isRunning}
          sx={{ mb: 2 }}
        >
          {isRunning ? 'Executando Verificação...' : 'Executar Verificação de Compatibilidade'}
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
                    Nível de Compatibilidade
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`${compatibilityLevel.level} - ${compatibilityLevel.description}`} 
                      sx={{ 
                        backgroundColor: compatibilityLevel.color,
                        color: compatibilityLevel.level === 'GOLD' ? '#000' : '#fff',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Paper>

      {results.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Resultados Detalhados por Versão
          </Typography>
          
          {results.map((result, index) => (
            <Accordion 
              key={result.version}
              expanded={expandedResults.has(result.version)}
              onChange={() => toggleExpanded(result.version)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                  <Typography variant="h6">
                    OpenDelivery v{result.version}
                  </Typography>
                  <Chip 
                    label={getCompatibilityStatusText(result.isValid)}
                    color={getCompatibilityStatusColor(result.isValid)}
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