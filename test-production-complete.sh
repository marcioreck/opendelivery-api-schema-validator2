#!/bin/bash

# Script de Teste Completo para Produção
# Testa todos os endpoints do backend em produção

BACKEND_URL="http://localhost:3001"
LARAVEL_URL="https://fazmercado.com/opendelivery-api-schema-validator2"

echo "🧪 Testando Backend em Produção..."

# 1. Teste de Health Check
echo "1️⃣ Testando Health Check..."
curl -s "$BACKEND_URL/api/health" | jq .
echo ""

# 2. Teste de Validação
echo "2️⃣ Testando Validação..."
curl -s -X POST "$BACKEND_URL/api/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0.0",
    "payload": {
      "deliveryId": "DEL-12345",
      "timestamp": "2024-01-01T12:00:00Z",
      "location": {
        "latitude": -23.5505,
        "longitude": -46.6333
      },
      "status": "delivered"
    }
  }' | jq .
echo ""

# 3. Teste de Compatibilidade
echo "3️⃣ Testando Compatibilidade..."
curl -s -X POST "$BACKEND_URL/api/compatibility" \
  -H "Content-Type: application/json" \
  -d '{
    "fromVersion": "1.0.0",
    "toVersion": "1.1.0",
    "payload": {
      "deliveryId": "DEL-12345",
      "timestamp": "2024-01-01T12:00:00Z",
      "location": {
        "latitude": -23.5505,
        "longitude": -46.6333
      },
      "status": "delivered"
    }
  }' | jq .
echo ""

# 4. Teste de Certificação
echo "4️⃣ Testando Certificação..."
curl -s -X POST "$BACKEND_URL/api/certify" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0.0",
    "payload": {
      "deliveryId": "DEL-12345",
      "timestamp": "2024-01-01T12:00:00Z",
      "location": {
        "latitude": -23.5505,
        "longitude": -46.6333
      },
      "status": "delivered"
    }
  }' | jq .
echo ""

echo "🌐 Testando através do Laravel..."

# 5. Teste através do Laravel
echo "5️⃣ Testando Health Check via Laravel..."
curl -s "$LARAVEL_URL/api/health" | jq .
echo ""

echo "6️⃣ Testando Validação via Laravel..."
curl -s -X POST "$LARAVEL_URL/api/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0.0",
    "payload": {
      "deliveryId": "DEL-12345",
      "timestamp": "2024-01-01T12:00:00Z",
      "location": {
        "latitude": -23.5505,
        "longitude": -46.6333
      },
      "status": "delivered"
    }
  }' | jq .
echo ""

echo "✅ Teste completo finalizado!"
