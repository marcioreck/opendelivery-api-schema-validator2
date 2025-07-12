#!/bin/bash

# Production start script for OpenDelivery API Schema Validator 2 Backend

set -e

echo "🚀 Iniciando OpenDelivery API Schema Validator 2 Backend..."

# Configurar variáveis de ambiente
export NODE_ENV=production
export PORT=3001
export TERM=xterm
export PATH=$PATH:/usr/local/bin:/usr/bin:/home/$USER/.nvm/versions/node/*/bin

# Carregar variáveis de ambiente
if [ -f .env.production ]; then
    echo "📄 Carregando variáveis de ambiente de .env.production"
    source .env.production
fi

echo "🔧 Configuração:"
echo "  - Environment: $NODE_ENV"
echo "  - Port: $PORT"

# Verificar se Node.js está disponível
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "🔧 Configurando PATH..."
    
    # Tentar encontrar Node.js via NVM
    if [ -d "$HOME/.nvm" ]; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        nvm use 18 2>/dev/null || echo "⚠️  Não foi possível ativar Node.js 18 via NVM"
    fi
    
    # Verificar novamente
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js ainda não está disponível. Verifique a instalação."
        exit 1
    fi
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Verificar se o arquivo principal existe
if [ ! -f "dist/index.js" ]; then
    echo "❌ Arquivo dist/index.js não encontrado!"
    echo "🔧 Verifique se o build foi executado corretamente."
    exit 1
fi

# Parar processo anterior se existir
if command -v pm2 &> /dev/null; then
    echo "🔄 Parando processo anterior (PM2)..."
    pm2 stop opendelivery-api-backend 2>/dev/null || echo "  - Nenhum processo anterior encontrado"
    pm2 delete opendelivery-api-backend 2>/dev/null || echo "  - Processo removido"
fi

# Iniciar o servidor backend
echo "🚀 Iniciando servidor backend..."

# Usar PM2 para gerenciamento de processos em produção (se disponível)
if command -v pm2 &> /dev/null; then
    echo "📦 Usando PM2 para gerenciamento de processos..."
    pm2 start dist/index.js --name "opendelivery-api-backend" --env production
    pm2 save
    echo "✅ Servidor iniciado com PM2!"
    pm2 status
else
    echo "📦 Instalando PM2..."
    npm install -g pm2
    pm2 start dist/index.js --name "opendelivery-api-backend" --env production
    pm2 save
    echo "✅ Servidor iniciado com PM2!"
    pm2 status
fi

echo "🎉 Deploy concluído com sucesso!"
