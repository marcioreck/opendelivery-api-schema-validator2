#!/bin/bash

# Script para testar APIs localmente
echo "🧪 Testando APIs localmente..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para testar API
test_api() {
    local url=$1
    local data=$2
    local description=$3
    
    echo -n "🔍 $description... "
    
    local response=$(curl -s -X POST "$url" \
        -H "Content-Type: application/json" \
        -d "$data" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ OK${NC}"
        echo "   📋 Resposta: $(echo "$response" | cut -c1-100)..."
    else
        echo -e "${RED}❌ FALHOU${NC}"
    fi
    echo ""
}

# Testar APIs locais
echo "📡 Testando backend local (localhost:3001)..."
test_api "http://localhost:3001/api/validate" \
    '{"schema_version": "1.0.0", "payload": {"test": "data"}}' \
    "API Validate"

test_api "http://localhost:3001/api/compatibility" \
    '{"from_version": "1.0.0", "to_version": "1.1.0", "payload": {"test": "data"}}' \
    "API Compatibility"

test_api "http://localhost:3001/api/certify" \
    '{"schema_version": "1.0.0", "payload": {"test": "data"}}' \
    "API Certify"

echo "📡 Testando via proxy Laravel (localhost:8000)..."
test_api "http://localhost:8000/opendelivery-api-schema-validator2/api/validate" \
    '{"schema_version": "1.0.0", "payload": {"test": "data"}}' \
    "API Validate (via Laravel)"

test_api "http://localhost:8000/opendelivery-api-schema-validator2/api/compatibility" \
    '{"from_version": "1.0.0", "to_version": "1.1.0", "payload": {"test": "data"}}' \
    "API Compatibility (via Laravel)"

test_api "http://localhost:8000/opendelivery-api-schema-validator2/api/certify" \
    '{"schema_version": "1.0.0", "payload": {"test": "data"}}' \
    "API Certify (via Laravel)"

echo "✅ Teste concluído!"
