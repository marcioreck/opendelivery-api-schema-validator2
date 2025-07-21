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

### Laravel Package URLs:
- **Laravel 10**: http://localhost:8010/opendelivery-api-schema-validator2
- **Laravel 12**: http://localhost:8012/opendelivery-api-schema-validator2

## Laravel Test App - Configuração MySQL

### Configuração do .env
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_opendelivery_test
# DB_DATABASE=laravel_opendelivery_test_v12 # for the other Laravel version
DB_USERNAME=laravel
DB_PASSWORD=laravel123
```

### Comandos para configurar MySQL (se necessário)
```bash
# Criar usuário MySQL
sudo mysql -u root -p -e "CREATE USER 'laravel'@'localhost' IDENTIFIED BY 'laravel123';"

# Criar banco de dados
sudo mysql -u root -p -e "CREATE DATABASE laravel_opendelivery_test;"
sudo mysql -u root -p -e "CREATE DATABASE laravel_opendelivery_test_v12;"

# Dar permissões
sudo mysql -u root -p -e "GRANT ALL PRIVILEGES ON laravel_opendelivery_test.* TO 'laravel'@'localhost';"
sudo mysql -u root -p -e "GRANT ALL PRIVILEGES ON laravel_opendelivery_test_v12.* TO 'laravel'@'localhost';"
sudo mysql -u root -p -e "FLUSH PRIVILEGES;"
```

### Servidores de Desenvolvimento
```bash
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
```bash
composer require opendelivery/laravel-validator
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

#### Comandos de Instalação
```bash
# Laravel 10
cd laravel-test-app
composer install

# Laravel 12  
cd ../laravel-12-test-app
composer install
```

#### Build dos Assets React
```bash
# Fazer build dos assets React do pacote
cd ../packages/opendelivery/laravel-validator
npm install
npm run build

# Publicar assets buildados nos projetos Laravel
cd ../../../laravel-test-app
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force

cd ../laravel-12-test-app
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force
```

### Publicação dos Assets

```bash
# Publicar assets (JS, CSS, imagens)
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets

# Publicar views
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-views

# Publicar configuração
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-config
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

### Compatibilidade
- **Laravel 10.x**: ✅ Totalmente compatível
- **Laravel 12.x**: ✅ Totalmente compatível
- **PHP 8.2+**: ✅ Recomendado

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
- `POST /validate` - Validar payload contra esquema específico
- `POST /compatibility` - Verificar compatibilidade entre versões
- `POST /certify` - Obter certificação OpenDelivery Ready
- `GET /health` - Verificação de saúde do serviço

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
