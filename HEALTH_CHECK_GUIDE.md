# Testando o Health Endpoint

## Como testar o endpoint /health

### 1. Localmente (desenvolvimento)
```bash
# Inicie o backend
cd backend
npm run dev

# Teste o endpoint
curl http://localhost:3001/api/health

# Ou no navegador
open http://localhost:3001/api/health
```

### 2. Produção (Laravel)
```bash
# Teste o endpoint
curl https://fazmercado.com/opendelivery-api-schema-validator2/api/health

# Ou no navegador
open https://fazmercado.com/opendelivery-api-schema-validator2/api/health
```

### 3. Exemplo de resposta esperada

#### Serviço Saudável (200 OK)
```json
{
  "status": "healthy",
  "timestamp": "2025-07-15T10:30:00.000Z",
  "service": "OpenDelivery API Schema Validator 2",
  "version": "2.0.0",
  "environment": "production",
  "uptime": {
    "seconds": 3600,
    "human": "1h 0m 0s"
  },
  "memory": {
    "used": "45 MB",
    "total": "67 MB",
    "external": "12 MB"
  },
  "schemas": {
    "available": ["1.0.0", "1.0.1", "1.1.0", "1.1.1", "1.2.0", "1.2.1", "1.3.0", "1.4.0", "1.5.0", "1.6.0-rc", "beta"],
    "count": 11
  },
  "endpoints": {
    "validate": "/api/validate",
    "compatibility": "/api/compatibility",
    "certify": "/api/certify",
    "health": "/api/health"
  }
}
```

#### Serviço com Problemas (503 Service Unavailable)
```json
{
  "status": "unhealthy",
  "timestamp": "2025-07-15T10:30:00.000Z",
  "service": "OpenDelivery API Schema Validator 2",
  "error": "Service unavailable"
}
```

### 4. Interpretação dos dados

- **status**: `"healthy"` = OK, `"unhealthy"` = Problema
- **timestamp**: Hora da verificação
- **service**: Nome do serviço
- **version**: Versão atual da aplicação
- **environment**: Ambiente (production, development)
- **uptime**: Tempo que o serviço está rodando
- **memory**: Uso de memória do processo Node.js
- **schemas**: Lista de versões de schema disponíveis
- **endpoints**: URLs dos endpoints da API

### 5. Uso em monitoramento

Este endpoint pode ser usado para:
- Health checks de load balancers
- Monitoramento com Prometheus/Grafana
- Scripts de verificação automatizada
- Debugging de problemas de performance

### 6. Exemplo de script de monitoramento

```bash
#!/bin/bash
# health_check.sh

URL="https://fazmercado.com/opendelivery-api-schema-validator2/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL")

if [ "$RESPONSE" -eq 200 ]; then
    echo "✅ Serviço está saudável"
    exit 0
else
    echo "❌ Serviço não está respondendo corretamente (HTTP $RESPONSE)"
    exit 1
fi
```

### 7. Dados úteis para debugging

- **memory.used**: Uso atual de memória heap
- **memory.total**: Total de memória heap alocada
- **memory.external**: Memória usada por objetos C++ vinculados
- **uptime.seconds**: Tempo em segundos desde o start
- **schemas.count**: Quantidade de schemas carregados
- **environment**: Confirma se está em produção ou desenvolvimento
