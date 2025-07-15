# CONFIGURAÇÃO DE AMBIENTES - Dev e Produção

## ✅ Problema Resolvido!

A aplicação agora funciona corretamente tanto em **desenvolvimento local** quanto em **produção Laravel**:

### 🔧 Desenvolvimento Local
- **Backend:** `http://localhost:3001/api/`
- **Frontend:** `http://localhost:8000/`
- **Detecção:** Automática via `import.meta.env.DEV`

### 🚀 Produção Laravel
- **Backend:** Via proxy Laravel para `localhost:3001`
- **Frontend:** `https://fazmercado.com/opendelivery-api-schema-validator2/`
- **Detecção:** Automática via URL path

## 🔍 Como Funciona

### 1. Detecção Automática de Ambiente

**Arquivo:** `frontend/src/api.ts`

```typescript
const getApiBaseUrl = () => {
  // 🔧 Desenvolvimento: Vite dev server
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api';
  }
  
  // 🌐 Override por variável de ambiente
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 🚀 Produção: detectar se está no Laravel
  const currentHost = window.location.origin;
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('/opendelivery-api-schema-validator2/')) {
    return `${currentHost}/opendelivery-api-schema-validator2/api`;
  }
  
  // Fallback padrão
  return '/api';
};
```

### 2. Configuração de Variáveis

**Desenvolvimento:** `.env.development`
```bash
VITE_API_URL=http://localhost:3001/api
VITE_APP_TITLE=OpenDelivery API Schema Validator 2 (Dev)
VITE_APP_VERSION=2.0.0-dev
```

**Produção:** `.env.production`
```bash
VITE_API_URL=
VITE_APP_TITLE=OpenDelivery API Schema Validator 2
VITE_APP_VERSION=2.0.0
```

### 3. Debug em Desenvolvimento

O sistema mostra logs detalhados no console quando em desenvolvimento:

```javascript
console.log('🔧 API Configuration:', {
  mode: 'development',
  dev: true,
  prod: false,
  calculatedBaseUrl: 'http://localhost:3001/api',
  currentLocation: 'http://localhost:8000/'
});
```

## 🧪 Como Testar

### Desenvolvimento Local

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Teste
./test-development.sh
```

### Produção

```bash
# Build
cd frontend && npm run build

# Deploy
./test-deploy.sh

# Teste produção
./test-routes.sh
```

## 📋 Comandos Úteis

### Iniciar Desenvolvimento
```bash
# Backend em modo desenvolvimento
cd backend && npm run dev

# Frontend em modo desenvolvimento
cd frontend && npm run dev
```

### Testar Desenvolvimento
```bash
# Script automatizado
./test-development.sh

# Manual
curl http://localhost:3001/api/health
curl http://localhost:8000
```

### Build para Produção
```bash
# Frontend build
cd frontend && npm run build

# Backend build
cd backend && npm run build
```

## 🔧 Troubleshooting

### Se APIs não funcionarem em desenvolvimento:

1. **Verificar se backend está rodando:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Verificar se frontend está rodando:**
   ```bash
   curl http://localhost:8000
   ```

3. **Verificar logs do console do navegador:**
   - Procurar por "🔧 API Configuration"
   - Verificar se `calculatedBaseUrl` está correto

### Se APIs não funcionarem em produção:

1. **Verificar se rotas Laravel estão configuradas**
2. **Verificar se backend está rodando na porta 3001**
3. **Verificar logs do servidor**

## ✅ Status

- ✅ **Desenvolvimento:** Funcionando (`localhost:8000` → `localhost:3001/api`)
- ✅ **Produção:** Funcionando (Laravel proxy → `localhost:3001`)
- ✅ **Detecção automática:** Baseada em `import.meta.env.DEV`
- ✅ **Fallbacks:** Variáveis de ambiente e detecção de URL
- ✅ **Debug:** Logs detalhados em desenvolvimento

**Não há mais conflito entre desenvolvimento e produção!** 🎉
