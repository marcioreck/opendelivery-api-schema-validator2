#!/bin/bash

# Script para testar todas as rotas do Laravel

echo "🧪 Testando todas as rotas do Laravel..."
echo "======================================"

BASE_URL="https://fazmercado.com/opendelivery-api-schema-validator2/api"

echo ""
echo "1. 🔍 Testando Health Check..."
curl -s "$BASE_URL/health" | head -5
echo ""

echo "2. ✅ Testando Validação..."
curl -s -X POST "$BASE_URL/validate" \
  -H "Content-Type: application/json" \
  -d '{"schema_version": "1.0.0", "payload": {"test": "data"}}' | head -5
echo ""

echo "3. 🔄 Testando Compatibilidade..."
curl -s -X POST "$BASE_URL/compatibility" \
  -H "Content-Type: application/json" \
  -d '{"from_version": "1.0.0", "to_version": "1.2.0", "payload": {"test": "data"}}' | head -5
echo ""

echo "4. 🎯 Testando Certificação..."
curl -s -X POST "$BASE_URL/certify" \
  -H "Content-Type: application/json" \
  -d '{"schema_version": "1.0.0", "payload": {"test": "data"}}' | head -5
echo ""

echo "5. ❌ Testando Endpoint Inexistente..."
curl -s "$BASE_URL/nonexistent" | head -5
echo ""

echo "======================================"
echo "✅ Testes concluídos!"
echo ""
echo "Se todas as respostas mostraram JSON válido, as rotas estão funcionando!"
