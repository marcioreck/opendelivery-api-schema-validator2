#!/bin/bash

# Script para testar as APIs do Laravel

echo "🧪 Testando APIs do Laravel..."
echo ""

BASE_URL="https://fazmercado.com/opendelivery-api-schema-validator2/api"

# Teste 1: Validação
echo "1. Testando /validate..."
curl -X POST "${BASE_URL}/validate" \
  -H "Content-Type: application/json" \
  -d '{"schema_version": "1.0.0", "payload": {"test": "data"}}' \
  -s | jq '.'

echo ""

# Teste 2: Compatibilidade
echo "2. Testando /compatibility..."
curl -X POST "${BASE_URL}/compatibility" \
  -H "Content-Type: application/json" \
  -d '{"from_version": "1.0.0", "to_version": "1.1.0", "payload": {"test": "data"}}' \
  -s | jq '.'

echo ""

# Teste 3: Certificação
echo "3. Testando /certify..."
curl -X POST "${BASE_URL}/certify" \
  -H "Content-Type: application/json" \
  -d '{"schema_version": "1.0.0", "payload": {"test": "data"}}' \
  -s | jq '.'

echo ""

# Teste 4: Endpoint inexistente
echo "4. Testando endpoint inexistente..."
curl -X POST "${BASE_URL}/nonexistent" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  -s | jq '.'

echo ""
echo "✅ Testes concluídos!"
