#!/bin/bash

# OpenDelivery API Schema Validator 2 - Deploy Script
# Script para fazer deploy da aplicação para produção

set -e

echo "🚀 OpenDelivery API Schema Validator 2 - Deploy Script"
echo "======================================================"

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf backend/dist
rm -rf frontend/dist

# Instalar dependências se necessário
echo "📦 Verificando dependências..."
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    cd backend && npm ci --production && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    cd frontend && npm ci && cd ..
fi

# Build do backend
echo "🏗️  Fazendo build do backend..."
cd backend
npm run build
cd ..

# Build do frontend
echo "🏗️  Fazendo build do frontend..."
cd frontend
npm run build
cd ..

# Verificar se os builds foram criados
if [ ! -d "backend/dist" ]; then
    echo "❌ Erro: Build do backend falhou"
    exit 1
fi

if [ ! -d "frontend/dist" ]; then
    echo "❌ Erro: Build do frontend falhou"
    exit 1
fi

# Criar estrutura de deploy
echo "📁 Criando estrutura de deploy..."
mkdir -p deploy/public/opendelivery-api-schema-validator2
mkdir -p deploy/public/opendelivery-api-schema-validator2/api

# Copiar arquivos do frontend para o diretório público
echo "📋 Copiando arquivos do frontend..."
cp -r frontend/dist/* deploy/public/opendelivery-api-schema-validator2/

# Copiar .htaccess do frontend
echo "📋 Copiando .htaccess..."
cp frontend/public/.htaccess deploy/public/opendelivery-api-schema-validator2/

# Copiar arquivos do backend para subdiretório /api
echo "📋 Copiando arquivos do backend para /api..."
cp -r backend/dist/* deploy/public/opendelivery-api-schema-validator2/api/
cp -r backend/node_modules deploy/public/opendelivery-api-schema-validator2/api/
cp -r backend/schemas deploy/public/opendelivery-api-schema-validator2/api/
cp backend/package.json deploy/public/opendelivery-api-schema-validator2/api/

# Criar arquivo de configuração para produção
echo "⚙️  Criando configuração de produção..."
cat > deploy/public/opendelivery-api-schema-validator2/api/.env.production << EOF
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://fazmercado.com/opendelivery-api-schema-validator2
CORS_ORIGIN=https://fazmercado.com
EOF

# Criar script de inicialização
echo "📜 Criando script de inicialização..."
cat > deploy/public/opendelivery-api-schema-validator2/api/start-production.sh << 'EOF'
#!/bin/bash
cd /path/to/fazmercado.com/public/opendelivery-api-schema-validator2/api
export NODE_ENV=production
export PORT=3001
export FRONTEND_URL=https://fazmercado.com/opendelivery-api-schema-validator2
export CORS_ORIGIN=https://fazmercado.com
node index.js
EOF

chmod +x deploy/public/opendelivery-api-schema-validator2/api/start-production.sh

echo "✅ Deploy preparado com sucesso!"
echo ""
echo "📁 Estrutura de deploy criada em: ./deploy/"
echo "   - Aplicação completa: deploy/public/opendelivery-api-schema-validator2/"
echo "   - Frontend: deploy/public/opendelivery-api-schema-validator2/ (arquivos HTML/CSS/JS)"
echo "   - Backend API: deploy/public/opendelivery-api-schema-validator2/api/"
echo "   - Configuração: deploy/public/opendelivery-api-schema-validator2/api/.env.production"
echo "   - Script: deploy/public/opendelivery-api-schema-validator2/api/start-production.sh"
echo ""
echo "📝 Para fazer deploy no Laravel:"
echo "   1. Copie todo o conteúdo de deploy/public/opendelivery-api-schema-validator2/"
echo "   2. Para o diretório: /path/to/fazmercado.com/public/opendelivery-api-schema-validator2/"
echo "   3. Configure o backend: cd /path/to/fazmercado.com/public/opendelivery-api-schema-validator2/api"
echo "   4. Execute: ./start-production.sh"
echo ""
echo "🌐 URLs de acesso:"
echo "   - Frontend: https://fazmercado.com/opendelivery-api-schema-validator2/"
echo "   - Backend API: https://fazmercado.com/opendelivery-api-schema-validator2/api/"
