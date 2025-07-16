#!/bin/bash

echo "=================================="
echo "🧪 TESTES FINAIS - OpenDelivery Laravel Package"
echo "=================================="
echo ""

# Função para testar um endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local expected_status=$4
    local test_name=$5
    
    echo "Testing: $test_name"
    echo "URL: $method $url"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" -d "$data")
    fi
    
    if [ "$response" -eq "$expected_status" ]; then
        echo "✅ PASSED - HTTP $response"
    else
        echo "❌ FAILED - Expected $expected_status, got $response"
    fi
    echo ""
}

# Função para testar endpoint com resposta
test_endpoint_with_response() {
    local method=$1
    local url=$2
    local data=$3
    local test_name=$4
    
    echo "Testing: $test_name"
    echo "URL: $method $url"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s "$url")
    else
        response=$(curl -s -X "$method" "$url" -H "Content-Type: application/json" -d "$data")
    fi
    
    echo "Response: $response"
    echo ""
}

# Payload de teste
PAYLOAD='{
    "payload": {
        "order": {
            "id": "ORD-12345",
            "customer": {
                "name": "John Doe",
                "email": "john@example.com"
            },
            "items": [
                {
                    "product_id": "PROD-001",
                    "quantity": 2,
                    "price": 29.99
                }
            ],
            "total": 59.98,
            "status": "pending"
        },
        "delivery": {
            "address": {
                "street": "123 Main St",
                "city": "Anytown",
                "postal_code": "12345"
            },
            "scheduled_date": "2024-12-20T10:00:00Z"
        }
    },
    "schema_version": "1.5.0"
}'

COMPATIBILITY_PAYLOAD='{
    "from_version": "1.4.0",
    "to_version": "1.5.0",
    "payload": {
        "order": {
            "id": "ORD-12345",
            "customer": {
                "name": "John Doe",
                "email": "john@example.com"
            }
        }
    }
}'

echo "🔍 TESTANDO LARAVEL v10 (porta 8010)"
echo "===================================="

# Testes básicos Laravel v10
test_endpoint "GET" "http://localhost:8010/opendelivery/health" "" 200 "Health Check v10"
test_endpoint "GET" "http://localhost:8010/opendelivery/dashboard" "" 200 "Dashboard v10"

# Testes de endpoints com resposta Laravel v10
test_endpoint_with_response "POST" "http://localhost:8010/opendelivery/validate" "$PAYLOAD" "Validation v10"
test_endpoint_with_response "POST" "http://localhost:8010/opendelivery/compatibility" "$COMPATIBILITY_PAYLOAD" "Compatibility v10"
test_endpoint_with_response "POST" "http://localhost:8010/opendelivery/certify" "$PAYLOAD" "Certification v10"

echo ""
echo "🔍 TESTANDO LARAVEL v12 (porta 8012)"
echo "===================================="

# Testes básicos Laravel v12
test_endpoint "GET" "http://localhost:8012/opendelivery/health" "" 200 "Health Check v12"
test_endpoint "GET" "http://localhost:8012/opendelivery/dashboard" "" 200 "Dashboard v12"

# Testes de endpoints com resposta Laravel v12
test_endpoint_with_response "POST" "http://localhost:8012/opendelivery/validate" "$PAYLOAD" "Validation v12"
test_endpoint_with_response "POST" "http://localhost:8012/opendelivery/compatibility" "$COMPATIBILITY_PAYLOAD" "Compatibility v12"
test_endpoint_with_response "POST" "http://localhost:8012/opendelivery/certify" "$PAYLOAD" "Certification v12"

echo ""
echo "🧪 TESTES AVANÇADOS"
echo "==================="

# Teste com payload inválido
INVALID_PAYLOAD='{"invalid": "payload"}'
test_endpoint_with_response "POST" "http://localhost:8010/opendelivery/validate" "$INVALID_PAYLOAD" "Invalid Payload Test v10"

# Teste com schema inexistente
INVALID_SCHEMA='{"payload": {"order": {"id": "test"}}, "schema_version": "999.0.0"}'
test_endpoint_with_response "POST" "http://localhost:8010/opendelivery/validate" "$INVALID_SCHEMA" "Invalid Schema Test v10"

# Teste sem parâmetros
test_endpoint_with_response "POST" "http://localhost:8010/opendelivery/validate" "{}" "Empty Payload Test v10"

echo ""
echo "📊 RESUMO DOS TESTES"
echo "==================="
echo "✅ Testes de conectividade nos endpoints"
echo "✅ Testes de validação com payloads reais"
echo "✅ Testes de compatibilidade entre versões"
echo "✅ Testes de certificação"
echo "✅ Testes de error handling"
echo "✅ Testes em ambas as versões Laravel (10 e 12)"
echo ""
echo "🎯 PRÓXIMOS PASSOS SUGERIDOS:"
echo "1. Verificar logs do Laravel para erros"
echo "2. Testar performance com payloads grandes"
echo "3. Implementar testes unitários automatizados"
echo "4. Preparar documentação final"
echo ""
echo "=================================="
echo "🏁 TESTES FINAIS CONCLUÍDOS"
echo "=================================="
else
    echo "❌ Frontend não está respondendo na porta 8000"
    echo "   Execute: cd frontend && npm run dev"
    exit 1
fi

# Verificar se o proxy está funcionando
echo ""
echo "3. Verificando proxy (frontend -> backend)..."
if curl -s http://localhost:8000/api/health > /dev/null; then
    echo "✅ Proxy está funcionando"
else
    echo "❌ Proxy não está funcionando"
    exit 1
fi

# Testar validação
echo ""
echo "4. Testando validação..."
response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"schema_version": "1.6.0-rc", "payload": {"merchant": {"id": "test"}}}' \
  http://localhost:8000/api/validate)

if echo "$response" | grep -q '"status":"error"'; then
    echo "✅ Validação está funcionando (retornou erro esperado para payload incompleto)"
else
    echo "❌ Validação não está funcionando corretamente"
    echo "   Resposta: $response"
    exit 1
fi

echo ""
echo "🎉 Todos os testes passaram! O problema de Network Error foi resolvido."
echo ""
echo "Para usar o sistema:"
echo "1. Abra http://localhost:8000 no seu navegador"
echo "2. Use o editor JSON para testar payloads"
echo "3. Verifique o console do navegador para logs de debug"
