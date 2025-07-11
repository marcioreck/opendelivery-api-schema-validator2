# OpenDelivery API Schema Validator 2 - Documentação da API

## URL Base
```
http://localhost:8000
```

## Autenticação
Atualmente, a API não requer autenticação. No entanto, limitação de taxa é aplicada para prevenir abuso.

## Sobre o OpenDelivery

O **OpenDelivery** é um padrão de API REST que estabelece um protocolo único de comunicação entre comerciantes e aplicações de pedidos no ecossistema de delivery. Para mais informações sobre o padrão oficial, visite: [https://www.opendelivery.com.br/](https://www.opendelivery.com.br/)

## Endpoints

### Validação de Esquema

#### POST /validate
Valida um payload JSON contra uma versão específica do esquema OpenDelivery.

##### Requisição
```json
{
  "schema_version": "1.6.0-rc",
  "payload": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "orderTiming": "INSTANT",
    "orderType": "DELIVERY",
    "items": [
      {
        "id": "item1",
        "name": "Produto Teste",
        "quantity": 1,
        "unitPrice": 15.90
      }
    ],
    "total": {
      "orderAmount": 15.90
    },
    "payments": [
      {
        "type": "CREDIT",
        "value": 15.90
      }
    ],
    "customer": {
      "id": "customer1",
      "name": "Cliente Teste"
    }
  }
}
```

##### Resposta de Sucesso
```json
{
  "status": "success",
  "message": "Payload é válido",
  "details": {
    "schema_version": "1.6.0-rc",
    "validated_at": "2024-01-01T12:00:00Z"
  }
}
```

##### Resposta de Erro
```json
{
  "status": "error",
  "message": "Falha na validação",
  "errors": [
    {
      "path": "/items/0/quantity",
      "message": "Campo obrigatório ausente",
      "details": {
        "expected": "number",
        "received": "undefined"
      }
    }
  ],
  "schema_version": "1.6.0-rc"
}
```

### Verificação de Compatibilidade

#### POST /compatibility
Verifica a compatibilidade de um payload JSON entre duas versões do esquema OpenDelivery.

##### Requisição
```json
{
  "source_version": "1.5.0",
  "target_version": "1.6.0-rc",
  "payload": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "orderTiming": "INSTANT",
    "orderType": "DELIVERY",
    "items": [
      {
        "id": "item1",
        "name": "Produto Teste",
        "quantity": 1,
        "unitPrice": 15.90
      }
    ],
    "total": {
      "orderAmount": 15.90
    }
  }
}
```

##### Resposta de Sucesso
```json
{
  "status": "success",
  "compatible": true,
  "changes": [
    {
      "type": "added",
      "path": "/delivery/trackingCode",
      "description": "Novo campo opcional para código de rastreamento"
    },
    {
      "type": "modified",
      "path": "/items/unitPrice",
      "description": "Estrutura do preço alterada para objeto com moeda"
    }
  ],
  "details": {
    "source_version": "1.5.0",
    "target_version": "1.6.0-rc",
    "checked_at": "2024-01-01T12:00:00Z",
    "breaking_changes": false
  }
}
```

##### Resposta com Incompatibilidade
```json
{
  "status": "success",
  "compatible": false,
  "changes": [
    {
      "type": "removed",
      "path": "/items/observations",
      "description": "Campo removido na versão mais recente",
      "severity": "high"
    },
    {
      "type": "required",
      "path": "/delivery/address",
      "description": "Campo agora é obrigatório",
      "severity": "medium"
    }
  ],
  "details": {
    "source_version": "1.5.0",
    "target_version": "1.6.0-rc",
    "checked_at": "2024-01-01T12:00:00Z",
    "breaking_changes": true
  }
}
```

### Certificação OpenDelivery Ready

#### POST /certify
Realiza verificações de certificação "OpenDelivery Ready" em um payload JSON.

##### Requisição
```json
{
  "schema_version": "1.6.0-rc",
  "payload": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "orderTiming": "INSTANT",
    "orderType": "DELIVERY",
    "items": [
      {
        "id": "item1",
        "name": "Produto Teste",
        "quantity": 1,
        "unitPrice": 15.90
      }
    ],
    "total": {
      "orderAmount": 15.90
    },
    "payments": [
      {
        "type": "CREDIT",
        "value": 15.90
      }
    ],
    "customer": {
      "id": "customer1",
      "name": "Cliente Teste"
    }
  }
}
```

##### Resposta de Certificação
```json
{
  "status": "success",
  "score": 85,
  "certification_level": "SILVER",
  "checks": [
    {
      "name": "Validação de Esquema",
      "status": "success",
      "message": "Payload é válido contra o esquema OpenDelivery",
      "score": 100,
      "weight": 40
    },
    {
      "name": "Segurança",
      "status": "warning",
      "message": "Alguns campos sensíveis não estão criptografados",
      "score": 70,
      "weight": 30,
      "details": {
        "sensitive_fields": ["customer.phone", "customer.email"]
      }
    },
    {
      "name": "Práticas Recomendadas",
      "status": "success",
      "message": "Segue as práticas recomendadas do OpenDelivery",
      "score": 90,
      "weight": 20
    },
    {
      "name": "Completude",
      "status": "success",
      "message": "Inclui todos os campos recomendados",
      "score": 85,
      "weight": 10
    }
  ],
  "recommendations": [
    "Considere criptografar campos sensíveis do cliente",
    "Adicione informações de rastreamento para melhor experiência",
    "Implemente validação de integridade para pagamentos"
  ],
  "details": {
    "schema_version": "1.6.0-rc",
    "certified_at": "2024-01-01T12:00:00Z",
    "certificate_id": "CERT-123456789",
    "valid_until": "2024-12-31T23:59:59Z"
  }
}
```

### Verificação de Saúde

#### GET /health
Retorna o status de saúde do serviço.

##### Resposta
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00Z",
  "version": "1.0.0",
  "uptime": "2d 14h 30m 15s",
  "schemas_loaded": 12,
  "supported_versions": [
    "1.0.0", "1.0.1", "1.1.0", "1.1.1", "1.2.0", "1.2.1", 
    "1.3.0", "1.4.0", "1.5.0", "1.6.0-rc", "beta"
  ]
}
```

## Códigos de Status HTTP

### Códigos de Sucesso
- **200**: Sucesso - Requisição processada com sucesso
- **204**: Sem Conteúdo - Requisição processada, sem conteúdo para retornar

### Códigos de Erro do Cliente
- **400**: Requisição Inválida - Formato de entrada inválido
- **404**: Não Encontrado - Versão do esquema não encontrada
- **422**: Entidade Não Processável - Payload válido mas com erros de validação
- **429**: Muitas Requisições - Limite de taxa excedido

### Códigos de Erro do Servidor
- **500**: Erro Interno do Servidor - Erro no serviço de validação
- **502**: Gateway Inválido - Problema de comunicação interna
- **503**: Serviço Indisponível - Serviço temporariamente indisponível

## Formato Padrão de Resposta de Erro

```json
{
  "status": "error",
  "message": "Descrição do erro",
  "code": "ERROR_CODE",
  "details": {
    "timestamp": "2024-01-01T12:00:00Z",
    "path": "/validate",
    "method": "POST"
  }
}
```

## Limitação de Taxa

### Limites Atuais
- **100 requisições por minuto por IP**
- **1000 requisições por hora por IP**
- **10000 requisições por dia por IP**

### Cabeçalhos de Limitação
As respostas incluem cabeçalhos informativos sobre limites:
- `X-RateLimit-Limit`: Limite total
- `X-RateLimit-Remaining`: Requisições restantes
- `X-RateLimit-Reset`: Timestamp de reset do limite
- `X-RateLimit-Window`: Janela de tempo em segundos

### Resposta de Limite Excedido
```json
{
  "status": "error",
  "message": "Limite de taxa excedido",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 100,
    "window": 60,
    "reset_at": "2024-01-01T12:01:00Z"
  }
}
```

## Versões Suportadas

### Esquemas OpenDelivery
- **1.0.0**: Versão inicial (abril/2022)
- **1.0.1**: Correções e melhorias (maio/2022)
- **1.1.0**: Novas funcionalidades (agosto/2022)
- **1.1.1**: Correções (setembro/2022)
- **1.2.0**: Expansão da API (dezembro/2022)
- **1.2.1**: Correções (janeiro/2023)
- **1.3.0**: Melhorias de segurança (abril/2023)
- **1.4.0**: Novos endpoints (agosto/2023)
- **1.5.0**: Otimizações (dezembro/2023)
- **1.6.0-rc**: Versão release candidate (março/2024)
- **beta**: Versão beta com funcionalidades experimentais

## Níveis de Certificação

### GOLD (90-100 pontos)
- Validação completa do esquema
- Segurança implementada corretamente
- Todas as práticas recomendadas seguidas
- Documentação completa e campos opcionais preenchidos

### SILVER (70-89 pontos)
- Validação do esquema com pequenos problemas
- Segurança básica implementada
- Maioria das práticas recomendadas seguidas
- Documentação adequada

### BRONZE (50-69 pontos)
- Validação básica do esquema
- Segurança mínima implementada
- Práticas básicas seguidas
- Documentação básica

### NOT_CERTIFIED (< 50 pontos)
- Falha na validação básica
- Problemas graves de segurança
- Práticas inadequadas
- Documentação insuficiente

## Exemplos de Uso

### Validação Básica com cURL
```bash
curl -X POST http://localhost:8000/validate \
  -H "Content-Type: application/json" \
  -d '{
    "schema_version": "1.6.0-rc",
    "payload": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "orderTiming": "INSTANT",
      "orderType": "DELIVERY",
      "items": [
        {
          "id": "item1",
          "name": "Produto Teste",
          "quantity": 1,
          "unitPrice": 15.90
        }
      ],
      "total": {
        "orderAmount": 15.90
      }
    }
  }'
```

### Verificação de Compatibilidade com JavaScript
```javascript
const checkCompatibility = async () => {
  const response = await fetch('http://localhost:8000/compatibility', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source_version: '1.5.0',
      target_version: '1.6.0-rc',
      payload: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        orderTiming: 'INSTANT',
        orderType: 'DELIVERY',
        items: [
          {
            id: 'item1',
            name: 'Produto Teste',
            quantity: 1,
            unitPrice: 15.90
          }
        ]
      }
    })
  });
  
  const result = await response.json();
  console.log('Compatibilidade:', result);
};
```

### Certificação com Python
```python
import requests
import json

def certify_payload(payload):
    url = 'http://localhost:8000/certify'
    headers = {'Content-Type': 'application/json'}
    data = {
        'schema_version': '1.6.0-rc',
        'payload': payload
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Exemplo de uso
payload = {
    'id': '123e4567-e89b-12d3-a456-426614174000',
    'orderTiming': 'INSTANT',
    'orderType': 'DELIVERY',
    'items': [
        {
            'id': 'item1',
            'name': 'Produto Teste',
            'quantity': 1,
            'unitPrice': 15.90
        }
    ],
    'total': {
        'orderAmount': 15.90
    }
}

result = certify_payload(payload)
print(f'Certificação: {result["certification_level"]} - Pontuação: {result["score"]}')
```

## Monitoramento e Logs

### Logs do Sistema
- **Logs de Acesso**: Registram todas as requisições
- **Logs de Erro**: Registram erros e exceções
- **Logs de Validação**: Registram detalhes das validações
- **Logs de Performance**: Registram métricas de performance

### Métricas Disponíveis
- Taxa de sucesso de validação
- Tempo médio de resposta
- Uso de versões de esquema
- Distribuição de níveis de certificação

## Suporte e Recursos

### Documentação Adicional
- **[Guia de Suporte](SUPPORT.md)**: Instruções detalhadas de uso
- **[README](../README.md)**: Visão geral do projeto

### Links Importantes
- **OpenDelivery Oficial**: [https://www.opendelivery.com.br/](https://www.opendelivery.com.br/)
- **Repositório**: [https://github.com/marcioreck/opendelivery-api-schema-validator2](https://github.com/marcioreck/opendelivery-api-schema-validator2)
- **Desenvolvedor**: [https://fazmercado.com](https://fazmercado.com)

## Versionamento da API

A API segue o padrão semântico de versionamento. A versão atual é v1 e é indicada no caminho da URL. Mudanças futuras seguirão as seguintes diretrizes:

- **Mudanças Compatíveis**: Não requerem nova versão principal
- **Mudanças Incompatíveis**: Requerem nova versão principal
- **Depreciações**: Serão anunciadas com antecedência mínima de 6 meses

---

*OpenDelivery API Schema Validator 2 - Documentação da API*  
*Desenvolvido por Márcio Reck*  
*Versão da API: v1.0.0* 