#!/bin/bash

# OpenDelivery API Schema Validator 2 - Release Preparation Script
# Prepara o projeto para release no GitHub

set -e

echo "📦 OpenDelivery API Schema Validator 2 - Release Preparation"
echo "==========================================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# Verificar se estamos na branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Erro: Você deve estar na branch 'main' para fazer release"
    echo "Branch atual: $CURRENT_BRANCH"
    exit 1
fi

# Verificar se não há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Erro: Há mudanças não commitadas. Commit ou stash suas mudanças antes de fazer release"
    git status --short
    exit 1
fi

# Obter versão atual
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📋 Versão atual: $CURRENT_VERSION"

# Verificar se a versão está sincronizada em todos os package.json
BACKEND_VERSION=$(node -p "require('./backend/package.json').version")
FRONTEND_VERSION=$(node -p "require('./frontend/package.json').version")

if [ "$CURRENT_VERSION" != "$BACKEND_VERSION" ] || [ "$CURRENT_VERSION" != "$FRONTEND_VERSION" ]; then
    echo "❌ Erro: Versões não estão sincronizadas"
    echo "Root: $CURRENT_VERSION"
    echo "Backend: $BACKEND_VERSION"
    echo "Frontend: $FRONTEND_VERSION"
    exit 1
fi

# Executar testes
echo "🧪 Executando testes..."
echo "Testing backend..."
cd backend
npm test
cd ..

echo "Testing frontend..."
cd frontend
npm test
cd ..

echo "✅ Todos os testes passaram!"

# Fazer build
echo "🏗️  Fazendo build..."
cd backend
npm run build
cd ..

cd frontend
npm run build
cd ..

echo "✅ Build concluído!"

# Verificar se os arquivos de build foram criados
if [ ! -d "backend/dist" ]; then
    echo "❌ Erro: Backend build não foi criado"
    exit 1
fi

if [ ! -d "frontend/dist" ]; then
    echo "❌ Erro: Frontend build não foi criado"
    exit 1
fi

# Criar tag de release
echo "🏷️  Criando tag de release..."
git tag -a "v$CURRENT_VERSION" -m "Release version $CURRENT_VERSION"

# Preparar informações do release
echo "📝 Preparando informações do release..."

# Criar arquivo com informações do release
cat > release-info.txt << EOF
Release v$CURRENT_VERSION

🎉 OpenDelivery API Schema Validator 2 - Version $CURRENT_VERSION

Esta é a versão $CURRENT_VERSION do OpenDelivery API Schema Validator 2, uma ferramenta avançada para validação, verificação de compatibilidade e certificação de implementações da API OpenDelivery.

📋 Funcionalidades principais:
- Validação multi-versão (1.0.0 até 1.6.0-rc)
- Verificação de compatibilidade entre versões
- Sistema de certificação OpenDelivery Ready
- Interface web interativa
- API RESTful completa

🔗 Links úteis:
- Demo online: https://fazmercado.com/opendelivery-api-schema-validator2/
- Documentação oficial OpenDelivery: https://www.opendelivery.com.br/
- Repositório: https://github.com/marcioreck/opendelivery-api-schema-validator2

🚀 Instalação rápida:
git clone https://github.com/marcioreck/opendelivery-api-schema-validator2.git
cd opendelivery-api-schema-validator2
./setup-local.sh

👤 Autor: Márcio Reck (https://fazmercado.com)
📄 Licença: MIT
EOF

echo "✅ Release preparado!"
echo ""
echo "🎯 Próximos passos:"
echo "1. Verifique o arquivo 'release-info.txt' com as informações do release"
echo "2. Push da tag: git push origin v$CURRENT_VERSION"
echo "3. Push do código: git push origin main"
echo "4. Crie o release no GitHub usando 'release-info.txt'"
echo ""
echo "🔧 Comandos para executar:"
echo "   git push origin main"
echo "   git push origin v$CURRENT_VERSION"
echo ""
echo "🌐 Após o push, acesse: https://github.com/marcioreck/opendelivery-api-schema-validator2/releases/new"
echo "   - Selecione a tag: v$CURRENT_VERSION"
echo "   - Título: OpenDelivery API Schema Validator 2 - v$CURRENT_VERSION"
echo "   - Descrição: Use o conteúdo de 'release-info.txt'"
