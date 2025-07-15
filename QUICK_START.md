# GUIA RÁPIDO - Desenvolvimento e Produção

## 🚀 Início Rápido

### Desenvolvimento Local

```bash
# 1. Instalar dependências (primeira vez)
npm install

# 2. Iniciar backend (Terminal 1)
cd backend && npm run dev

# 3. Iniciar frontend (Terminal 2)
cd frontend && npm run dev

# 4. Testar (Terminal 3)
./test-development.sh
```

**Acesse:** http://localhost:8000

### Produção Laravel

```bash
# 1. Build
cd frontend && npm run build
cd backend && npm run build

# 2. Deploy
./test-deploy.sh

# 3. Upload arquivos para servidor
# - backend/dist/ → servidor Node.js
# - frontend/dist/ → Laravel public/opendelivery-api-schema-validator2/
# - laravel-routes.php → Laravel routes/web.php

# 4. Testar produção
./test-routes.sh
```

## 📋 Comandos Essenciais

| Comando | Descrição |
|---------|-----------|
| `npm install` | Instalar dependências |
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build produção |
| `./test-development.sh` | Testar desenvolvimento |
| `./test-local-apis.sh` | Testar APIs locais |
| `./test-routes.sh` | Testar produção |

## 🔧 Configuração Automática

A aplicação detecta automaticamente o ambiente:
- **Desenvolvimento:** `localhost:8000` → `localhost:3001/api`
- **Produção:** Laravel proxy → backend Node.js

## 📚 Documentação

- `ENV_CONFIGURATION.md` - Detalhes da configuração
- `DEPLOY_FINAL.md` - Guia completo de deploy
- `FIX_API_ENDPOINTS.md` - Correção de endpoints
- `FIX_ASSETS_404.md` - Correção de assets

## ✅ Status

✅ **Desenvolvimento funcionando**  
✅ **Produção configurada**  
✅ **Detecção automática**  
✅ **Testes automatizados**
