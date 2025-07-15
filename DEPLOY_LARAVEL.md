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
// Rota principal - redireciona para a pasta public
Route::get('/opendelivery-api-schema-validator2', function () {
    return redirect('/public/opendelivery-api-schema-validator2/');
})->name('opendelivery-api-schema-validator2');

// Rotas da API - proxy para o backend Express
Route::prefix('opendelivery-api-schema-validator2/api')->group(function () {
    Route::get('health', function () {
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toISOString(),
            'service' => 'OpenDelivery API Schema Validator 2',
            'version' => '2.0.0',
            'environment' => 'production',
            'note' => 'Static API response - backend not required for basic health check'
        ]);
    });
    
    // Outras rotas da API (se backend estiver disponível)
    Route::any('{path}', function ($path) {
        // Proxy para o backend Express se estiver rodando
        $backendUrl = 'http://localhost:3001/api/' . $path;
        
        try {
            $response = Http::timeout(10)->get($backendUrl, request()->all());
            return response($response->body(), $response->status())
                ->header('Content-Type', $response->header('Content-Type'));
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Backend API not available',
                'message' => 'The backend service is not running or not accessible',
                'timestamp' => now()->toISOString()
            ], 503);
        }
    })->where('path', '.*');
});
```

**Alternativa mais simples (sem backend)**:
```php
// Apenas a rota principal
Route::get('/opendelivery-api-schema-validator2', function () {
    return redirect('/public/opendelivery-api-schema-validator2/');
})->name('opendelivery-api-schema-validator2');

// Health check simples
Route::get('/opendelivery-api-schema-validator2/api/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'service' => 'OpenDelivery API Schema Validator 2',
        'version' => '2.0.0',
        'environment' => 'production',
        'mode' => 'frontend-only'
    ]);
});
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

O endpoint `/api/health` retorna informações sobre o status do serviço:

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
  "mode": "frontend-only"
}
```

**Se o backend Express estiver rodando**:
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
- `mode: "frontend-only"` = Apenas frontend, sem backend
- `uptime` = Tempo que o serviço está rodando (apenas com backend)
- `memory` = Uso de memória do processo (apenas com backend)
- `schemas.count` = Quantidade de esquemas disponíveis (apenas com backend)

### Logs e Monitoramento

- Logs do backend: pasta `/api/logs/`
- Status do serviço: `ps aux | grep node`
- Reiniciar: `cd /api && ./start-production.sh`

### Resolução de Problemas Comuns

#### 1. Erro 404 na rota `/api/health`

**Problema**: `https://fazmercado.com/opendelivery-api-schema-validator2/api/health` retorna 404

**Causa**: A rota da API não está configurada no Laravel

**Solução**: Adicione as rotas da API no arquivo `routes/web.php`:

```php
// Health check básico
Route::get('/opendelivery-api-schema-validator2/api/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'service' => 'OpenDelivery API Schema Validator 2',
        'version' => '2.0.0',
        'environment' => 'production',
        'mode' => 'frontend-only'
    ]);
});

// Outras rotas da API (opcional)
Route::prefix('opendelivery-api-schema-validator2/api')->group(function () {
    Route::get('validate', function () {
        return response()->json(['error' => 'Backend not configured'], 503);
    });
    
    Route::get('compatibility', function () {
        return response()->json(['error' => 'Backend not configured'], 503);
    });
    
    Route::get('certify', function () {
        return response()->json(['error' => 'Backend not configured'], 503);
    });
});
```

**Teste**: Após adicionar as rotas, teste novamente:
```bash
curl https://fazmercado.com/opendelivery-api-schema-validator2/api/health
```

#### 2. Erro 404 nos arquivos CSS/JS (assets)

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

#### 3. Content Security Policy (CSP)

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

#### 4. Erro 404 no favicon.svg

**Solução**: Verificar se o arquivo existe em:
```
public/opendelivery-api-schema-validator2/favicon.svg
```

Se não existir, copiar de `frontend/public/favicon.svg`

#### 5. API não responde

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
