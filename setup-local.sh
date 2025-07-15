#!/bin/bash

# OpenDelivery API Schema Validator 2 - Setup Local
# Script para configurar o ambiente de desenvolvimento local

set -e

echo "🚀 OpenDelivery API Schema Validator 2 - Setup Local"
echo "================================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado."
    echo "Por favor, instale o Node.js >= 18.0.0 em: https://nodejs.org/"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Versão do Node.js ($NODE_VERSION) é inferior à versão mínima ($REQUIRED_VERSION)"
    echo "Por favor, atualize o Node.js para a versão $REQUIRED_VERSION ou superior"
    exit 1
fi

echo "✅ Node.js versão: $(node --version)"
echo "✅ npm versão: $(npm --version)"

# Instalar dependências do backend
echo ""
echo "📦 Instalando dependências do backend..."
cd backend
npm install
cd ..

# Instalar dependências do frontend
echo ""
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
cd ..

# Instalar dependências da raiz (se existir package.json)
if [ -f "package.json" ]; then
    echo ""
    echo "📦 Instalando dependências da raiz..."
    npm install
fi

echo ""
echo "✅ Instalação concluída com sucesso!"
echo ""
echo "🔧 Para iniciar o desenvolvimento:"
echo "   1. Terminal 1: cd backend && npm run dev"
echo "   2. Terminal 2: cd frontend && npm run dev"
echo ""
echo "📝 Aplicação estará disponível em:"
echo "   - Frontend: http://localhost:8000"
echo "   - Backend API: http://localhost:3001"
echo ""
echo "📚 Consulte o README.md para mais informações."
