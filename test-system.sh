#!/bin/bash

echo "🔍 Verificando se os serviços estão rodando..."
echo ""

# Verificar se o backend está rodando
echo "1. Verificando backend (porta 3001)..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend está rodando na porta 3001"
else
    echo "❌ Backend não está respondendo na porta 3001"
    echo "   Execute: cd backend && npm run dev"
    exit 1
fi

# Verificar se o frontend está rodando
echo ""
echo "2. Verificando frontend (porta 8000)..."
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ Frontend está rodando na porta 8000"
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
