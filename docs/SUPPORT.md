# OpenDelivery API Schema Validator 2 - Guia de Suporte

## Índice
1. [Instruções de Uso](#instruções-de-uso)
2. [Procedimentos de Manutenção](#procedimentos-de-manutenção)
3. [Solução de Problemas](#solução-de-problemas)
4. [Documentação da API](#documentação-da-api)
5. [Documentação de Testes](#documentação-de-testes)

## Instruções de Uso

### Validação de Esquemas
1. Navegue até a página do Validador
2. Selecione a versão do esquema no dropdown (1.0.0 → 1.6.0-rc)
3. Digite ou cole seu payload JSON no editor
4. Clique em "Validate" para verificar seu payload
5. Revise os resultados da validação no painel direito

### Verificação de Compatibilidade
1. Navegue até a página de Compatibilidade
2. Selecione as versões de origem e destino
3. Digite seu payload JSON
4. Clique em "Check Compatibility"
5. Revise os resultados de compatibilidade e mudanças disruptivas

### Certificação OpenDelivery Ready
1. Navegue até a página de Certificação
2. Selecione a versão do esquema
3. Digite seu payload JSON
4. Clique em "Certify"
5. Revise a pontuação de certificação e verificações detalhadas

### Verificador de Autenticidade
1. Navegue até a aba "Verificador de Autenticidade"
2. Clique em "Executar Verificação de Autenticidade"
3. Aguarde a verificação em todas as versões do esquema
4. Revise os resultados para confirmar a autenticidade da API

### Payloads de Teste
1. Clique no botão "Load Example" em qualquer página
2. Selecione a categoria desejada:
   - **Valid Payloads**: Exemplos válidos básicos e completos
   - **Invalid Payloads**: Exemplos com erros comuns
   - **Compatibility Payloads**: Para teste de migração entre versões
3. Escolha o payload específico para carregá-lo no editor

## Procedimentos de Manutenção

### Adicionando Novas Versões de Esquema
1. Adicione o arquivo de esquema em `backend/schemas/`
2. Atualize a constante `SCHEMA_VERSIONS` em:
   - `frontend/src/pages/ValidatorPage.tsx`
   - `frontend/src/pages/CompatibilityPage.tsx`
   - `frontend/src/pages/CertificationPage.tsx`
3. Atualize a lógica de carregamento de esquemas no `SchemaManager`
4. Execute os testes para verificar a compatibilidade

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

## Solução de Problemas

### Problemas Comuns

#### Erros de Validação
- Verifique a sintaxe JSON
- Confirme a compatibilidade da versão do esquema
- Revise campos obrigatórios
- Verifique tipos de dados

#### Problemas de Compatibilidade
- Certifique-se de que a versão de origem é anterior à versão de destino
- Verifique mudanças disruptivas
- Confirme depreciações de campos

#### Problemas de Certificação
- Valide o payload primeiro
- Verifique requisitos de segurança
- Revise práticas recomendadas

#### Problemas de Conectividade
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

#### Payload Válido Básico
```json
{
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
```

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

### Níveis de Certificação

#### GOLD (90-100 pontos)
- Validação completa do esquema
- Segurança implementada
- Práticas recomendadas seguidas
- Documentação completa

#### SILVER (70-89 pontos)
- Validação do esquema com pequenos problemas
- Segurança básica implementada
- Algumas práticas recomendadas seguidas

#### BRONZE (50-69 pontos)
- Validação básica do esquema
- Segurança mínima implementada
- Práticas básicas seguidas

#### NOT_CERTIFIED (< 50 pontos)
- Falha na validação básica
- Problemas de segurança
- Práticas inadequadas

## Versões Suportadas

### Esquemas OpenDelivery
- **1.0.0**: Versão inicial
- **1.0.1**: Correções e melhorias
- **1.1.0**: Novas funcionalidades
- **1.1.1**: Correções
- **1.2.0**: Expansão da API
- **1.2.1**: Correções
- **1.3.0**: Melhorias de segurança
- **1.4.0**: Novos endpoints
- **1.5.0**: Otimizações
- **1.6.0-rc**: Versão release candidate
- **beta**: Versão beta com funcionalidades experimentais

## Suporte Técnico

Para suporte adicional:
1. Consulte a [documentação da API](API.md)
2. Revise os [testes do frontend](../FRONTEND-TESTS.md)
3. Verifique os logs do sistema
4. Entre em contato através do [portfólio do desenvolvedor](https://fazmercado.com)

## Referências

- **OpenDelivery API**: [https://www.opendelivery.com.br/](https://www.opendelivery.com.br/)
- **Documentação Oficial**: Consulte o site oficial para especificações completas
- **GitHub**: [https://github.com/marcioreck/opendelivery-api-schema-validator2](https://github.com/marcioreck/opendelivery-api-schema-validator2)

---

*OpenDelivery API Schema Validator 2 - Guia de Suporte*  
*Desenvolvido por Márcio Reck* 