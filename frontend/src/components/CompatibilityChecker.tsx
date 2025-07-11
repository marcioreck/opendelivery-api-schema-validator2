import React, { useState } from 'react';
import { validatePayload } from '../api';

interface CompatibilityResult {
  version: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: string;
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
  
  // Payload de teste básico compatível com todas as versões
  const testPayload = {
    "order": {
      "orderId": "12345",
      "total": {
        "itemsPrice": 100.0,
        "deliveryFee": 10.0,
        "benefits": 0.0,
        "totalPrice": 110.0
      },
      "preparationTimeSeconds": 1800,
      "merchant": {
        "merchantId": "merchant-123",
        "name": "Restaurante Teste"
      },
      "items": [
        {
          "name": "Produto Teste",
          "quantity": 1,
          "unit": "UN",
          "unitPrice": 100.0,
          "totalPrice": 100.0,
          "externalId": "item-123"
        }
      ]
    }
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

  const runCompatibilityTest = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress({ current: 0, total: SCHEMA_VERSIONS.length, currentVersion: '' });

    const newResults: CompatibilityResult[] = [];

    for (let i = 0; i < SCHEMA_VERSIONS.length; i++) {
      const version = SCHEMA_VERSIONS[i];
      setProgress({ current: i, total: SCHEMA_VERSIONS.length, currentVersion: version });

      try {
        const result = await validatePayload(version, testPayload);
        
        if (result.status === 'success') {
          newResults.push({
            version,
            status: 'success',
            message: `✅ Validação bem-sucedida - API oficial do Open Delivery v${version} confirmada`,
            details: result.message
          });
        } else {
          newResults.push({
            version,
            status: 'error',
            message: `❌ Falha na validação - Possível incompatibilidade com v${version}`,
            details: result.message
          });
        }
      } catch (error) {
        newResults.push({
          version,
          status: 'error',
          message: `❌ Erro de conexão - Não foi possível validar v${version}`,
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      setResults([...newResults]);
    }

    setProgress({ current: SCHEMA_VERSIONS.length, total: SCHEMA_VERSIONS.length, currentVersion: '' });
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const totalCount = results.length;

  return (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">
          🔍 Verificador de Autenticidade da API Open Delivery
        </h2>
        <div className="text-blue-800 space-y-2">
          <p>
            <strong>Propósito:</strong> Este teste valida que nosso validador está usando a API oficial do Open Delivery 
            com autenticidade em todas as versões disponíveis do padrão.
          </p>
          <p>
            <strong>Como funciona:</strong> Enviamos um payload de teste para cada versão do schema Open Delivery 
            e verificamos se a validação é feita corretamente pela API oficial.
          </p>
          <p>
            <strong>Garantia:</strong> Um resultado positivo confirma que você está usando um validador autêntico 
            e atualizado com o padrão Open Delivery.
          </p>
        </div>
      </div>

      {/* Botão de execução */}
      <div className="flex justify-center">
        <button
          onClick={runCompatibilityTest}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Verificando Autenticidade...
            </>
          ) : (
            <>
              🔍 Executar Verificação de Autenticidade
            </>
          )}
        </button>
      </div>

      {/* Progresso */}
      {isRunning && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Verificando autenticidade da API...
            </span>
            <span className="text-sm text-gray-500">
              {progress.current}/{progress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
          {progress.currentVersion && (
            <p className="text-xs text-gray-600 mt-1">
              Testando versão: {progress.currentVersion}
            </p>
          )}
        </div>
      )}

      {/* Resumo dos resultados */}
      {results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">📊 Resumo da Verificação</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-blue-800">Versões Testadas</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-green-800">APIs Autênticas</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{totalCount - successCount}</div>
              <div className="text-sm text-red-800">Falhas/Incompatibilidades</div>
            </div>
          </div>
          
          {successCount === totalCount && totalCount > 0 && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ Validador 100% Autêntico! Todas as versões da API Open Delivery foram verificadas com sucesso.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Resultados detalhados */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">📋 Resultados Detalhados por Versão</h3>
          {results.map((result) => (
            <div 
              key={result.version}
              className={`border rounded-lg p-4 ${getStatusBg(result.status)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      Open Delivery v{result.version}
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                      {result.status === 'success' ? 'AUTÊNTICA' : 'FALHA'}
                    </span>
                  </div>
                  <p className={`text-sm ${getStatusColor(result.status)}`}>
                    {result.message}
                  </p>
                </div>
                {result.details && (
                  <button
                    onClick={() => toggleExpanded(result.version)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    {expandedResults.has(result.version) ? '▼' : '▶'}
                  </button>
                )}
              </div>
              
              {result.details && expandedResults.has(result.version) && (
                <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border">
                  <h4 className="font-medium text-gray-900 mb-2">Detalhes da Validação:</h4>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {result.details}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Informações adicionais */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">ℹ️ Informações Técnicas</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>Versões testadas:</strong> {SCHEMA_VERSIONS.join(', ')}</li>
          <li>• <strong>Payload de teste:</strong> Pedido básico compatível com todas as versões</li>
          <li>• <strong>Endpoint:</strong> API oficial do Open Delivery para validação de schemas</li>
          <li>• <strong>Propósito:</strong> Garantir autenticidade e compatibilidade do validador</li>
        </ul>
      </div>
    </div>
  );
};

export default CompatibilityChecker; 