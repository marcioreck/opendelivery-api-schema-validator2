# Guia Prático de Testes - Frontend

## Como Executar os Testes

### 1. Executar Todos os Testes
```bash
cd frontend
npm test
```

### 2. Executar Testes Uma Única Vez (sem watch mode)
```bash
npm test -- --run
```

### 3. Executar Testes com Cobertura
```bash
npm test -- --coverage
```

### 4. Executar Testes Específicos
```bash
# Por nome do arquivo
npm test -- TestPayloads

# Por padrão de nome
npm test -- --grep "Valid Payloads"
```

### 5. Executar Testes em Modo Debug
```bash
npm test -- --reporter=verbose
```

## Estrutura dos Testes de Payloads

### Organização por Compatibilidade de Versão

Os payloads de teste estão organizados por compatibilidade com versões do OpenDelivery:

- **v1_0_compatible**: Para versões 1.0.0, 1.0.1, 1.1.0, 1.1.1 (customer obrigatório, total.items)
- **v1_2_plus**: Para versões 1.2.0+ (customer opcional, total.itemsPrice)
- **invalid**: Payloads inválidos para teste de erro
- **compatibility**: Payloads para teste de migração entre versões

### Payloads Válidos Testados

#### 1. Basic Valid Order (v1.2.0+)
```json
{
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
}
```

#### 2. Complete Valid Order (v1.2.0+)
- Inclui todos os campos do Basic Valid Order
- Adiciona campos opcionais como:
  - `customer` (opcional em v1.2.0+)
  - Múltiplos itens
  - Informações completas do cliente

#### 3. Basic Valid Order (v1.0.0 Compatible)
- Similar ao Basic, mas com estrutura para versões antigas:
  - `customer` obrigatório
  - `total.items` em vez de `total.itemsPrice`
  - `unit`: "UNIT" em vez de "UN"

### Payloads Inválidos Testados

#### 1. Missing Required Fields
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "items": [
    {
      "observations": "Item sem campos obrigatórios"
    }
  ],
  "createdAt": "2024-01-20T10:40:00Z"
}
```

**Campos ausentes**: `type`, `orderTiming`, `preparationStartDateTime`, `merchant`, `total`, `payments`

#### 2. Invalid Data Types
```json
{
  "id": 123,                    // Deveria ser string UUID
  "type": "INVALID_TYPE",       // Valor de enum inválido
  "orderTiming": "INVALID_TIMING", // Valor de enum inválido
  "createdAt": "invalid-date",     // Formato de data inválido
  "merchant": {
    "name": 123                 // Deveria ser string
  },
  "items": [
    {
      "name": 123,              // Deveria ser string
      "quantity": "1",          // Deveria ser number
      "unitPrice": "10.90",     // Deveria ser object
      "unit": 123               // Deveria ser string
    }
  ],
  "total": {
    "itemsPrice": "15.90"       // Deveria ser object
  },
  "payments": {
    "methods": "invalid"        // Deveria ser array
  }
}
```

#### 3. Invalid Enum Values
```json
{
  "type": "INVALID_SERVICE_TYPE",  // Valor inválido
  "orderTiming": "INVALID_TIMING", // Valor inválido
  "items": [
    {
      "unit": "INVALID_UNIT",      // Valor inválido
      "unitPrice": {
        "currency": "INVALID_CURRENCY" // Valor inválido
      }
    }
  ]
}
```

## Validações Realizadas pelos Testes

### 1. Validações de Estrutura
- ✅ Presença de campos obrigatórios (`type`, `orderTiming`, `preparationStartDateTime`, `merchant`, `items`, `total`, `payments`)
- ✅ Ausência de campos obrigatórios (para payloads inválidos)
- ✅ Presença de campos opcionais (`customer` em v1.2.0+)

### 2. Validações de Tipos de Dados
- ✅ `string` para IDs, nomes, códigos
- ✅ `number` para quantidades, preços (quando não em objeto)
- ✅ `object` para estruturas de preço (`unitPrice`, `totalPrice`)
- ✅ `array` para listas (`items`, `payments.methods`)

### 3. Validações de Valores
- ✅ Valores positivos para preços e quantidades
- ✅ Valores de enum válidos:
  - `orderTiming`: "INSTANT"
  - `type`: "DELIVERY", "TAKEOUT"
  - `payments.methods[].type`: "PREPAID", "PENDING"
  - `payments.methods[].method`: "CREDIT", "DEBIT", "CASH", "PIX"
  - `unit`: "UN", "UNIT", "KG", etc.
  - `currency`: "BRL", "USD", etc.

### 4. Validações de Interação
- ✅ Renderização do componente TestPayloads
- ✅ Abertura do menu ao clicar em "Load Example"
- ✅ Navegação entre categorias (Valid, Invalid, Compatibility)
- ✅ Seleção de payloads específicos
- ✅ Callback `onSelectPayload` é chamado corretamente

## Estrutura Atual dos Testes

### Arquivo: TestPayloads.test.tsx

```typescript
describe('TestPayloads Component', () => {
  // Testes de renderização
  it('renders test payload button', () => { ... });

  describe('Valid Payloads', () => {
    // Verifica campos obrigatórios
    it('basic valid order has all required fields', () => { ... });
    
    // Verifica campos opcionais
    it('complete valid order has all optional fields', () => { ... });
    
    // Verifica tipos de dados
    it('valid payloads have correct data types', () => { ... });
    
    // Verifica valores positivos
    it('valid payloads have positive values', () => { ... });
    
    // Verifica enums válidos
    it('valid payloads have proper enum values', () => { ... });
  });

  describe('Invalid Payloads', () => {
    // Verifica campos ausentes
    it('missing required fields payload is incomplete', () => { ... });
    
    // Verifica tipos incorretos
    it('invalid types payload has wrong data types', () => { ... });
    
    // Verifica valores inválidos
    it('invalid values payload has out-of-range values', () => { ... });
    
    // Verifica enums inválidos
    it('invalid types payload has invalid enum values', () => { ... });
  });

  describe('Compatibility Tests', () => {
    // Verifica payloads de migração
    it('compatibility payload exists for version migration', () => { ... });
  });

  describe('User Interaction', () => {
    // Testa interações do usuário
    it('opens menu when button is clicked', () => { ... });
    it('navigates to payload selection after category selection', () => { ... });
    it('calls onSelectPayload when a payload is selected', () => { ... });
  });
});
```

## Interpretando os Resultados

### Teste Passou ✅
```
✓ basic valid order has all required fields
✓ valid payloads have correct data types
✓ opens menu when button is clicked
```

### Teste Falhou ❌
```
✗ valid payloads have correct data types
  Expected: "object"
  Received: "string"
  
  at TestPayloads.test.tsx:35:12
```

### Execução Completa
```
✓ Test Files  1 passed (1)
✓ Tests  14 passed (14)
⏱️ Duration  3.21s (transform 185ms, setup 0ms, collect 89ms, tests 267ms)
```

## Adicionando Novos Testes

### 1. Teste de Payload Simples
```typescript
it('should validate new payload structure', () => {
  const newPayload = TEST_PAYLOADS.valid.newType.payload;
  expect(newPayload).toHaveProperty('newField');
  expect(typeof newPayload.newField).toBe('string');
});
```

### 2. Teste de Interação
```typescript
it('should handle new interaction', () => {
  const mockCallback = vi.fn();
  render(<TestPayloads onSelectPayload={mockCallback} />);
  
  fireEvent.click(screen.getByText('Load Example'));
  expect(screen.getByText('New Category')).toBeInTheDocument();
});
```

### 3. Teste de Enum
```typescript
it('should validate new enum values', () => {
  const payload = TEST_PAYLOADS.valid.basic.payload;
  expect(['INSTANT', 'SCHEDULED']).toContain(payload.orderTiming);
  expect(['DELIVERY', 'TAKEOUT']).toContain(payload.type);
});
```

## Debugging de Testes

### 1. Usar screen.debug()
```typescript
it('debug test', () => {
  render(<TestPayloads onSelectPayload={mockCallback} />);
  screen.debug(); // Mostra o HTML renderizado no console
});
```

### 2. Usar queries específicas
```typescript
it('explore elements', () => {
  render(<TestPayloads onSelectPayload={mockCallback} />);
  
  // Verificar se elemento existe
  expect(screen.queryByText('Load Example')).toBeInTheDocument();
  
  // Listar todos os botões
  const buttons = screen.getAllByRole('button');
  console.log('Buttons found:', buttons.length);
});
```

### 3. Usar waitFor para elementos assíncronos
```typescript
it('wait for async elements', async () => {
  render(<AsyncComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded Content')).toBeInTheDocument();
  });
});
```

## Boas Práticas

### 1. Nomenclatura
- Use nomes descritivos: `'basic valid order has all required fields'`
- Agrupe testes relacionados com `describe`
- Use `it` para casos individuais

### 2. Isolamento
- Cada teste deve ser independente
- Use `beforeEach` para limpar mocks
- Não dependa da ordem de execução

### 3. Assertivas
- Faça assertivas específicas e claras
- Use matchers apropriados (`toHaveProperty`, `toBeInTheDocument`)
- Teste comportamentos, não implementação

### 4. Mocks
- Limpe mocks com `mockClear()` em `beforeEach`
- Verifique se callbacks foram chamados com dados corretos
- Use `vi.fn()` para funções mock

## Troubleshooting

### Problema: Teste não encontra elemento
```
Unable to find an element with the text: "Load Example"
```

**Solução**: Verificar se o texto está sendo renderizado
```typescript
screen.debug(); // Ver HTML atual
expect(screen.getByText('Load Example')).toBeInTheDocument();
```

### Problema: Enum inválido nos testes
```
Expected array containing "IMMEDIATE" but received "INSTANT"
```

**Solução**: Verificar valores de enum atuais no código
```typescript
// Verificar no código atual quais enums são válidos
expect(['INSTANT']).toContain(payload.orderTiming); // ✅ Correto
expect(['IMMEDIATE']).toContain(payload.orderTiming); // ❌ Incorreto
```

### Problema: Estrutura de payload incorreta
```
Expected object to have property "orderType" but received "type"
```

**Solução**: Verificar estrutura atual dos payloads
```typescript
// Código atual usa "type", não "orderType"
expect(payload).toHaveProperty('type'); // ✅ Correto
expect(payload).toHaveProperty('orderType'); // ❌ Incorreto
```

### Problema: Múltiplos elementos encontrados
```
Found multiple elements with the text: "Valid Payloads"
```

**Solução**: Usar seletores mais específicos
```typescript
screen.getByRole('menuitem', { name: /^Valid Payloads$/i });
```

## Comandos Úteis

### Executar testes específicos
```bash
# Apenas testes de payloads válidos
npm test -- --grep "Valid Payloads"

# Apenas testes de interação
npm test -- --grep "User Interaction"

# Apenas um arquivo específico
npm test -- TestPayloads.test.tsx
```

### Modo watch detalhado
```bash
# Watch com relatório verboso
npm test -- --reporter=verbose

# Watch com cobertura
npm test -- --coverage --watch
```

---

*Este guia reflete o estado atual do código (Janeiro 2024) e deve ser atualizado conforme o projeto evolui.* 