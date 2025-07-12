# OpenDelivery Enhanced Validator 2 - Guia de Suporte

Este documento fornece informações abrangentes sobre o uso e manutenção do Enhanced OpenDelivery API Schema Validator 2.

## Índice
1. [Recursos](#recursos)
2. [Primeiros Passos](#primeiros-passos)
3. [Instruções de Uso](#instruções-de-uso)
4. [Procedimentos de Manutenção](#procedimentos-de-manutenção)
5. [Solução de Problemas](#solução-de-problemas)
6. [Documentação da API](#documentação-da-api)
7. [Documentação de Testes](#documentação-de-testes)
8. [Considerações de Segurança](#considerações-de-segurança)
9. [Contribuindo](#contribuindo)
10. [Suporte Técnico](#suporte-técnico)

## Recursos

- Validação de esquemas multi-versão (1.0.0 → 1.6.0-rc)
- Relatórios de compatibilidade entre versões da API
- Sistema de certificação OpenDelivery Ready
- API de validação em tempo real
- Relatórios detalhados de erro
- Verificações de segurança

## Primeiros Passos

### Pré-requisitos

- Node.js 18.x ou superior
- npm 8.x ou superior

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd opendelivery-validator

# Instale as dependências
npm install

# Copie a configuração do ambiente
cp .env.example .env

# Inicie o servidor
npm run dev
```

## Instruções de Uso

### Usando a Interface Web

#### Validação de Esquemas
1. Navegue até a página do Validador
2. Selecione a versão do esquema no dropdown (1.0.0 → 1.6.0-rc)
3. Digite ou cole seu payload JSON no editor
4. Clique em "Validate" para verificar seu payload
5. Revise os resultados da validação no painel direito

#### Verificação de Compatibilidade
1. Navegue até a página de Compatibilidade
2. Selecione as versões de origem e destino
3. Digite seu payload JSON
4. Clique em "Check Compatibility"
5. Revise os resultados de compatibilidade e mudanças disruptivas

#### Certificação OpenDelivery Ready
1. Navegue até a página de Certificação
2. Selecione a versão do esquema
3. Digite seu payload JSON
4. Clique em "Certify"
5. Revise a pontuação de certificação e verificações detalhadas

#### Verificador de Autenticidade
1. Navegue até a aba "Verificador de Autenticidade"
2. Clique em "Executar Verificação de Autenticidade"
3. Aguarde a verificação em todas as versões do esquema
4. Revise os resultados para confirmar a autenticidade da API

#### Payloads de Teste
1. Clique no botão "Load Example" em qualquer página
2. Selecione a categoria desejada:
   - **Valid Payloads**: Exemplos válidos básicos e completos
   - **Invalid Payloads**: Exemplos com erros comuns
   - **Compatibility Payloads**: Para teste de migração entre versões
3. Escolha o payload específico para carregá-lo no editor

### Usando a API

#### Validar Payload

```http
POST /validate
Content-Type: application/json

{
  "payload": {
    // Seu payload OpenDelivery aqui
  },
  "version": "1.6.0-rc" // Opcional - se omitido, valida contra todas as versões
}
```

Resposta:
```json
{
  "isValid": true,
  "version": "1.6.0-rc"
}
```

Ou com erros:
```json
{
  "isValid": false,
  "version": "1.6.0-rc",
  "errors": [
    {
      "path": "/order/items/0",
      "message": "propriedade obrigatória 'quantity' ausente",
      "schemaPath": "#/required"
    }
  ]
}
```

## Procedimentos de Manutenção

### Atualizando Esquemas

O validador verifica automaticamente novas versões de esquema diariamente. Para atualizar manualmente:

1. Atualize os arquivos de esquema no diretório `schemas/`
2. Reinicie o serviço

### Adicionando Novas Versões de Esquema

1. Adicione o arquivo de esquema em `backend/schemas/`
2. Atualize a constante `SCHEMA_VERSIONS` em:
   - `frontend/src/pages/ValidatorPage.tsx`
   - `frontend/src/pages/CompatibilityPage.tsx`
   - `frontend/src/pages/CertificationPage.tsx`
3. Atualize a lógica de carregamento de esquemas no `SchemaManager`
4. Execute os testes para verificar a compatibilidade

### Adicionando Novas Versões da API

1. Adicione nova versão ao tipo `ApiVersion` em `src/types/index.ts`
2. Adicione arquivo de esquema no diretório `schemas/`
3. Reconstrua e reinicie o serviço

### Atualizando Regras de Validação

1. Modifique os arquivos de esquema em `backend/schemas/`
2. Atualize a lógica de validação no `ValidationService` se necessário
3. Atualize a lógica no `ValidationEngine` se necessário
4. Adicione testes para as novas regras de validação

### Atualizando Regras de Compatibilidade

1. Modifique `CompatibilityService.checkCompatibility()`
2. Atualize a lógica de detecção de mudanças disruptivas
3. Adicione testes para as novas regras de compatibilidade

### Atualizando Verificações de Certificação

1. Modifique `CertificationService.certify()`
2. Atualize a lógica de pontuação se necessário
3. Adicione testes para as novas verificações de certificação

### Atualizando Payloads de Teste

1. Modifique `frontend/src/components/TestPayloads.tsx`
2. Adicione novos payloads nas categorias apropriadas
3. Execute os testes para verificar a integridade dos payloads

### Monitoramento

- Verifique `error.log` e `combined.log` para problemas operacionais
- Monitore o endpoint `/health` para status do serviço
- Use as métricas fornecidas para acompanhamento de performance

## Solução de Problemas

### Problemas Comuns

#### 1. Falhas no Carregamento de Esquemas
- Verifique o formato do arquivo de esquema (deve ser YAML válido)
- Verifique as permissões do arquivo
- Verifique a compatibilidade da versão do esquema

#### 2. Erros de Validação
- Revise as mensagens de erro nos logs
- Verifique o formato do payload
- Verifique a sintaxe JSON
- Confirme a compatibilidade da versão do esquema
- Revise campos obrigatórios
- Verifique tipos de dados

#### 3. Problemas de Performance
- Monitore o uso de memória
- Verifique configurações de rate limiting
- Revise tamanhos de payload

#### 4. Problemas de Compatibilidade
- Certifique-se de que a versão de origem é anterior à versão de destino
- Verifique mudanças disruptivas
- Confirme depreciações de campos

#### 5. Problemas de Certificação
- Valide o payload primeiro
- Verifique requisitos de segurança
- Revise práticas recomendadas

#### 6. Problemas de Conectividade
- Verifique se o backend está rodando na porta 8000
- Confirme se o frontend está rodando na porta 3000
- Verifique configurações de CORS

### Mensagens de Erro

#### Erros do Backend
- **400**: Formato de requisição inválido
- **404**: Versão do esquema não encontrada
- **500**: Erro interno do servidor

#### Erros do Frontend
- Erros de parsing JSON
- Problemas de conectividade de rede
- Problemas de seleção de versão

## Documentação da API

### Endpoints

#### POST /validate
```json
{
  "schema_version": "1.6.0-rc",
  "payload": {
    // Seu payload JSON aqui
  }
}
```

#### POST /compatibility
```json
{
  "source_version": "1.5.0",
  "target_version": "1.6.0-rc",
  "payload": {
    // Seu payload JSON aqui
  }
}
```

#### POST /certify
```json
{
  "schema_version": "1.6.0-rc",
  "payload": {
    // Seu payload JSON aqui
  }
}
```

#### GET /health
Verifica a saúde do serviço.

### Formatos de Resposta

#### Resposta de Validação
```json
{
  "status": "success|error",
  "message": "Mensagem descritiva",
  "errors": [
    {
      "path": "/campo",
      "message": "Descrição do erro",
      "details": {}
    }
  ],
  "details": {
    "schema_version": "1.6.0-rc",
    "validated_at": "2024-01-01T12:00:00Z"
  }
}
```

#### Resposta de Compatibilidade
```json
{
  "status": "success|error",
  "compatible": true,
  "changes": [
    {
      "type": "added|removed|modified",
      "path": "/campo",
      "description": "Descrição da mudança"
    }
  ],
  "details": {
    "source_version": "1.5.0",
    "target_version": "1.6.0-rc",
    "checked_at": "2024-01-01T12:00:00Z"
  }
}
```

#### Resposta de Certificação
```json
{
  "status": "success|error",
  "score": 85,
  "certification_level": "GOLD|SILVER|BRONZE|NOT_CERTIFIED",
  "checks": [
    {
      "name": "Validação de Esquema",
      "status": "success|warning|error",
      "message": "Descrição do resultado",
      "score": 100
    }
  ],
  "details": {
    "schema_version": "1.6.0-rc",
    "certified_at": "2024-01-01T12:00:00Z"
  }
}
```

## Documentação de Testes

### Visão Geral
O OpenDelivery API Schema Validator 2 inclui uma suíte abrangente de testes que verifica a funcionalidade principal do sistema de validação. Os testes são escritos usando Jest (backend) e Vitest (frontend) e cobrem os principais componentes:

### Testes do Backend
1. **Validator Tests** (`validator.test.ts`)
2. **Validation Engine Tests** (`validationEngine.test.ts`)
3. **Compatibility Checker Tests** (`compatibilityChecker.test.ts`)

### Testes do Frontend
1. **TestPayloads Component Tests** (`TestPayloads.test.tsx`)
2. **CompatibilityChecker Tests** (`CompatibilityChecker.test.tsx`)

### Executando Testes

#### Backend
```bash
cd backend
npm test

# Com cobertura
npm test -- --coverage

# Arquivo específico
npm test -- validator.test.ts
```

#### Frontend
```bash
cd frontend
npm test

# Com cobertura
npm test -- --coverage

# Arquivo específico
npm test -- TestPayloads.test.tsx
```

### Cobertura de Testes

#### Testes do Backend
- **Validação de Esquema**: Validação contra esquemas OpenAPI
- **Validação de Segurança**: Detecção de dados sensíveis
- **Compatibilidade**: Verificação de mudanças disruptivas
- **Tratamento de Erros**: Gestão adequada de erros

#### Testes do Frontend
- **Renderização de Componentes**: Verificação de renderização correta
- **Interações do Usuário**: Eventos de clique e navegação
- **Validação de Dados**: Verificação de payloads válidos e inválidos
- **Integração**: Comunicação entre componentes

### Exemplos de Payloads de Teste

#### Payload Válido para OpenDelivery v1.5.0
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "type": "DELIVERY",
  "displayId": "ODV-2024001",
  "createdAt": "2024-01-15T14:30:00Z",
  "orderTiming": "INSTANT",
  "preparationStartDateTime": "2024-01-15T14:30:00Z",
  "merchant": {
    "id": "merchant-pizzaria-001",
    "name": "Pizzaria Bella Vista"
  },
  "items": [
    {
      "id": "item-pizza-margherita",
      "name": "Pizza Margherita",
      "quantity": 2,
      "unit": "UN",
      "unitPrice": {
        "value": 35.90,
        "currency": "BRL"
      },
      "totalPrice": {
        "value": 71.80,
        "currency": "BRL"
      },
      "externalCode": "PIZZA-MARG-35"
    }
  ],
  "total": {
    "itemsPrice": {
      "value": 71.80,
      "currency": "BRL"
    },
    "otherFees": {
      "value": 5.00,
      "currency": "BRL"
    },
    "discount": {
      "value": 0.00,
      "currency": "BRL"
    },
    "orderAmount": {
      "value": 76.80,
      "currency": "BRL"
    }
  },
  "payments": {
    "prepaid": 0.00,
    "pending": 76.80,
    "methods": [
      {
        "value": 76.80,
        "currency": "BRL",
        "type": "PENDING",
        "method": "CREDIT",
        "methodInfo": "Cartão de Crédito Visa"
      }
    ]
  }
}
```

> **✅ Testado e Validado**: Este payload foi testado e validado com sucesso contra o esquema OpenDelivery v1.5.0

#### Payload Inválido (Campos Ausentes)
```json
{
  "id": "123",
  "items": [
    {
      "name": "Produto Teste"
      // Campos obrigatórios ausentes
    }
  ]
  // Campos obrigatórios ausentes
}
```

## Considerações de Segurança

- Rate limiting habilitado por padrão
- Todos os endpoints usam HTTPS
- Validação e sanitização de entrada
- Atualizações regulares de segurança
- Configuração de CORS

## Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua funcionalidade
3. Envie um pull request

## Suporte Técnico

Para problemas e solicitações de funcionalidades:
1. Verifique problemas existentes
2. Crie um novo problema com:
   - Informações da versão
   - Passos para reproduzir
   - Comportamento esperado vs atual

Para suporte adicional:
1. Consulte a [documentação da API](API.md)
2. Verifique os logs do sistema
3. Entre em contato através do [portfólio do desenvolvedor](https://fazmercado.com)

## Referências

- **OpenDelivery API**: [https://www.opendelivery.com.br/](https://www.opendelivery.com.br/)
- **Documentação Oficial**: Consulte o site oficial para especificações completas
- **GitHub**: [https://github.com/marcioreck/opendelivery-api-schema-validator2](https://github.com/marcioreck/opendelivery-api-schema-validator2)

## Licença

[Tipo de Licença] - veja o arquivo LICENSE para detalhes

---

*OpenDelivery Enhanced Validator 2 - Guia de Suporte*  
*Desenvolvido por Márcio Reck*