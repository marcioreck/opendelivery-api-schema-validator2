#!/bin/bash

echo "🔍 Verificando se os servidores Laravel estão rodando..."
echo ""

# Verificar Laravel v10
echo "1. Verificando Laravel v10 (porta 8010)..."
if curl -s http://localhost:8010/opendelivery/health > /dev/null; then
    echo "✅ Laravel v10 está rodando na porta 8010"
else
    echo "❌ Laravel v10 não está respondendo na porta 8010"
    echo "   Execute: cd laravel-test-app && php artisan serve --port=8010"
fi

echo ""

# Verificar Laravel v12
echo "2. Verificando Laravel v12 (porta 8012)..."
if curl -s http://localhost:8012/opendelivery/health > /dev/null; then
    echo "✅ Laravel v12 está rodando na porta 8012"
else
    echo "❌ Laravel v12 não está respondendo na porta 8012"
    echo "   Execute: cd laravel-12-test-app && php artisan serve --port=8012"
fi

echo ""
echo "🚀 Para executar os testes completos:"
echo "   chmod +x test-system.sh && ./test-system.sh"
