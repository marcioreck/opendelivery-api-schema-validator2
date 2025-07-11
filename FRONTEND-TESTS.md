# Documentação dos Testes de Frontend - OpenDelivery API Schema Validator 2

## Visão Geral

Este documento descreve os testes de frontend implementados para o **OpenDelivery API Schema Validator 2**. Os testes foram desenvolvidos usando **Vitest** e **React Testing Library** para garantir a qualidade e funcionalidade dos componentes React.

## Sobre o OpenDelivery

O **OpenDelivery** é um padrão de API REST que estabelece um protocolo único de comunicação entre comerciantes e aplicações de pedidos no ecossistema de delivery. Para mais informações sobre o padrão oficial, visite: [https://www.opendelivery.com.br/](https://www.opendelivery.com.br/)

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

  expect(mockOnSelectPayload).toHaveBeenCalledWith(
    expect.objectContaining({
      id: expect.any(String),
      orderTiming: expect.any(String),
      orderType: expect.any(String)
    })
  );
});
```

**Objetivo**: Verificar se a seleção de payload chama a função callback corretamente.

## Execução dos Testes

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar uma única vez (sem watch)
npm test -- --run

# Executar com cobertura
npm test -- --coverage

# Executar testes específicos
npm test -- TestPayloads

# Executar com relatório detalhado
npm test -- --reporter=verbose
```

### Resultados dos Testes

Os testes estão passando com sucesso:

```
✓ Test Files  1 passed (1)
✓ Tests  14 passed (14)
⏱️ Duration  ~8 segundos
```

## Estrutura de Arquivos

```
frontend/
├── src/
│   ├── components/
│   │   ├── TestPayloads.tsx          # Componente testado
│   │   └── TestPayloads.test.tsx     # Testes do componente
│   └── test/
│       └── setup.ts                  # Configuração dos testes
├── vitest.config.ts                  # Configuração do Vitest
└── package.json                      # Dependências e scripts
```

## Benefícios dos Testes

### Qualidade do Código
- **Detecção Precoce de Bugs**: Identifica problemas antes da produção
- **Documentação Viva**: Testes servem como documentação do comportamento
- **Refatoração Segura**: Permite mudanças com confiança
- **Padronização**: Mantém consistência na estrutura de dados

### Validação de Esquemas
- **Conformidade com OpenDelivery API**: Garante aderência aos padrões
- **Detecção de Regressões**: Identifica mudanças que quebram funcionalidades
- **Validação de Tipos**: Verifica integridade dos tipos de dados
- **Teste de Casos Extremos**: Valida comportamento em cenários inválidos

### Experiência do Desenvolvedor
- **Feedback Rápido**: Testes executam em ~8 segundos
- **Debugging Facilitado**: Mensagens de erro claras e específicas
- **Ambiente Isolado**: Testes não afetam outros componentes
- **Integração Contínua**: Pronto para pipelines de CI/CD

## Melhorias Futuras

### Expansão da Cobertura
1. **Testes de Integração**: Validar comunicação frontend-backend
2. **Testes E2E**: Implementar testes end-to-end
3. **Testes de Performance**: Verificar performance dos componentes
4. **Testes de Acessibilidade**: Adicionar validações de a11y

### Novas Funcionalidades
1. **Mais Componentes**: Testar outros componentes da aplicação
2. **Testes de API**: Validar chamadas para o backend
3. **Testes de Estado**: Verificar gerenciamento de estado
4. **Testes de Routing**: Validar navegação entre páginas

---

**Desenvolvido por Márcio Reck**  
**Portfólio**: [https://fazmercado.com](https://fazmercado.com)  
**Projeto**: OpenDelivery API Schema Validator 2 