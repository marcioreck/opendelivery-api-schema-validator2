    # OpenDelivery API Schema Validator 2

[![CI/CD](https://github.com/marcioreck/opendelivery-api-schema-validator2/actions/workflows/ci.yml/badge.svg)](https://github.com/marcioreck/opendelivery-api-schema-validator2/actions/workflows/ci.yml)

Uma ferramenta avançada e abrangente para validação, verificação de compatibilidade e certificação de implementações da API OpenDelivery. Este projeto fornece tanto um serviço backend para validação de esquemas quanto uma interface frontend para fácil interação.

## Sobre o OpenDelivery

O **OpenDelivery** é um padrão de API REST que estabelece um protocolo único de comunicação entre comerciantes e aplicações de pedidos no ecossistema de delivery. Para mais informações sobre o padrão oficial, visite: [https://www.opendelivery.com.br/](https://www.opendelivery.com.br/)

## Funcionalidades

### Backend
- **Validação Multi-versão**: Suporte completo para validação de esquemas das versões 1.0.0 até 1.6.0-rc
- **Sistema de Gerenciamento de Esquemas**: Carregamento e gerenciamento automatizado de múltiplas versões de esquemas
- **Verificação de Compatibilidade**: Análise de compatibilidade entre diferentes versões da API
- **Validação de Segurança**: Verificação de requisitos de segurança e detecção de dados sensíveis
- **Sistema de Certificação**: Certificação "OpenDelivery Ready" com pontuação detalhada
- **API RESTful**: Endpoints bem definidos para todas as funcionalidades

### Frontend
- **Editor JSON Interativo**: Editor Monaco integrado com syntax highlighting
- **Seletor de Versões**: Interface para seleção de versão de esquema
- **Validação em Tempo Real**: Feedback imediato sobre a validação
- **Verificador de Compatibilidade**: Interface para análise de compatibilidade entre versões
- **Dashboard de Certificação**: Painel completo para certificação OpenDelivery Ready
- **Payloads de Teste**: Exemplos pré-definidos de payloads válidos e inválidos para testes
- **Verificador de Autenticidade**: Ferramenta para verificar a autenticidade da API OpenDelivery

## Estrutura do Projeto

```
opendelivery-api-schema-validator2/
├── backend/                    # Serviço backend
│   ├── src/
│   │   ├── services/          # Serviços principais
│   │   │   ├── ValidationService.ts
│   │   │   ├── CompatibilityService.ts
│   │   │   ├── CertificationService.ts
│   │   │   ├── SchemaManager.ts
│   │   └── ValidationEngine.ts
│   │   ├── controllers/       # Controladores da API
│   │   │   ├── validateController.ts
│   │   │   ├── compatibilityController.ts
│   │   │   └── certifyController.ts
│   │   ├── types/            # Definições de tipos
│   │   └── utils/            # Utilitários
│   ├── schemas/              # Esquemas JSON das versões OpenDelivery
│   │   ├── 1.0.0.yaml
│   │   ├── 1.0.1.yaml
│   │   ├── 1.1.0.yaml
│   │   ├── 1.1.1.yaml
│   │   ├── 1.2.0.yaml
│   │   ├── 1.2.1.yaml
│   │   ├── 1.3.0.yaml
│   │   ├── 1.4.0.yaml
│   │   ├── 1.5.0.yaml
│   │   ├── 1.6.0-rc.yaml
│   │   └── beta.yaml
│   ├── tests/                # Testes do backend
│   └── package.json
├── frontend/                  # Aplicação frontend
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── TestPayloads.tsx
│   │   │   ├── CompatibilityChecker.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Navbar.tsx
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── ValidatorPage.tsx
│   │   │   ├── CompatibilityPage.tsx
│   │   │   └── CertificationPage.tsx
│   │   ├── services/        # Serviços da API
│   │   └── types/           # Tipos TypeScript
│   ├── public/              # Assets estáticos
│   └── package.json
├── packages/                  # Laravel Package
│   └── opendelivery/
│       └── laravel-validator/
│           ├── src/          # Código fonte PHP
│           ├── resources/    # Views, JS, CSS
│           ├── routes/       # Rotas web
│           ├── config/       # Configuração
│           └── composer.json
├── laravel-test-app/         # Ambiente de teste Laravel 10
├── laravel-12-test-app/      # Ambiente de teste Laravel 12
└── docs/                    # Documentação
    ├── SUPPORT.md          # Documentação de suporte
    ├── API.md              # Documentação da API
    └── ...
```

## Começando

### Pré-requisitos
- Node.js >= 18.0.0
- npm >= 9.0.0
- TypeScript >= 5.0.0

### Instalação

#### Método 1: Setup Automático (Recomendado)
```bash
# Clone o repositório
git clone https://github.com/marcioreck/opendelivery-api-schema-validator2.git
cd opendelivery-api-schema-validator2

# Execute o script de setup local
./setup-local.sh
```

#### Método 2: Setup Manual
```bash
# Clone o repositório
git clone https://github.com/marcioreck/opendelivery-api-schema-validator2.git
cd opendelivery-api-schema-validator2

# Instale as dependências do backend
cd backend
npm install

# Instale as dependências do frontend
cd ../frontend
npm install
```

### Desenvolvimento

1. Inicie o serviço backend:
```bash
cd backend
npm run dev
```

2. Inicie a aplicação frontend:
```bash
cd frontend
npm run dev
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:8000
- **API Backend**: http://localhost:3001


## Laravel Package

Este projeto também está disponível como um **pacote Laravel** para fácil integração em projetos Laravel existentes.

### Configuração do Ambiente de Desenvolvimento

#### URLs dos Servidores:
- **Laravel 10**: http://localhost:8010/opendelivery-api-schema-validator2
- **Laravel 12**: http://localhost:8012/opendelivery-api-schema-validator2
- **Frontend Standalone**: http://localhost:8000
- **Vite Dev Server (Pacote)**: http://localhost:5173 (busca automaticamente porta livre)

#### Configuração MySQL

##### Configuração do .env
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_opendelivery_test
# DB_DATABASE=laravel_opendelivery_test_v12 # para Laravel 12
DB_USERNAME=laravel
DB_PASSWORD=laravel123
```

##### Comandos para configurar MySQL
```bash
# Criar usuário MySQL
sudo mysql -u root -p -e "CREATE USER 'laravel'@'localhost' IDENTIFIED BY 'laravel123';"

# Criar bancos de dados
sudo mysql -u root -p -e "CREATE DATABASE laravel_opendelivery_test;"
sudo mysql -u root -p -e "CREATE DATABASE laravel_opendelivery_test_v12;"

# Dar permissões
sudo mysql -u root -p -e "GRANT ALL PRIVILEGES ON laravel_opendelivery_test.* TO 'laravel'@'localhost';"
sudo mysql -u root -p -e "GRANT ALL PRIVILEGES ON laravel_opendelivery_test_v12.* TO 'laravel'@'localhost';"
sudo mysql -u root -p -e "FLUSH PRIVILEGES;"
```

#### Servidores de Desenvolvimento
```bash
# Vite
cd packages/opendelivery/laravel-validator && npm run dev

# Laravel 10.x (compatibilidade produção)
cd laravel-test-app
php artisan migrate:status
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8010

# Laravel 12.x (desenvolvimento)
cd ../laravel-12-test-app
php artisan migrate:status
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8012

# Frontend Standalone
cd frontend
npm run dev  # porta 8000
```

### Instalação do Pacote Laravel

#### Instalação via Composer (Produção)

Para **instalar em qualquer projeto Laravel existente** a partir da versão 10.x:

```bash
# Instalar o pacote
composer require opendelivery/laravel-validator

# Publicar os assets buildados (OBRIGATÓRIO)
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force

# (Opcional) Publicar views se quiser customizar o layout
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-views

# (Opcional) Publicar configuração se quiser customizar
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-config

# Pronto! Acesse: /opendelivery-api-schema-validator2
```

**⚠️ Atenção**: Se você publicar as views (`--tag=opendelivery-views`) e encontrar erros 404 de CSS, remova o link hardcoded do layout conforme documentado na seção "Configuração de Desenvolvimento com Vite".

#### Verificação da Estrutura do Pacote

**Antes de publicar no Packagist, verifique se a estrutura está correta:**

```bash
# Verificar se os assets buildados existem
ls -la packages/opendelivery/laravel-validator/public/build/assets/
ls -la packages/opendelivery/laravel-validator/public/build/.vite/manifest.json

# Verificar se os schemas estão presentes  
ls -la packages/opendelivery/laravel-validator/schemas/

# Verificar se o service provider existe
ls -la packages/opendelivery/laravel-validator/src/OpenDeliveryServiceProvider.php

# Testar se o comando de publicação funciona
cd laravel-test-app
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force
```

#### Configuração para Desenvolvimento Local
Para desenvolvimento local, configure o `composer.json` dos projetos Laravel:

**Laravel 10 (laravel-test-app/composer.json):**
```json
{
    "repositories": [
        {
            "type": "path",
            "url": "../packages/opendelivery/laravel-validator"
        }
    ],
    "require": {
        "php": "^8.1",
        "laravel/framework": "^10.10",
        "opendelivery/laravel-validator": "dev-main"
    }
}
```

**Laravel 12 (laravel-12-test-app/composer.json):**
```json
{
    "repositories": [
        {
            "type": "path",
            "url": "../packages/opendelivery/laravel-validator"
        }
    ],
    "require": {
        "php": "^8.2",
        "laravel/framework": "^12.0",
        "opendelivery/laravel-validator": "dev-main"
    }
}
```

#### Sequência Completa de Setup (Para Desenvolvimento do Pacote)

**Esta sequência é apenas para desenvolver/testar o próprio pacote Laravel:**

```bash
# 1. Instalar dependências dos projetos Laravel de teste
cd laravel-test-app && composer install
cd ../laravel-12-test-app && composer install

# 2. Build dos assets React do pacote
cd ../packages/opendelivery/laravel-validator
npm install
npm run build

# 3. Publicar assets buildados nos projetos de teste
cd ../../../laravel-test-app
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force

cd ../laravel-12-test-app
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force

# 4. Executar migrações (se necessário)
cd ../laravel-test-app && php artisan migrate --force
cd ../laravel-12-test-app && php artisan migrate --force

# 5. (Para desenvolvimento) Iniciar servidor Vite do pacote
cd ../packages/opendelivery/laravel-validator && npm run dev &

# 6. Iniciar servidores Laravel de teste
cd ../../../laravel-test-app && php artisan serve --host=127.0.0.1 --port=8010 &
cd ../laravel-12-test-app && php artisan serve --host=127.0.0.1 --port=8012 &
```

**Para instalar em um projeto Laravel existente, use apenas a seção "Instalação via Composer (Produção)" acima.**

### Publicação dos Assets

```bash
# Publicar assets (JS, CSS, imagens)
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets

# Publicar views
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-views

# Publicar configuração
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-config
```

### Configuração de Desenvolvimento com Vite

Para desenvolvimento local, é necessário executar o servidor Vite do pacote para servir os assets React corretamente:

#### 1. Iniciar Servidor Vite do Pacote Laravel
```bash
# Navegar para o diretório do pacote
cd packages/opendelivery/laravel-validator

# Instalar dependências se necessário
npm install

# Iniciar servidor Vite (porta 5175 automática - Vite busca porta disponível)
npm run dev
# ➜ Local: http://localhost:5175/ (ou próxima porta disponível)
```

**📋 Configuração de Portas:**
- **Laravel 10**: `http://127.0.0.1:8010`
- **Laravel 12**: `http://127.0.0.1:8012` 
- **Vite Dev Server**: `http://127.0.0.1:5173` (busca automaticamente porta livre)
- **Frontend Standalone**: `http://127.0.0.1:8000`

#### 2. Iniciar Servidores Laravel de Teste
```bash
# Terminal 1 - Laravel 10
cd laravel-test-app
php artisan serve --host=127.0.0.1 --port=8010

# Terminal 2 - Laravel 12  
cd laravel-12-test-app
php artisan serve --host=127.0.0.1 --port=8012
```

#### 3. Correção de Links CSS Hardcoded (Se Necessário)

**⚠️ IMPORTANTE**: Se após publicar as views (`--tag=opendelivery-views`) você encontrar erros 404 de CSS como:
```
GET http://127.0.0.1:8010/vendor/opendelivery/css/app.css net::ERR_ABORTED 404 (Not Found)
```

Isso significa que o layout publicado contém um link CSS hardcoded incorreto. Para corrigir:

**Localizar o arquivo problemático:**
```bash
# O arquivo estará em uma dessas localizações:
resources/views/vendor/opendelivery/layouts/app.blade.php
```

**Remover a linha problemática:**
```php
<!-- REMOVER ESTA LINHA SE EXISTIR -->
<link href="{{ asset('vendor/opendelivery/css/app.css') }}" rel="stylesheet">
```

**Layout correto deve ter apenas:**
```php
<head>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Additional CSS -->
    @yield('styles')
    
    <!-- Configuration for React -->
    <script>
        window.Laravel = {
            csrfToken: '{{ csrf_token() }}',
            apiUrl: '{{ url('/opendelivery-api-schema-validator2') }}',
            appUrl: '{{ url('/') }}',
            locale: '{{ app()->getLocale() }}',
        };
    </script>
</head>
```

#### 4. Verificar Funcionamento
```bash
# Test Health Check
curl "http://localhost:8010/opendelivery-api-schema-validator2/health"

# Verificar interface React (sem erros 404)
curl -s http://localhost:8010/opendelivery-api-schema-validator2/react | grep -i "error\|404"
```

### Ordem Correta de Execução

Para garantir que tudo funcione perfeitamente em qualquer instância Laravel:

```bash
# 1. Instalar o pacote
composer require opendelivery/laravel-validator

# 2. Publicar assets buildados (obrigatório)
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force

# 3. (Opcional) Publicar views se quiser customizar
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-views

# 4. (Desenvolvimento) Iniciar Vite se estiver desenvolvendo o pacote
cd packages/opendelivery/laravel-validator && npm run dev

# 5. (Se publicou views) Verificar e corrigir links hardcoded se necessário
# Verificar se existe: resources/views/vendor/opendelivery/layouts/app.blade.php
# Remover linha: <link href="{{ asset('vendor/opendelivery/css/app.css') }}" rel="stylesheet">

# 6. Iniciar servidor Laravel
php artisan serve
```

### Compatibilidade com Instâncias Laravel Existentes

O pacote foi projetado para funcionar em **qualquer instância Laravel existente** a partir da versão 10.x:

- ✅ **Não interfere** com assets existentes do projeto
- ✅ **Assets isolados** em `/vendor/opendelivery/`
- ✅ **Rotas prefixadas** com `/opendelivery-api-schema-validator2/`
- ✅ **Configuração independente** do projeto host
- ✅ **Views com namespace** `opendelivery::`

### Troubleshooting

**Problema: CSS 404 Error**
```bash
# Solução: Remover link hardcoded do layout publicado
vim resources/views/vendor/opendelivery/layouts/app.blade.php
# Remover: <link href="{{ asset('vendor/opendelivery/css/app.css') }}" rel="stylesheet">
```

**Problema: Assets não carregam**
```bash
# Solução: Republicar assets
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force
```

**Problema: Interface React não funciona**
```bash
# Solução: Verificar se servidor Vite está rodando (desenvolvimento)
cd packages/opendelivery/laravel-validator && npm run dev
```

**Problema: Erro 500 no endpoint /opendelivery-api-schema-validator2/validate**
```bash
# Causa: Método getSchemaPath() não implementado no ValidationService
# Erro: Call to undefined method ValidationService::getSchemaPath()
# Solução: Método foi implementado no ValidationService.php

# Teste se está funcionando:
curl -X POST "http://localhost:8010/opendelivery-api-schema-validator2/validate" \
  -H "Content-Type: application/json" \
  -d '{"version": "1.6.0-rc", "payload": {"version": "1.6.0-rc", "merchant": {"id": "test"}}}'
```

**Problema: Interface React com 400 Bad Request**
```bash
# Causa: Estava tentando usar versão "1.6.0" que não existe 
# A versão correta é "1.6.0-rc"
# Versões disponíveis: 1.0.0, 1.0.1, 1.1.0, 1.1.1, 1.2.0, 1.2.1, 1.3.0, 1.4.0, 1.5.0, 1.6.0-rc, beta
```

**Problema: Múltiplos servidores Vite rodando**
```bash
# Verificar quais portas estão em uso:
netstat -tlnp | grep -E ":(5173|5174|5175)" 

# Finalizar processos desnecessários (manter apenas 5175):
kill $(lsof -ti:5173) 2>/dev/null || true
kill $(lsof -ti:5174) 2>/dev/null || true

# Verificar configuração final:
# ✅ Laravel 10: http://127.0.0.1:8010
# ✅ Vite Dev: http://127.0.0.1:5175
# ✅ Health check: curl http://127.0.0.1:8010/opendelivery-api-schema-validator2/health
```

### Uso

Após a instalação, as seguintes rotas estarão disponíveis:

#### Rotas Principais:
- **Interface React**: `/opendelivery-api-schema-validator2` (padrão)
- **Interface React**: `/opendelivery-api-schema-validator2/react`
- **Dashboard Blade**: `/opendelivery-api-schema-validator2/blade`
- **Health Check**: `/opendelivery-api-schema-validator2/health`
- **Documentação de Rotas**: `/opendelivery-api-schema-validator2/routes`

#### API Endpoints:
- **Validação**: `POST /opendelivery-api-schema-validator2/validate`
- **Compatibilidade**: `POST /opendelivery-api-schema-validator2/compatibility`
- **Certificação**: `POST /opendelivery-api-schema-validator2/certify`
- **Schemas**: `GET /opendelivery-api-schema-validator2/schemas`

#### Testes Manuais dos Endpoints:

**⚡ ROTAS E PARÂMETROS UNIFICADOS - Ambas as implementações usam as mesmas rotas e parâmetros:**

**🔧 Correções Aplicadas:**
- ✅ **Backend Node.js**: Rotas alteradas de `/api/*` para `/opendelivery-api-schema-validator2/*`
- ✅ **Parâmetros**: `schema_version` → `version`, `from_version/to_version` → `fromVersion/toVersion` 
- ✅ **Validação**: Regex corrigido para aceitar todas as versões (incluindo `beta`)
- ✅ **Frontend**: API calls e proxy atualizados, ordem de parâmetros corrigida
- ✅ **Laravel**: Parâmetros padronizados, remoção de fallbacks desnecessários

**Frontend Standalone (Backend Node.js):**
```bash
# Test Health Check
curl "http://localhost:3001/opendelivery-api-schema-validator2/health"

# Test Validation
curl -X POST "http://localhost:3001/opendelivery-api-schema-validator2/validate" \
  -H "Content-Type: application/json" \
  -d '{"version": "1.5.0", "payload": {"version": "1.5.0", "merchant": {"id": "test"}}}'

# Test Compatibility  
curl -X POST "http://localhost:3001/opendelivery-api-schema-validator2/compatibility" \
  -H "Content-Type: application/json" \
  -d '{"fromVersion": "1.5.0", "toVersion": "1.6.0-rc", "payload": {"version": "1.5.0", "merchant": {"id": "test"}}}'

# Test Certification
curl -X POST "http://localhost:3001/opendelivery-api-schema-validator2/certify" \
  -H "Content-Type: application/json" \
  -d '{"version": "1.5.0", "payload": {"version": "1.5.0", "merchant": {"id": "test"}}}'

# Test Schemas
curl "http://localhost:3001/opendelivery-api-schema-validator2/schemas"
```

**Pacote Laravel:**
```bash
# Test Health Check
curl "http://localhost:8010/opendelivery-api-schema-validator2/health"

# Test Validation
curl -X POST "http://localhost:8010/opendelivery-api-schema-validator2/validate" \
  -H "Content-Type: application/json" \
  -d '{"version": "1.5.0", "payload": {"version": "1.5.0", "merchant": {"id": "test"}}}'

# Test Compatibility
curl -X POST "http://localhost:8010/opendelivery-api-schema-validator2/compatibility" \
  -H "Content-Type: application/json" \
  -d '{"fromVersion": "1.5.0", "toVersion": "1.6.0-rc", "payload": {"version": "1.5.0", "merchant": {"id": "test"}}}'

# Test Certification  
curl -X POST "http://localhost:8010/opendelivery-api-schema-validator2/certify" \
  -H "Content-Type: application/json" \
  -d '{"version": "1.5.0", "payload": {"version": "1.5.0", "merchant": {"id": "test"}}}'

# Test Schemas
curl "http://localhost:8010/opendelivery-api-schema-validator2/schemas"
```

**📋 Parâmetros Padronizados (Todos os Endpoints):**
- **Validação**: `{"version": "1.5.0", "payload": {...}}`
- **Compatibilidade**: `{"fromVersion": "1.5.0", "toVersion": "1.6.0-rc", "payload": {...}}`
- **Certificação**: `{"version": "1.5.0", "payload": {...}}`

# Test Validation
curl -X POST "http://localhost:8010/opendelivery-api-schema-validator2/validate" \
  -H "Content-Type: application/json" \
  -d '{"version": "1.5.0", "payload": {"version": "1.5.0", "merchant": {"id": "test"}}}'

# Test Compatibility
curl -X POST "http://localhost:8010/opendelivery-api-schema-validator2/compatibility" \
  -H "Content-Type: application/json" \
  -d '{"fromVersion": "1.5.0", "toVersion": "1.6.0-rc", "payload": {"version": "1.5.0", "merchant": {"id": "test"}}}'
```

### Comandos Úteis

#### Reinstalar Pacote Local
```bash
cd laravel-test-app
composer remove opendelivery/laravel-validator
composer require opendelivery/laravel-validator:dev-main
```

#### Limpar Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Compatibilidade
- **Laravel 10.x**: ✅ Totalmente compatível
- **Laravel 12.x**: ✅ Totalmente compatível
- **PHP 8.1+**: ✅ Laravel 10.x
- **PHP 8.2+**: ✅ Laravel 12.x (Recomendado)
- **MySQL**: 5.7+ ou MariaDB 10.3+

## Resumo de Instalação

### � Preparação para Publicação no Packagist

**Antes de executar `composer require opendelivery/laravel-validator`, certifique-se de que os seguintes arquivos estão incluídos no pacote:**

#### Arquivos/Pastas Obrigatórios:
```bash
packages/opendelivery/laravel-validator/
├── composer.json                    # ✅ Configuração do pacote
├── src/                            # ✅ Código fonte PHP
│   ├── Controllers/
│   ├── Services/
│   ├── Middleware/
│   └── OpenDeliveryServiceProvider.php
├── resources/                      # ✅ Views, assets React buildados
│   ├── views/
│   ├── js/
│   └── css/
├── routes/                         # ✅ Rotas web
├── config/                         # ✅ Arquivo de configuração
├── public/                         # ✅ Assets buildados (crítico!)
│   └── build/
│       ├── assets/
│       │   ├── css-*.css          # Assets CSS compilados
│       │   ├── main-*.js          # Assets JS compilados
│       │   └── ...
│       └── .vite/
│           └── manifest.json      # Manifesto do Vite
└── schemas/                        # ✅ Esquemas YAML OpenDelivery
    ├── 1.0.0.yaml
    ├── 1.0.1.yaml
    └── ...
```

#### ⚠️ CRÍTICO - Build dos Assets Antes da Publicação:
```bash
# 1. Navegar para o pacote
cd packages/opendelivery/laravel-validator

# 2. Instalar dependências
npm install

# 3. Fazer build dos assets React (OBRIGATÓRIO)
npm run build

# 4. Verificar se os assets foram gerados
ls -la public/build/assets/        # Deve conter arquivos CSS e JS
ls -la public/build/.vite/         # Deve conter manifest.json

# 5. Agora o pacote está pronto para ser publicado
```

#### Arquivos que NÃO devem estar no pacote:
```bash
❌ node_modules/          # Dependências npm
❌ vendor/               # Dependências composer para testes
❌ .env                  # Variáveis de ambiente
❌ storage/              # Cache do Laravel
❌ bootstrap/cache/      # Cache do Laravel
❌ *.log                 # Arquivos de log
```

###  Para Usar em Projeto Laravel Existente (Produção)
```bash
composer require opendelivery/laravel-validator
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force
# Acesse: /opendelivery-api-schema-validator2
```

### 🛠️ Para Desenvolvimento do Pacote
```bash
# 1. Setup dos projetos de teste
cd laravel-test-app && composer install
cd ../laravel-12-test-app && composer install

# 2. Build e publicar assets
cd ../packages/opendelivery/laravel-validator && npm install && npm run build
cd ../../../laravel-test-app && php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force
cd ../laravel-12-test-app && php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force

# 3. Iniciar servidores (3 terminais)
# Terminal 1: cd packages/opendelivery/laravel-validator && npm run dev
# Terminal 2: cd laravel-test-app && php artisan serve --host=127.0.0.1 --port=8010
# Terminal 3: cd laravel-12-test-app && php artisan serve --host=127.0.0.1 --port=8012
```

### ⚠️ Troubleshooting CSS 404
Se após publicar views encontrar erro `vendor/opendelivery/css/app.css 404`:
```bash
# Editar: resources/views/vendor/opendelivery/layouts/app.blade.php  
# Remover linha: <link href="{{ asset('vendor/opendelivery/css/app.css') }}" rel="stylesheet">
```

### ✅ Checklist de Pré-Publicação

**Antes de publicar no Packagist, verifique:**

```bash
# 1. Assets buildados estão presentes
ls -la packages/opendelivery/laravel-validator/public/build/assets/
# Deve mostrar: css-*.css e main-*.js

# 2. Manifest do Vite existe
cat packages/opendelivery/laravel-validator/public/build/.vite/manifest.json
# Deve conter entradas para CSS e JS

# 3. Schemas estão presentes (11 arquivos)
ls packages/opendelivery/laravel-validator/schemas/ | wc -l
# Deve mostrar: 11

# 4. Service Provider existe
ls packages/opendelivery/laravel-validator/src/OpenDeliveryServiceProvider.php
# Deve existir

# 5. Teste de instalação local
cd laravel-test-app
composer remove opendelivery/laravel-validator
composer require opendelivery/laravel-validator:dev-main
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force

# 6. Teste de funcionamento
curl http://localhost:8010/opendelivery-api-schema-validator2/health
# Deve retornar: {"status":"healthy",...}
```

### 📦 Estrutura Final do Pacote para Packagist

```
opendelivery/laravel-validator/
├── composer.json                    # Configuração principal
├── README.md                        # Documentação do pacote
├── src/                            # Código fonte PHP (407KB)
├── resources/views/                # Templates Blade
├── routes/web.php                  # Definições de rotas
├── config/opendelivery.php         # Arquivo de configuração
├── public/build/                   # ⚠️ CRÍTICO - Assets buildados
│   ├── assets/
│   │   ├── css-*.css              # 4KB - Estilos compilados
│   │   └── main-*.js              # 483KB - JavaScript compilado
│   └── .vite/manifest.json        # 332B - Manifesto Vite
└── schemas/                        # ⚠️ CRÍTICO - Esquemas OpenDelivery
    ├── 1.0.0.yaml                 # 160KB
    ├── 1.0.1.yaml                 # 176KB  
    ├── 1.1.0.yaml                 # 261KB
    ├── 1.1.1.yaml                 # 262KB
    ├── 1.2.0.yaml                 # 295KB
    ├── 1.2.1.yaml                 # 290KB
    ├── 1.3.0.yaml                 # 291KB
    ├── 1.4.0.yaml                 # 304KB
    ├── 1.5.0.yaml                 # 324KB
    ├── 1.6.0-rc.yaml              # 325KB
    └── beta.yaml                  # 340KB
```

**Tamanho total estimado: ~3.5MB** (principalmente devido aos schemas YAML e assets JS compilados)

## Build para Produção

```bash
# Build completo (backend + frontend)
npm run build:all

# Build apenas frontend
cd frontend && npm run build

# Build apenas backend
cd backend && npm run build
```

### Execução de Testes

#### Testes do Backend
```bash
cd backend
npm test
```

#### Testes do Frontend
```bash
cd frontend
npm test
```

## Endpoints da API

### Validação
- `POST /opendelivery-api-schema-validator2/validate` - Validar payload contra esquema específico
- `POST /opendelivery-api-schema-validator2/compatibility` - Verificar compatibilidade entre versões
- `POST /opendelivery-api-schema-validator2/certify` - Obter certificação OpenDelivery Ready
- `GET /opendelivery-api-schema-validator2/health` - Verificação de saúde do serviço

### Versões Suportadas
- 1.0.0, 1.0.1, 1.1.0, 1.1.1, 1.2.0, 1.2.1, 1.3.0, 1.4.0, 1.5.0, 1.6.0-rc, beta

## Testes Implementados

### Backend
- **Validator Tests**: Testes de validação de alto nível
- **Validation Engine Tests**: Testes da lógica de validação principal
- **Compatibility Checker Tests**: Testes de verificação de compatibilidade

### Frontend
- **TestPayloads Component Tests**: 14 testes abrangentes
- **CompatibilityChecker Tests**: Testes de verificação de autenticidade
- **Cobertura Completa**: Testes de payloads válidos, inválidos e de compatibilidade

## Funcionalidades Especiais

### Payloads de Teste
- **Payloads Válidos**: Exemplos básicos e completos
- **Payloads Inválidos**: Exemplos com erros comuns
- **Payloads de Compatibilidade**: Para teste de migração entre versões

### Verificador de Autenticidade
Ferramenta única que verifica se o validador está usando a API oficial OpenDelivery em todas as versões disponíveis.

### Certificação OpenDelivery Ready
Sistema de certificação com pontuação detalhada e níveis:
- **GOLD**: >= 90 pontos
- **SILVER**: >= 70 pontos  
- **BRONZE**: >= 50 pontos
- **NOT_CERTIFIED**: < 50 pontos

## Documentação

- **[Guia de Suporte](docs/SUPPORT.md)** - Instruções de uso e manutenção
- **[Documentação da API](docs/API.md)** - Referência completa da API

## Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Autor

**Márcio Reck**
- Portfólio: [https://fazmercado.com](https://fazmercado.com)
- GitHub: [@marcioreck](https://github.com/marcioreck)

## Suporte

Para suporte e documentação detalhada, consulte o arquivo [SUPPORT.md](docs/SUPPORT.md).

## Agradecimentos

- **OpenDelivery**: Pelo padrão aberto e documentação oficial
- **Comunidade**: Pelos feedbacks e contribuições
- **Programmers IT**: Pela inspiração do validador original

---

*OpenDelivery API Schema Validator 2 - Desenvolvido por Márcio Reck*
