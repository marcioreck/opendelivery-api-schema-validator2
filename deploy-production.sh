#!/bin/bash

# Script de Deploy para OpenDelivery API Schema Validator 2
# Uso: ./deploy-production.sh

set -e

echo "🚀 Iniciando deploy do OpenDelivery API Schema Validator 2..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações
FRONTEND_DIR="frontend"
DIST_DIR="frontend/dist"
DEPLOY_DIR="/var/www/html/public/opendelivery-api-schema-validator2"
BACKUP_DIR="/var/www/html/public/opendelivery-api-schema-validator2.backup"

# Função para mostrar erros
error_exit() {
    echo -e "${RED}❌ Erro: $1${NC}" >&2
    exit 1
}

# Função para mostrar sucesso
success_msg() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Função para mostrar warning
warning_msg() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ] || [ ! -d "$FRONTEND_DIR" ]; then
    error_exit "Execute este script na raiz do projeto OpenDelivery API Schema Validator 2"
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    error_exit "npm não está instalado"
fi

# Limpar e instalar dependências
echo "📦 Instalando dependências..."
cd $FRONTEND_DIR
npm install || error_exit "Falha ao instalar dependências"

# Fazer build de produção
echo "🔨 Fazendo build de produção..."
npm run build || error_exit "Falha no build de produção"

# Voltar para a raiz
cd ..

# Verificar se o build foi criado
if [ ! -d "$DIST_DIR" ]; then
    error_exit "Diretório de build não encontrado: $DIST_DIR"
fi

# Verificar se os assets foram criados
if [ ! -d "$DIST_DIR/assets" ]; then
    error_exit "Diretório de assets não encontrado: $DIST_DIR/assets"
fi

# Contar arquivos de assets
ASSET_COUNT=$(ls -1 "$DIST_DIR/assets"/*.js "$DIST_DIR/assets"/*.css 2>/dev/null | wc -l)
if [ $ASSET_COUNT -lt 3 ]; then
    error_exit "Assets insuficientes gerados (encontrados: $ASSET_COUNT, esperados: pelo menos 3)"
fi

success_msg "Build de produção criado com sucesso"

# Fazer backup se o diretório existir
if [ -d "$DEPLOY_DIR" ]; then
    echo "📁 Fazendo backup do deploy anterior..."
    if [ -d "$BACKUP_DIR" ]; then
        rm -rf "$BACKUP_DIR"
    fi
    mv "$DEPLOY_DIR" "$BACKUP_DIR" || warning_msg "Não foi possível fazer backup"
    success_msg "Backup criado em: $BACKUP_DIR"
fi

# Criar diretório de deploy
echo "📂 Criando diretório de deploy..."
mkdir -p "$DEPLOY_DIR" || error_exit "Não foi possível criar diretório de deploy"

# Copiar arquivos
echo "📋 Copiando arquivos para produção..."
cp -r "$DIST_DIR"/* "$DEPLOY_DIR"/ || error_exit "Falha ao copiar arquivos"

# Verificar se o .htaccess foi copiado
if [ ! -f "$DEPLOY_DIR/.htaccess" ]; then
    error_exit "Arquivo .htaccess não encontrado no deploy"
fi

# Verificar se o index.html foi copiado
if [ ! -f "$DEPLOY_DIR/index.html" ]; then
    error_exit "Arquivo index.html não encontrado no deploy"
fi

# Verificar se os assets foram copiados
if [ ! -d "$DEPLOY_DIR/assets" ]; then
    error_exit "Diretório assets não encontrado no deploy"
fi

# Ajustar permissões
echo "🔐 Ajustando permissões..."
chmod -R 755 "$DEPLOY_DIR" || warning_msg "Não foi possível ajustar permissões"

# Verificar se o deploy está funcionando
echo "🧪 Verificando deploy..."
ASSETS_DEPLOYED=$(ls -1 "$DEPLOY_DIR/assets"/*.js "$DEPLOY_DIR/assets"/*.css 2>/dev/null | wc -l)
if [ $ASSETS_DEPLOYED -ne $ASSET_COUNT ]; then
    error_exit "Nem todos os assets foram copiados corretamente"
fi

success_msg "Deploy concluído com sucesso!"

# Mostrar informações do deploy
echo ""
echo "📊 Informações do Deploy:"
echo "   📁 Diretório: $DEPLOY_DIR"
echo "   📁 Backup: $BACKUP_DIR"
echo "   📦 Assets copiados: $ASSETS_DEPLOYED"
echo "   🌐 Rota Laravel: https://fazmercado.com/opendelivery-api-schema-validator2"
echo "   🌐 Acesso direto: https://fazmercado.com/public/opendelivery-api-schema-validator2/"
echo ""

# Mostrar próximos passos
echo "🔍 Próximos passos:"
echo "1. Acesse https://fazmercado.com/opendelivery-api-schema-validator2 (rota Laravel)"
echo "2. Ou acesse diretamente https://fazmercado.com/public/opendelivery-api-schema-validator2/"
echo "3. Verifique se não há erros 404 nos assets"
echo "4. Teste todas as funcionalidades"
echo "5. Monitore os logs do servidor web"
echo ""

# Teste opcional de conectividade
if command -v curl &> /dev/null; then
    echo "🌐 Testando conectividade..."
    
    # Teste da rota Laravel (deve ser 302 redirect)
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://fazmercado.com/opendelivery-api-schema-validator2" || echo "000")
    if [ "$HTTP_CODE" = "302" ]; then
        success_msg "Rota Laravel está redirecionando corretamente (HTTP 302)"
    else
        warning_msg "Rota Laravel retornou código HTTP: $HTTP_CODE"
    fi
    
    # Teste do acesso direto (deve ser 200)
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://fazmercado.com/public/opendelivery-api-schema-validator2/" || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        success_msg "Aplicação está respondendo diretamente (HTTP 200)"
    else
        warning_msg "Acesso direto retornou código HTTP: $HTTP_CODE"
    fi
fi

echo ""
success_msg "Deploy do OpenDelivery API Schema Validator 2 finalizado! 🎉"
