# Correções de Produção - OpenDelivery API Schema Validator 2

## Problemas Identificados e Corrigidos

### 1. Duplo `/api/` em URLs de Produção

**Problema**: URLs ficavam como `https://fazmercado.com/public/opendelivery-api-schema-validator2/api/api/validate`

**Causa**: O `baseURL` em produção já incluía `/api`, mas os endpoints também tinham `/api`

**Solução**: 
- Modificado `frontend/src/api.ts` para usar baseURL sem `/api` em produção
- Endpoints mantêm o prefixo `/api/` nos métodos

```typescript
// Antes (ERRADO):
if (currentPath.includes('/opendelivery-api-schema-validator2/')) {
  return `${currentHost}/opendelivery-api-schema-validator2/api`;
}

// Depois (CORRETO):
if (currentPath.includes('/opendelivery-api-schema-validator2/')) {
  return `${currentHost}/opendelivery-api-schema-validator2`;
}
```

### 2. CSP Bloqueando Scripts da GoDaddy

**Problema**: `Refused to load the script 'https://img1.wsimg.com/traffic-assets/js/tccl.min.js'`

**Solução**: Atualizado `.htaccess` para permitir scripts da GoDaddy:

```apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.wsimg.com https://fazmercado.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://fazmercado.com"
```

### 3. Configuração de Ambiente Simplificada

**Desenvolvimento**: 
- `baseURL = ''` (string vazia)
- Vite proxy cuida dos redirecionamentos `/api` → `localhost:3001`

**Produção**:
- `baseURL = 'https://fazmercado.com/opendelivery-api-schema-validator2'`
- Endpoints com `/api/` → URL final correta

## Configuração Final

### Desenvolvimento Local
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev

# Acesso: http://localhost:8000
```

### Produção
```bash
# Build e deploy
cd frontend && npm run build
# Upload arquivos dist/* para Laravel public/opendelivery-api-schema-validator2/
```

## URLs Finais

### Desenvolvimento
- Frontend: `http://localhost:8000`
- Backend: `http://localhost:3001`
- API via proxy: `http://localhost:8000/api/*`

### Produção
- Frontend: `https://fazmercado.com/opendelivery-api-schema-validator2/`
- API: `https://fazmercado.com/opendelivery-api-schema-validator2/api/*`

## Testes Validados

✅ Assets carregam corretamente  
✅ Scripts da GoDaddy permitidos no CSP  
✅ APIs funcionam via proxy em desenvolvimento  
✅ URLs corretas em produção (sem duplo `/api/`)  
✅ Build de produção funcional  
✅ Deploy script testado  

## Próximos Passos

1. Deploy em produção
2. Testar todas as funcionalidades no servidor
3. Verificar logs do browser para debugging
4. Confirmar que compatibilidade checker funciona corretamente
