#!/bin/bash

# Script para testar todas as rotas do OpenDelivery API Schema Validator 2
# Uso: ./test-routes.sh

BASE_URL="https://fazmercado.com"
APP_PATH="/opendelivery-api-schema-validator2"

echo "🧪 Testando rotas do OpenDelivery API Schema Validator 2..."
echo "🌐 Base URL: $BASE_URL"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para testar uma rota
test_route() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo -n "🔍 Testando: $description... "
    
    # Fazer requisição e capturar status
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK (HTTP $status)${NC}"
        return 0
    else
        echo -e "${RED}❌ FALHOU (HTTP $status, esperado: $expected_status)${NC}"
        return 1
    fi
}

# Função para testar e mostrar resposta JSON
test_json_route() {
    local url=$1
    local description=$2
    
    echo "🔍 Testando: $description"
    echo "📡 URL: $url"
    
    local response=$(curl -s "$url" 2>/dev/null)
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✅ Status: HTTP $status${NC}"
        echo "📄 Resposta:"
        echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
    else
        echo -e "${RED}❌ Status: HTTP $status${NC}"
        echo "📄 Resposta:"
        echo "$response"
    fi
    echo ""
}

# Contador de testes
total_tests=0
passed_tests=0

echo "=== TESTANDO ROTAS BÁSICAS ==="
echo ""

# Teste 1: Rota principal (deve redirecionar)
((total_tests++))
if test_route "$BASE_URL$APP_PATH" "302" "Rota principal (redirect)"; then
    ((passed_tests++))
fi

# Teste 2: Acesso direto à aplicação
((total_tests++))
if test_route "$BASE_URL/public$APP_PATH/" "200" "Acesso direto à aplicação"; then
    ((passed_tests++))
fi

# Teste 3: Favicon
((total_tests++))
if test_route "$BASE_URL/public$APP_PATH/favicon.svg" "200" "Favicon"; then
    ((passed_tests++))
fi

echo ""
echo "=== TESTANDO API ENDPOINTS ==="
echo ""

# Teste 4: Health check (com detalhes)
test_json_route "$BASE_URL$APP_PATH/api/health" "Health Check"

# Teste 5: Schemas
test_json_route "$BASE_URL$APP_PATH/api/schemas" "Lista de Schemas"

# Teste 6: Validate (POST)
echo "🔍 Testando: Validação (POST)"
echo "📡 URL: $BASE_URL$APP_PATH/api/validate"
validate_response=$(curl -s -X POST "$BASE_URL$APP_PATH/api/validate" \
    -H "Content-Type: application/json" \
    -d '{"payload": {"test": "data"}, "version": "1.5.0"}' 2>/dev/null)
validate_status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL$APP_PATH/api/validate" \
    -H "Content-Type: application/json" \
    -d '{"payload": {"test": "data"}, "version": "1.5.0"}' 2>/dev/null)

if [ "$validate_status" = "503" ]; then
    echo -e "${YELLOW}⚠️  Status: HTTP $validate_status (esperado - backend não configurado)${NC}"
else
    echo -e "${GREEN}✅ Status: HTTP $validate_status${NC}"
fi
echo "📄 Resposta:"
echo "$validate_response" | python3 -m json.tool 2>/dev/null || echo "$validate_response"
echo ""

# Teste 7: Compatibility (POST)
echo "🔍 Testando: Compatibilidade (POST)"
echo "📡 URL: $BASE_URL$APP_PATH/api/compatibility"
compat_response=$(curl -s -X POST "$BASE_URL$APP_PATH/api/compatibility" \
    -H "Content-Type: application/json" \
    -d '{"payload": {"test": "data"}, "from_version": "1.0.0", "to_version": "1.5.0"}' 2>/dev/null)
compat_status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL$APP_PATH/api/compatibility" \
    -H "Content-Type: application/json" \
    -d '{"payload": {"test": "data"}, "from_version": "1.0.0", "to_version": "1.5.0"}' 2>/dev/null)

if [ "$compat_status" = "503" ]; then
    echo -e "${YELLOW}⚠️  Status: HTTP $compat_status (esperado - backend não configurado)${NC}"
else
    echo -e "${GREEN}✅ Status: HTTP $compat_status${NC}"
fi
echo "📄 Resposta:"
echo "$compat_response" | python3 -m json.tool 2>/dev/null || echo "$compat_response"
echo ""

# Teste 8: Endpoint inexistente
echo "🔍 Testando: Endpoint inexistente"
echo "📡 URL: $BASE_URL$APP_PATH/api/inexistente"
notfound_response=$(curl -s "$BASE_URL$APP_PATH/api/inexistente" 2>/dev/null)
notfound_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$APP_PATH/api/inexistente" 2>/dev/null)

if [ "$notfound_status" = "404" ]; then
    echo -e "${GREEN}✅ Status: HTTP $notfound_status (esperado)${NC}"
else
    echo -e "${RED}❌ Status: HTTP $notfound_status${NC}"
fi
echo "📄 Resposta:"
echo "$notfound_response" | python3 -m json.tool 2>/dev/null || echo "$notfound_response"
echo ""

echo "=== TESTANDO ASSETS ==="
echo ""

# Buscar arquivos JS no index.html
echo "🔍 Procurando assets no index.html..."
index_content=$(curl -s "$BASE_URL/public$APP_PATH/" 2>/dev/null)

# Extrair nomes dos arquivos JS
js_files=$(echo "$index_content" | grep -o '/assets/[^"]*\.js' | head -3)
css_files=$(echo "$index_content" | grep -o '/assets/[^"]*\.css' | head -1)

if [ -n "$js_files" ]; then
    echo "📦 Arquivos JS encontrados:"
    echo "$js_files"
    echo ""
    
    # Testar cada arquivo JS
    for js_file in $js_files; do
        ((total_tests++))
        if test_route "$BASE_URL/public$APP_PATH$js_file" "200" "Asset JS: $js_file"; then
            ((passed_tests++))
        fi
    done
fi

if [ -n "$css_files" ]; then
    echo "🎨 Arquivos CSS encontrados:"
    echo "$css_files"
    echo ""
    
    # Testar cada arquivo CSS
    for css_file in $css_files; do
        ((total_tests++))
        if test_route "$BASE_URL/public$APP_PATH$css_file" "200" "Asset CSS: $css_file"; then
            ((passed_tests++))
        fi
    done
fi

echo ""
echo "=== RESUMO DOS TESTES ==="
echo ""
echo "📊 Total de testes: $total_tests"
echo "✅ Testes aprovados: $passed_tests"
echo "❌ Testes falharam: $((total_tests - passed_tests))"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}🎉 Todos os testes passaram!${NC}"
    echo ""
    echo "🚀 A aplicação está funcionando corretamente!"
    echo "🌐 Acesse: $BASE_URL$APP_PATH"
else
    echo -e "${RED}⚠️  Alguns testes falharam.${NC}"
    echo ""
    echo "🔧 Verifique a configuração das rotas Laravel."
fi

echo ""
echo "=== PRÓXIMOS PASSOS ==="
echo ""
echo "1. Se o health check está funcionando, as rotas Laravel estão OK"
echo "2. Se os assets estão carregando, o deploy está correto"
echo "3. Se a aplicação abre, o frontend está funcionando"
echo "4. Para funcionalidade completa, configure um backend Express"
echo ""
echo "📖 Consulte DEPLOY_LARAVEL.md para mais informações"
