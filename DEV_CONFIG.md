# Configurações do Ambiente de Desenvolvimento

## Laravel Test App - Configuração MySQL

### Configuração do .env
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_opendelivery_test
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

### Endpoints Funcionais
- **Laravel 10**: http://localhost:8010/opendelivery-api-schema-validator2
- **Laravel 12**: http://localhost:8012/opendelivery-api-schema-validator2
- **Frontend Standalone:** http://localhost:8000/

**Endpoints disponíveis:**
- Health: /opendelivery-api-schema-validator2/health
- Dashboard: /opendelivery-api-schema-validator2/dashboard
- Validate: POST /opendelivery-api-schema-validator2/validate
- Compatibility: POST /opendelivery-api-schema-validator2/compatibility
- Certify: POST /opendelivery-api-schema-validator2/certify
- Schemas: GET /opendelivery-api-schema-validator2/schemas

**Testes manuais:**
```bash
# Test Health Check
curl "http://localhost:8010/opendelivery-api-schema-validator2/health"

# Test Validation
curl -X POST "http://localhost:8010/opendelivery-api-schema-validator2/validate" \
  -H "Content-Type: application/json" \
  -d '{"schema": "1.6.0", "payload": {"version": "1.6.0", "merchant": {"id": "test"}}}'

# Test Compatibility (corrigido)
curl -X POST "http://localhost:8010/opendelivery-api-schema-validator2/compatibility" \
  -H "Content-Type: application/json" \
  -d '{"fromVersion": "1.5.0", "toVersion": "1.6.0", "payload": {"version": "1.5.0", "merchant": {"id": "test"}}}'
```

## Pacote Laravel - Compatibilidade

### Versões Suportadas
- **Laravel**: 10.x, 11.x, 12.x
- **PHP**: 8.1+ (compatível com Laravel 10.x), 8.2+ (Laravel 12.x)
- **MySQL**: 5.7+ ou MariaDB 10.3+

### Ambiente de Produção (FazMercado)
- Laravel Framework: 10.48.29
- PHP: 8.1+
- MySQL: Configurado

### Instalação do Pacote

#### Para Produção
```bash
composer require opendelivery/laravel-validator
```

#### Para Desenvolvimento Local
Configure o `composer.json` dos projetos de teste:

**Laravel 10 (laravel-test-app):**
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

**Laravel 12 (laravel-12-test-app):**
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

### Configuração Local para Desenvolvimento
```json
{
  "repositories": [
    {
      "type": "path",
      "url": "../packages/opendelivery/laravel-validator"
    }
  ],
  "require": {
    "opendelivery/laravel-validator": "dev-main"
  }
}
```

## Comandos Úteis

### Sequência Completa de Setup
```bash
# 1. Instalar dependências dos projetos Laravel
cd laravel-test-app && composer install
cd ../laravel-12-test-app && composer install

# 2. Build dos assets React do pacote
cd ../packages/opendelivery/laravel-validator
npm install
npm run build

# 3. Publicar assets buildados
cd ../../../laravel-test-app
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force

cd ../laravel-12-test-app  
php artisan vendor:publish --provider="OpenDelivery\\LaravelValidator\\OpenDeliveryServiceProvider" --tag=opendelivery-assets --force

# 4. Executar migrações (se necessário)
cd ../laravel-test-app && php artisan migrate --force
cd ../laravel-12-test-app && php artisan migrate --force

# 5. Iniciar servidores
cd ../laravel-test-app && php artisan serve --host=127.0.0.1 --port=8010 &
cd ../laravel-12-test-app && php artisan serve --host=127.0.0.1 --port=8012 &
```

### Reinstalar Pacote Local
```bash
cd laravel-test-app
composer remove opendelivery/laravel-validator
composer require opendelivery/laravel-validator:dev-main
```

### Limpar Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Executar Migrações
```bash
php artisan migrate
```
