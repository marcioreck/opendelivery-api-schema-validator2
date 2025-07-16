#!/bin/bash

echo "=== Teste de Validação OpenDelivery ==="
echo ""

echo "1. Testando Laravel v10 (porta 8010):"
curl -s -X POST http://localhost:8010/opendelivery/validate \
  -H "Content-Type: application/json" \
  -d '{
    "payload": {
      "order": {
        "id": "ORD-12345",
        "customer": {
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    },
    "schema_version": "1.5.0"
  }' | python3 -m json.tool

echo ""
echo "2. Testando Laravel v12 (porta 8012):"
curl -s -X POST http://localhost:8012/opendelivery/validate \
  -H "Content-Type: application/json" \
  -d '{
    "payload": {
      "order": {
        "id": "ORD-12345",
        "customer": {
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    },
    "schema_version": "1.5.0"
  }' | python3 -m json.tool

echo ""
echo "3. Testando endpoint de dashboard Laravel v10:"
curl -s http://localhost:8010/opendelivery/dashboard

echo ""
echo "4. Testando endpoint de dashboard Laravel v12:"
curl -s http://localhost:8012/opendelivery/dashboard

echo ""
echo "=== Teste concluído ==="
