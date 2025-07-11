import { useState } from 'react';
import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Button, Tabs, Tab, Alert, Link } from '@mui/material';
import Editor from '@monaco-editor/react';
import TestPayloads from '../components/TestPayloads';
import CompatibilityChecker from '../components/CompatibilityChecker';
import { validatePayload } from '../api';

const SCHEMA_VERSIONS = ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta'];

function ValidatorPage() {
  const [version, setVersion] = useState('1.5.0');
  const [code, setCode] = useState('{}');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleValidate = async () => {
    try {
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(code);
      } catch (error) {
        setValidationResult({
          status: 'error',
          message: 'Invalid JSON format. Please check your input.',
          details: error instanceof Error ? error.message : 'JSON parse error'
        });
        return;
      }

      // Chamada correta da API: validatePayload(payload, version)
      const result = await validatePayload(parsedPayload, version);
      
      setValidationResult(result);
    } catch (error) {
      setValidationResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  const handlePayloadSelect = (payload: any) => {
    setCode(JSON.stringify(payload, null, 2));
    setValidationResult(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
              <Button variant="contained" onClick={handleValidate}>
                Validate
              </Button>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Paper sx={{ height: '100%' }}>
              <Editor
                height="100%"
                defaultLanguage="json"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
            </Paper>

            <Paper sx={{ height: '100%', p: 2, overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Validation Result
              </Typography>
              {validationResult && (
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(validationResult, null, 2)}
                </pre>
              )}
            </Paper>
          </Box>
        </>
      )}

      {activeTab === 1 && <CompatibilityChecker />}
    </Box>
  );
}

export default ValidatorPage; 