# Deploy para Laravel - fazmercado.com

## Estrutura de Deploy

O projeto foi configurado para funcionar perfeitamente com a estrutura do Laravel em `fazmercado.com`. A aplicação completa fica em uma única pasta que é servida pela rota Laravel.

### Estrutura no Servidor Laravel

```
/path/to/fazmercado.com/
├── public/
│   └── opendelivery-api-schema-validator2/     # Aplicação completa
│       ├── index.html                          # Frontend (raiz)
│       ├── assets/                             # CSS/JS do frontend
│       │   ├── index-*.js
│       │   ├── vendor-*.js
│       │   └── ui-*.js
│       └── api/                               # Backend API
│           ├── index.js                       # Servidor Express
│           ├── package.json
│           ├── node_modules/
│           ├── schemas/                       # Esquemas OpenDelivery
│           ├── .env.production
│           └── start-production.sh
```

### URLs de Acesso

- **Frontend**: `https://fazmercado.com/opendelivery-api-schema-validator2/`
- **Backend API**: `https://fazmercado.com/opendelivery-api-schema-validator2/api/`

### Configuração da Rota Laravel

No arquivo `routes/web.php` do Laravel, configure:

```php
Route::get('/opendelivery-api-schema-validator2/{any?}', function () {
    return view('opendelivery-validator');
})->where('any', '.*');
```

E crie uma view que serve o `index.html` da aplicação:

```php
// resources/views/opendelivery-validator.blade.php
<!DOCTYPE html>
<html>
<head>
    <title>OpenDelivery API Schema Validator 2</title>
    <base href="/opendelivery-api-schema-validator2/">
</head>
<body>
    {!! file_get_contents(public_path('opendelivery-api-schema-validator2/index.html')) !!}
</body>
</html>
```

### Processo de Deploy

1. **Build Local**: Execute `./deploy.sh` no projeto
2. **Upload**: Copie `deploy/public/opendelivery-api-schema-validator2/` para o servidor
3. **Configuração**: Configure o backend na pasta `/api/`
4. **Inicialização**: Execute `start-production.sh` para iniciar a API

### Deploy Automático via GitHub Actions

O arquivo `.github/workflows/deploy.yml` está configurado para:

1. Fazer build do frontend e backend
2. Criar estrutura unificada
3. Fazer upload via SSH para o servidor
4. Instalar dependências do backend
5. Reiniciar o serviço

### Secrets do GitHub Actions

Configure no GitHub (Settings > Secrets and variables > Actions):

- `SSH_HOST`: fazmercado.com
- `SSH_USER`: usuário do servidor
- `SSH_KEY`: chave privada SSH
- `TARGET_DIR`: `/path/to/fazmercado.com/public/opendelivery-api-schema-validator2`

### Configuração do Backend

O backend Express está configurado para:

- Porta: 3001
- CORS: https://fazmercado.com
- Frontend URL: https://fazmercado.com/opendelivery-api-schema-validator2

### Verificação de Funcionamento

1. **Frontend**: Acesse `https://fazmercado.com/opendelivery-api-schema-validator2/`
2. **API Health**: Teste `https://fazmercado.com/opendelivery-api-schema-validator2/api/health`
3. **Validação**: Teste via interface ou diretamente na API

#### Testando o Health Check

O endpoint `/api/health` retorna informações detalhadas sobre o status do serviço:

```bash
curl https://fazmercado.com/opendelivery-api-schema-validator2/api/health
```

**Resposta esperada (200 OK)**:
```json
{
  "status": "healthy",
  "timestamp": "2025-07-15T10:30:00.000Z",
  "service": "OpenDelivery API Schema Validator 2",
  "version": "2.0.0",
  "environment": "production",
  "uptime": {
    "seconds": 3600,
    "human": "1h 0m 0s"
  },
  "memory": {
    "used": "45 MB",
    "total": "67 MB",
    "external": "12 MB"
  },
  "schemas": {
    "available": ["1.0.0", "1.0.1", "1.1.0", "1.1.1", "1.2.0", "1.2.1", "1.3.0", "1.4.0", "1.5.0", "1.6.0-rc", "beta"],
    "count": 11
  },
  "endpoints": {
    "validate": "/api/validate",
    "compatibility": "/api/compatibility",
    "certify": "/api/certify",
    "health": "/api/health"
  }
}
```

**Interpretação da Resposta**:
- `status: "healthy"` = Serviço funcionando normalmente
- `status: "unhealthy"` = Serviço com problemas
- `uptime` = Tempo que o serviço está rodando
- `memory` = Uso de memória do processo
- `schemas.count` = Quantidade de esquemas disponíveis
- `endpoints` = Lista de endpoints disponíveis

### Logs e Monitoramento

- Logs do backend: pasta `/api/logs/`
- Status do serviço: `ps aux | grep node`
- Reiniciar: `cd /api && ./start-production.sh`

### Resolução de Problemas Comuns

#### 1. Erro 404 nos arquivos CSS/JS (assets)

Se os arquivos `vendor-*.js`, `ui-*.js`, `index-*.js` retornarem 404:

**Solução A - Configurar .htaccess** (recomendado):
```apache
# No arquivo public/opendelivery-api-schema-validator2/.htaccess
RewriteEngine On
RewriteBase /opendelivery-api-schema-validator2/

# Servir arquivos estáticos diretamente
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^.*$ - [L]

# Fallback para o Laravel para outras rotas
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^.*$ /index.php [L]
```

**Solução B - Configurar Laravel**:
```php
// routes/web.php
Route::get('/opendelivery-api-schema-validator2/assets/{file}', function ($file) {
    $path = public_path('opendelivery-api-schema-validator2/assets/' . $file);
    if (file_exists($path)) {
        return response()->file($path);
    }
    abort(404);
})->where('file', '.*');
```

#### 2. Content Security Policy (CSP)

Se aparecer erro de CSP bloqueando fontes ou scripts:

**Solução**: Adicionar meta tag no `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self'; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  img-src 'self' data: https:;
">
```

#### 3. Erro 404 no favicon.svg

**Solução**: Verificar se o arquivo existe em:
```
public/opendelivery-api-schema-validator2/favicon.svg
```

Se não existir, copiar de `frontend/public/favicon.svg`

#### 4. API não responde

**Verificar**:
1. Backend rodando: `ps aux | grep node`
2. Porta 3001 aberta: `netstat -tlnp | grep 3001`
3. Logs do backend: `tail -f /api/logs/error.log`

**Reiniciar**:
```bash
cd /path/to/public/opendelivery-api-schema-validator2/api
./start-production.sh
```

---

Esta configuração permite que a aplicação funcione como uma aplicação isolada dentro do framework Laravel, similar ao validador oficial em `https://programmersit.github.io/opendelivery-api-schema-validator/`.
