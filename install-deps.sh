#!/bin/bash

# Script para instalar dependências no servidor de produção
# Este script é copiado para o servidor e executado remotamente

set -e

echo "🔧 Configurando ambiente de produção..."

# Configurar variáveis de ambiente
export TERM=xterm
export PATH=$PATH:/usr/local/bin:/usr/bin:/home/$USER/.nvm/versions/node/*/bin

# Verificar se npm está disponível
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm não encontrado. Instalando..."
    
    # Tentar instalar via NVM (método preferido)
    if ! command -v nvm &> /dev/null; then
        echo "📦 Instalando NVM..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
    
    # Instalar Node.js 18 via NVM
    echo "📦 Instalando Node.js 18..."
    nvm install 18
    nvm use 18
    
    # Verificar se a instalação foi bem-sucedida
    if ! command -v npm &> /dev/null; then
        echo "❌ Falha na instalação do Node.js via NVM. Tentando método alternativo..."
        
        # Método alternativo: NodeSource
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
fi

# Verificar versões
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Instalar dependências de produção
echo "📦 Instalando dependências de produção..."
npm ci --only=production

echo "✅ Dependências instaladas com sucesso!"
