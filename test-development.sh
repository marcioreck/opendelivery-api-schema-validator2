#!/bin/bash

# Script para testar o desenvolvimento local
echo "🧪 Testando desenvolvimento local..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
    local url=$1
    local description=$2
    
    echo -n "🔍 $description... "
    
    local response=$(curl -s "$url" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ OK${NC}"
        echo "   📋 $(echo "$response" | cut -c1-80)..."
    else
        echo -e "${RED}❌ FALHOU${NC}"
    fi
    echo ""
}

# Função para testar API POST
test_api_post() {
    local url=$1
    local data=$2
    local description=$3
    
    echo -n "🔍 $description... "
    
    local response=$(curl -s -X POST "$url" \
        -H "Content-Type: application/json" \
        -d "$data" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ OK${NC}"
        echo "   📋 $(echo "$response" | cut -c1-80)..."
    else
        echo -e "${RED}❌ FALHOU${NC}"
    fi
    echo ""
}

echo "🔧 Verificando serviços..."
echo ""

# Verificar se backend está rodando
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend rodando (localhost:3001)${NC}"
else
    echo -e "${RED}❌ Backend não está rodando${NC}"
    echo "   Execute: cd backend && npm run dev"
    exit 1
fi

# Verificar se frontend está rodando
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend rodando (localhost:8000)${NC}"
else
    echo -e "${RED}❌ Frontend não está rodando${NC}"
    echo "   Execute: cd frontend && npm run dev"
    exit 1
fi

echo ""
echo "🧪 Testando endpoints..."
echo ""

# Testar health
test_endpoint "http://localhost:3001/api/health" "Health Check"

# Testar APIs
test_api_post "http://localhost:3001/api/validate" \
    '{"schema_version": "1.0.0", "payload": {"test": "data"}}' \
    "API Validate"

test_api_post "http://localhost:3001/api/compatibility" \
    '{"from_version": "1.0.0", "to_version": "1.1.0", "payload": {"test": "data"}}' \
    "API Compatibility"

test_api_post "http://localhost:3001/api/certify" \
    '{"schema_version": "1.0.0", "payload": {"test": "data"}}' \
    "API Certify"

echo ""
echo "🌐 Acesse o frontend em: http://localhost:8000"
echo "📊 Acesse o backend em: http://localhost:3001/api/health"
echo ""
echo "✅ Desenvolvimento local funcionando!"
