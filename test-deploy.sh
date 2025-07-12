#!/bin/bash

# Script de teste para simular deploy local

echo "🧪 Testando processo de deploy local..."

# Simular estrutura de deploy
mkdir -p test-deploy/backend
cd test-deploy/backend

# Copiar arquivos como o workflow faria
echo "📁 Copiando arquivos do backend..."
cp -r ../../backend/dist/* .
cp ../../backend/package*.json .
cp -r ../../backend/schemas .
cp ../../backend/start-production.sh .
cp ../../backend/.env.production . 2>/dev/null || echo "  - .env.production não encontrado (opcional)"

echo "📋 Verificando arquivos copiados:"
ls -la

echo "🔍 Verificando arquivo index.js:"
[ -f "index.js" ] && echo "✅ index.js encontrado" || echo "❌ index.js NÃO encontrado"

echo "🚀 Testando script de inicialização..."
chmod +x start-production.sh

# Simular apenas a verificação, não executar o PM2
export NODE_ENV=production
export PORT=3001

echo "🔧 Configuração:"
echo "  - Environment: $NODE_ENV"
echo "  - Port: $PORT"
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - Arquivo principal: $([ -f "index.js" ] && echo "index.js" || echo "ERRO: não encontrado")"

cd ../..
rm -rf test-deploy

echo "✅ Teste concluído!"
