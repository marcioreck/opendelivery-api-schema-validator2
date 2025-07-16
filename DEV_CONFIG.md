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

# Dar permissões
sudo mysql -u root -p -e "GRANT ALL PRIVILEGES ON laravel_opendelivery_test.* TO 'laravel'@'localhost';"
sudo mysql -u root -p -e "FLUSH PRIVILEGES;"
```

### Servidores de Desenvolvimento
```bash
# Laravel 10.x (compatibilidade produção) - PORTA 8010
cd laravel-test-app
php artisan serve --port=8010

# Laravel 12.x (desenvolvimento) - PORTA 8012
cd laravel-12-test-app
php artisan serve --port=8012

# Frontend standalone
cd frontend
npm run dev  # porta 8000
```

### Endpoints Funcionais
- **Laravel 10.x:** http://localhost:8010/opendelivery/
- **Laravel 12.x:** http://localhost:8012/opendelivery/
- **Frontend:** http://localhost:8000/

**Endpoints disponíveis:**
- Health: /opendelivery/health
- Dashboard: /opendelivery/dashboard
- Validate: /opendelivery/validate (POST)
- Compatibility: /opendelivery/compatibility (POST)
- Certify: /opendelivery/certify (POST)

### Teste com curl
```bash
# Validação Laravel v10
curl -X POST http://localhost:8010/opendelivery/validate \
  -H "Content-Type: application/json" \
  -d '{"payload": {"order": {"id": "ORD-12345"}}, "schema_version": "1.5.0"}'

# Validação Laravel v12
curl -X POST http://localhost:8012/opendelivery/validate \
  -H "Content-Type: application/json" \
  -d '{"payload": {"order": {"id": "ORD-12345"}}, "schema_version": "1.5.0"}'
```
- Validate: POST /opendelivery/validate
- Compatibility: POST /opendelivery/compatibility
- Certify: POST /opendelivery/certify

## Pacote Laravel - Compatibilidade

### Versões Suportadas
- **Laravel**: 10.x, 11.x, 12.x
- **PHP**: 8.1+ (compatível com Laravel 10.x)
- **MySQL**: 5.7+ ou MariaDB 10.3+

### Ambiente de Produção (FazMercado)
- Laravel Framework: 10.48.29
- PHP: 8.1+
- MySQL: Configurado

### Instalação do Pacote
```bash
composer require opendelivery/laravel-validator
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
