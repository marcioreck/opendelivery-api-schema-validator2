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

### Payloads Válidos Testados

#### 1. Basic Valid Order
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "orderTiming": "IMMEDIATE",
  "orderType": "DELIVERY",
  "displayId": "123456",
  "createdAt": "2024-01-20T10:30:00Z",
  "items": [
    {
      "id": "item1",
      "name": "Hamburger",
      "quantity": 1,
      "unit": "UN",
      "unitPrice": 15.90,
      "totalPrice": 15.90,
      "externalCode": "HAM001",
      "observations": "No onions"
    }
  ],
  "total": {
    "subTotal": 15.90,
    "deliveryFee": 5.00,
    "orderAmount": 20.90
  },
  "payments": [
    {
      "type": "CREDIT",
      "value": 20.90,
      "prepaid": false
    }
  ],
  "customer": {
    "id": "cust123",
    "name": "John Doe",
    "documentNumber": "12345678900",
    "phone": "+5511999999999",
    "email": "john@example.com"
  },
  "delivery": {
    "deliveryAddress": {
      "streetName": "Main Street",
      "streetNumber": "123",
      "neighborhood": "Downtown",
      "city": "São Paulo",
      "state": "SP",
      "country": "BR",
      "postalCode": "01234567",
      "reference": "Near the park"
    },
    "deliveryDateTime": "2024-01-20T11:00:00Z"
  }
}
```

#### 2. Complete Valid Order
- Inclui todos os campos do Basic Valid Order
- Adiciona campos opcionais como:
  - `scheduling.preparationMode`
  - `total.benefits`
  - `delivery.pickupCode`
  - `items[].options`

### Payloads Inválidos Testados

#### 1. Missing Required Fields
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "items": [
    {
      "observations": "Invalid item"
    }
  ],
  "createdAt": "2024-01-20T10:40:00Z"
}
```

**Campos ausentes**: `orderTiming`, `orderType`, `customer`, `total`, `payments`

#### 2. Invalid Data Types
```json
{
  "id": 123,                    // Deveria ser string UUID
  "orderTiming": "INVALID_TIMING", // Valor de enum inválido
  "orderType": "INVALID_TYPE",     // Valor de enum inválido
  "createdAt": "invalid-date",     // Formato de data inválido
  "items": [
    {
      "id": "item1",
      "name": 123,              // Deveria ser string
      "quantity": "1",          // Deveria ser number
      "unitPrice": "10.90",     // Deveria ser number
      "unit": 123               // Deveria ser string
    }
  ]
}
```

#### 3. Invalid Values
```json
{
  "items": [
    {
      "quantity": 0,            // Mínimo é 1
      "unitPrice": -10.00,      // Mínimo é 0
      "totalPrice": -10.00      // Mínimo é 0
    }
  ],
  "total": {
    "subTotal": -10.00,         // Mínimo é 0
    "orderAmount": -10.00       // Mínimo é 0
  }
}
```

## Validações Realizadas pelos Testes

### 1. Validações de Estrutura
- ✅ Presença de campos obrigatórios
- ✅ Ausência de campos obrigatórios (para payloads inválidos)
- ✅ Presença de campos opcionais em payloads completos

### 2. Validações de Tipos de Dados
- ✅ `string` para IDs, nomes, códigos
- ✅ `number` para quantidades, preços, valores
- ✅ `boolean` para flags como `prepaid`
- ✅ `object` para estruturas complexas

### 3. Validações de Valores
- ✅ Valores positivos para preços e quantidades
- ✅ Valores de enum válidos:
  - `orderTiming`: "IMMEDIATE", "SCHEDULED"
  - `orderType`: "DELIVERY", "TAKEOUT"
  - `payments[].type`: "CREDIT", "DEBIT", "CASH", "PIX"

### 4. Validações de Interação
- ✅ Renderização do componente
- ✅ Abertura do menu ao clicar
- ✅ Navegação entre categorias
- ✅ Seleção de payloads
- ✅ Callback de seleção

## Interpretando os Resultados

### Teste Passou ✅
```
✓ valid payloads have correct data types
```

### Teste Falhou ❌
```
✗ valid payloads have correct data types
  Expected: "string"
  Received: "number"
```

### Detalhes do Erro
```
TestingLibraryElementError: Unable to find an element with the text: Load Example
```

## Adicionando Novos Testes

### 1. Teste de Componente Simples
```typescript
it('should render component correctly', () => {
  render(<MyComponent />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### 2. Teste de Interação
```typescript
it('should handle click events', () => {
  const mockCallback = vi.fn();
  render(<MyComponent onClick={mockCallback} />);
  
  fireEvent.click(screen.getByRole('button'));
  expect(mockCallback).toHaveBeenCalled();
});
```

### 3. Teste de Payload
```typescript
it('should validate new payload structure', () => {
  const newPayload = TEST_PAYLOADS.valid.newType.payload;
  expect(newPayload).toHaveProperty('newField');
  expect(typeof newPayload.newField).toBe('string');
});
```

## Debugging de Testes

### 1. Usar console.log
```typescript
it('debug test', () => {
  render(<TestPayloads onSelectPayload={mockCallback} />);
  screen.debug(); // Mostra o HTML renderizado
});
```

### 2. Usar queries para explorar
```typescript
it('explore elements', () => {
  render(<TestPayloads onSelectPayload={mockCallback} />);
  
  // Listar todos os elementos com role
  const elements = screen.getAllByRole('button');
  console.log('Buttons found:', elements.length);
  
  // Verificar texto específico
  expect(screen.queryByText('Load Example')).toBeInTheDocument();
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
- Use nomes descritivos para os testes
- Agrupe testes relacionados com `describe`
- Use `it` para casos de teste individuais

### 2. Isolamento
- Cada teste deve ser independente
- Use `beforeEach` para configuração
- Use `afterEach` para limpeza

### 3. Assertivas
- Faça uma assertiva por teste quando possível
- Use matchers específicos (`toBeInTheDocument`, `toHaveProperty`)
- Teste comportamentos, não implementação

### 4. Mocks
- Use mocks para dependências externas
- Limpe mocks entre testes
- Verifique se mocks foram chamados corretamente

## Troubleshooting

### Problema: Teste não encontra elemento
```
Unable to find an element with the text: "Expected Text"
```

**Solução**: Verificar se o texto está sendo renderizado corretamente
```typescript
screen.debug(); // Ver HTML renderizado
screen.getByText('Expected Text', { exact: false }); // Busca parcial
```

### Problema: Múltiplos elementos encontrados
```
Found multiple elements with the text: "Button"
```

**Solução**: Usar seletores mais específicos
```typescript
screen.getByRole('button', { name: 'Specific Button' });
```

### Problema: Elemento não está visível
```
Element is not visible
```

**Solução**: Verificar CSS ou usar queries que não verificam visibilidade
```typescript
screen.getByText('Text', { hidden: true });
```

---

*Este guia deve ser atualizado conforme novos testes são adicionados ao projeto.* 