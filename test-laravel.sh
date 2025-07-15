#!/bin/bash

# Teste simples das rotas do Laravel

echo "🧪 Testando rotas do Laravel..."

BASE_URL="https://fazmercado.com/opendelivery-api-schema-validator2/api"

echo "1. Health check:"
curl -s "$BASE_URL/health" | head -3

echo -e "\n2. Validação:"
curl -s -X POST "$BASE_URL/validate" \
  -H "Content-Type: application/json" \
  -d '{"schema_version": "1.0.0"}' | head -3

echo -e "\n3. Compatibilidade:"
curl -s -X POST "$BASE_URL/compatibility" \
  -H "Content-Type: application/json" \
  -d '{"from_version": "1.0.0", "to_version": "1.2.0"}' | head -3

echo -e "\n✅ Concluído!"
