# Documentação dos Testes de Frontend

## Visão Geral

Este documento descreve os testes de frontend implementados para o validador de esquemas da OpenDelivery API. Os testes foram desenvolvidos usando **Vitest** e **React Testing Library** para garantir a qualidade e funcionalidade dos componentes React.

## Configuração dos Testes

### Dependências
- `vitest`: Framework de testes rápido e moderno
- `@testing-library/react`: Utilitários para testar componentes React
- `@testing-library/jest-dom`: Matchers customizados para DOM
- `@testing-library/user-event`: Simulação de eventos do usuário
- `jsdom`: Ambiente DOM para testes

### Arquivos de Configuração

#### `vitest.config.ts`
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
```

#### `src/test/setup.ts`
```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

## Suíte de Testes: TestPayloads Component

### Localização
- **Arquivo**: `src/components/TestPayloads.test.tsx`
- **Componente testado**: `TestPayloads.tsx`

### Estrutura dos Testes

#### 1. Testes de Renderização
```typescript
it('renders test payload button', () => {
  render(<TestPayloads onSelectPayload={mockOnSelectPayload} />);
  expect(screen.getByText('Load Example')).toBeInTheDocument();
});
```

**Objetivo**: Verificar se o componente renderiza corretamente o botão principal.

#### 2. Testes de Payloads Válidos (5 testes)

##### 2.1 Campos Obrigatórios
```typescript
it('basic valid order has all required fields', () => {
  const basicPayload = TEST_PAYLOADS.valid.basic.payload;
  expect(basicPayload).toHaveProperty('orderTiming');
  expect(basicPayload).toHaveProperty('orderType');
  expect(basicPayload).toHaveProperty('items');
  expect(basicPayload).toHaveProperty('total');
  expect(basicPayload).toHaveProperty('payments');
  expect(basicPayload).toHaveProperty('customer');
});
```

**Objetivo**: Verificar se o payload básico válido contém todos os campos obrigatórios da API OpenDelivery.

##### 2.2 Campos Opcionais
```typescript
it('complete valid order has all optional fields', () => {
  const completePayload = TEST_PAYLOADS.valid.complete.payload;
  expect(completePayload).toHaveProperty('scheduling');
  expect(completePayload.total).toHaveProperty('benefits');
  expect(completePayload.delivery).toHaveProperty('pickupCode');
});
```

**Objetivo**: Verificar se o payload completo válido contém campos opcionais adicionais.

##### 2.3 Tipos de Dados
```typescript
it('valid payloads have correct data types', () => {
  const basicPayload = TEST_PAYLOADS.valid.basic.payload;
  expect(typeof basicPayload.id).toBe('string');
  expect(typeof basicPayload.items[0].quantity).toBe('number');
  expect(typeof basicPayload.items[0].unitPrice).toBe('number');
  expect(typeof basicPayload.total.orderAmount).toBe('number');
});
```

**Objetivo**: Verificar se os tipos de dados estão corretos nos payloads válidos.

##### 2.4 Valores Positivos
```typescript
it('valid payloads have positive values', () => {
  const basicPayload = TEST_PAYLOADS.valid.basic.payload;
  expect(basicPayload.items[0].quantity).toBeGreaterThan(0);
  expect(basicPayload.items[0].unitPrice).toBeGreaterThanOrEqual(0);
  expect(basicPayload.total.orderAmount).toBeGreaterThan(0);
});
```

**Objetivo**: Verificar se valores numéricos estão dentro dos intervalos válidos.

##### 2.5 Valores de Enum
```typescript
it('valid payloads have proper enum values', () => {
  const basicPayload = TEST_PAYLOADS.valid.basic.payload;
  expect(['IMMEDIATE', 'SCHEDULED']).toContain(basicPayload.orderTiming);
  expect(['DELIVERY', 'TAKEOUT']).toContain(basicPayload.orderType);
  expect(['CREDIT', 'DEBIT', 'CASH', 'PIX']).toContain(basicPayload.payments[0].type);
});
```

**Objetivo**: Verificar se os valores de enum estão corretos conforme especificação da API.

#### 3. Testes de Payloads Inválidos (4 testes)

##### 3.1 Campos Obrigatórios Ausentes
```typescript
it('missing required fields payload is incomplete', () => {
  const missingFieldsPayload = TEST_PAYLOADS.invalid.missingRequired.payload;
  expect(missingFieldsPayload).not.toHaveProperty('orderTiming');
  expect(missingFieldsPayload).not.toHaveProperty('orderType');
  expect(missingFieldsPayload).not.toHaveProperty('total');
  expect(missingFieldsPayload).not.toHaveProperty('payments');
  expect(missingFieldsPayload).not.toHaveProperty('customer');
});
```

**Objetivo**: Verificar se o payload de teste realmente não possui campos obrigatórios.

##### 3.2 Tipos de Dados Incorretos
```typescript
it('invalid types payload has wrong data types', () => {
  const invalidTypesPayload = TEST_PAYLOADS.invalid.invalidTypes.payload;
  expect(typeof invalidTypesPayload.id).toBe('number'); // Should be string
  expect(typeof invalidTypesPayload.items[0].name).toBe('number'); // Should be string
  expect(typeof invalidTypesPayload.total.subTotal).toBe('string'); // Should be number
  expect(typeof invalidTypesPayload.payments[0].value).toBe('string'); // Should be number
});
```

**Objetivo**: Verificar se o payload de teste possui tipos de dados incorretos.

##### 3.3 Valores Fora do Intervalo
```typescript
it('invalid values payload has out-of-range values', () => {
  const invalidValuesPayload = TEST_PAYLOADS.invalid.invalidValues.payload;
  expect(invalidValuesPayload.items[0].quantity).toBe(0); // Should be >= 1
  expect(invalidValuesPayload.items[0].unitPrice).toBeLessThan(0); // Should be >= 0
  expect(invalidValuesPayload.total.orderAmount).toBeLessThan(0); // Should be >= 0
});
```

**Objetivo**: Verificar se o payload de teste possui valores fora dos intervalos válidos.

##### 3.4 Valores de Enum Inválidos
```typescript
it('invalid types payload has invalid enum values', () => {
  const invalidTypesPayload = TEST_PAYLOADS.invalid.invalidTypes.payload;
  expect(['IMMEDIATE', 'SCHEDULED']).not.toContain(invalidTypesPayload.orderTiming);
  expect(['DELIVERY', 'TAKEOUT']).not.toContain(invalidTypesPayload.orderType);
  expect(['CREDIT', 'DEBIT', 'CASH', 'PIX']).not.toContain(invalidTypesPayload.payments[0].type);
});
```

**Objetivo**: Verificar se o payload de teste possui valores de enum inválidos.

#### 4. Testes de Compatibilidade (1 teste)

```typescript
it('compatibility payload exists for version migration', () => {
  const compatibilityPayload = TEST_PAYLOADS.compatibility.v1_0_to_1_1.payload;
  expect(compatibilityPayload).toHaveProperty('id');
  expect(compatibilityPayload).toHaveProperty('orderTiming');
  expect(compatibilityPayload).toHaveProperty('orderType');
  expect(compatibilityPayload.items[0]).toHaveProperty('observations'); // Old field name
});
```

**Objetivo**: Verificar se os payloads de compatibilidade existem para testar migrações entre versões.

#### 5. Testes de Interação do Usuário (3 testes)

##### 5.1 Abertura do Menu
```typescript
it('opens menu when button is clicked', async () => {
  render(<TestPayloads onSelectPayload={mockOnSelectPayload} />);
  
  const button = screen.getByText('Load Example');
  fireEvent.click(button);

  const menuItems = screen.getAllByRole('menuitem');
  expect(menuItems).toHaveLength(3);
  
  expect(screen.getByRole('menuitem', { name: /^valid Payloads$/i })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: /^invalid Payloads$/i })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: /^compatibility Payloads$/i })).toBeInTheDocument();
});
```

**Objetivo**: Verificar se o menu abre corretamente e exibe todas as categorias de payload.

##### 5.2 Navegação entre Categorias
```typescript
it('navigates to payload selection after category selection', async () => {
  render(<TestPayloads onSelectPayload={mockOnSelectPayload} />);
  
  const button = screen.getByText('Load Example');
  fireEvent.click(button);

  const validCategory = screen.getByRole('menuitem', { name: /^valid Payloads$/i });
  fireEvent.click(validCategory);

  expect(screen.getByText('Basic Valid Order')).toBeInTheDocument();
  expect(screen.getByText('Complete Valid Order')).toBeInTheDocument();
  expect(screen.getByText('← Back')).toBeInTheDocument();
});
```

**Objetivo**: Verificar se a navegação entre categorias funciona corretamente.

##### 5.3 Seleção de Payload
```typescript
it('calls onSelectPayload when a payload is selected', async () => {
  render(<TestPayloads onSelectPayload={mockOnSelectPayload} />);
  
  const button = screen.getByText('Load Example');
  fireEvent.click(button);

  const validCategory = screen.getByRole('menuitem', { name: /^valid Payloads$/i });
  fireEvent.click(validCategory);

  const basicPayload = screen.getByText('Basic Valid Order');
  fireEvent.click(basicPayload);

  expect(mockOnSelectPayload).toHaveBeenCalledWith(TEST_PAYLOADS.valid.basic.payload);
});
```

**Objetivo**: Verificar se a função callback é chamada corretamente quando um payload é selecionado.

## Tipos de Payloads Testados

### 1. Payloads Válidos
- **Basic Valid Order**: Pedido básico com todos os campos obrigatórios
- **Complete Valid Order**: Pedido completo com campos opcionais

### 2. Payloads Inválidos
- **Missing Required Fields**: Payload sem campos obrigatórios
- **Invalid Data Types**: Payload com tipos de dados incorretos
- **Invalid Values**: Payload com valores fora do intervalo válido

### 3. Payloads de Compatibilidade
- **v1.0.0 to v1.1.0 Changes**: Payload para testar mudanças entre versões

## Executando os Testes

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes uma única vez (sem modo watch)
npm test -- --run

# Executar testes com cobertura
npm test -- --coverage

# Executar testes específicos
npm test -- TestPayloads
```

### Resultado dos Testes

```
✓ src/components/TestPayloads.test.tsx (14)
  ✓ TestPayloads Component (14)
    ✓ renders test payload button
    ✓ Valid Payloads (5)
      ✓ basic valid order has all required fields
      ✓ complete valid order has all optional fields
      ✓ valid payloads have correct data types
      ✓ valid payloads have positive values
      ✓ valid payloads have proper enum values
    ✓ Invalid Payloads (4)
      ✓ missing required fields payload is incomplete
      ✓ invalid types payload has wrong data types
      ✓ invalid values payload has out-of-range values
      ✓ invalid types payload has invalid enum values
    ✓ Compatibility Tests (1)
      ✓ compatibility payload exists for version migration
    ✓ User Interaction (3)
      ✓ opens menu when button is clicked
      ✓ navigates to payload selection after category selection
      ✓ calls onSelectPayload when a payload is selected

Test Files  1 passed (1)
Tests  14 passed (14)
```

## Benefícios dos Testes

1. **Validação de Estrutura**: Garantem que os payloads de teste possuem a estrutura correta
2. **Detecção de Regressões**: Identificam mudanças que quebram funcionalidades existentes
3. **Documentação Viva**: Servem como documentação do comportamento esperado
4. **Confiança na Refatoração**: Permitem modificações seguras do código
5. **Qualidade do Código**: Mantêm padrões de qualidade consistentes

## Próximos Passos

1. **Testes de Integração**: Adicionar testes que validam a comunicação com o backend
2. **Testes E2E**: Implementar testes end-to-end com Playwright ou Cypress
3. **Testes de Performance**: Adicionar testes de performance para componentes
4. **Cobertura de Código**: Implementar relatórios de cobertura de código
5. **Testes de Acessibilidade**: Adicionar testes de acessibilidade com axe-core

## Contribuindo

Para adicionar novos testes:

1. Crie arquivos de teste com sufixo `.test.tsx` ou `.spec.tsx`
2. Use as convenções de nomenclatura existentes
3. Inclua testes para casos válidos e inválidos
4. Documente o objetivo de cada teste
5. Execute os testes antes de fazer commit

---

*Esta documentação é mantida atualizada conforme novos testes são adicionados ao projeto.* 