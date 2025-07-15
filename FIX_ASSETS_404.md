# CORREÇÃO URGENTE - 404 nos Assets

## Problema
Os assets estão sendo buscados em `/opendelivery-api-schema-validator2/assets/` mas estão fisicamente em `/public/opendelivery-api-schema-validator2/assets/`.

## Solução Rápida

### 1. Atualize o arquivo `routes/web.php` do Laravel

**Substitua todo o conteúdo relacionado ao OpenDelivery por:**

```php
// Rota principal - redireciona para a pasta public
Route::get('/opendelivery-api-schema-validator2', function () {
    return redirect('/public/opendelivery-api-schema-validator2/');
})->name('opendelivery-api-schema-validator2');

// Servir assets diretamente - IMPORTANTE para resolver 404s
Route::get('/opendelivery-api-schema-validator2/assets/{file}', function ($file) {
    $path = public_path('opendelivery-api-schema-validator2/assets/' . $file);
    
    if (!file_exists($path)) {
        abort(404);
    }
    
    $mimeType = mime_content_type($path);
    $extension = pathinfo($file, PATHINFO_EXTENSION);
    
    // Definir tipos MIME corretos
    $mimeTypes = [
        'js' => 'application/javascript',
        'css' => 'text/css',
        'ttf' => 'font/ttf',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'ico' => 'image/x-icon'
    ];
    
    $contentType = $mimeTypes[$extension] ?? $mimeType;
    
    return response()
        ->file($path, [
            'Content-Type' => $contentType,
            'Cache-Control' => 'public, max-age=31536000, immutable',
            'Expires' => gmdate('D, d M Y H:i:s \G\M\T', time() + 31536000)
        ]);
})->where('file', '.*');

// Servir favicon.svg
Route::get('/opendelivery-api-schema-validator2/favicon.svg', function () {
    $path = public_path('opendelivery-api-schema-validator2/favicon.svg');
    
    if (!file_exists($path)) {
        abort(404);
    }
    
    return response()
        ->file($path, [
            'Content-Type' => 'image/svg+xml',
            'Cache-Control' => 'public, max-age=31536000, immutable'
        ]);
});

// Servir index.html quando acessado diretamente ou para rotas SPA
Route::get('/opendelivery-api-schema-validator2/{path?}', function ($path = null) {
    $indexPath = public_path('opendelivery-api-schema-validator2/index.html');
    
    if (!file_exists($indexPath)) {
        abort(404, 'Application not found. Please deploy the frontend first.');
    }
    
    return response()
        ->file($indexPath, [
            'Content-Type' => 'text/html',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0'
        ]);
})->where('path', '.*');

// API Health Check - sempre disponível
Route::get('/opendelivery-api-schema-validator2/api/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'service' => 'OpenDelivery API Schema Validator 2',
        'version' => '2.0.0',
        'environment' => config('app.env', 'production'),
        'mode' => 'frontend-only',
        'laravel_version' => app()->version(),
        'php_version' => PHP_VERSION,
        'note' => 'Assets served via Laravel routes to avoid 404 errors'
    ]);
});

// Rotas da API - retornam erro 503 se backend não estiver configurado
Route::prefix('opendelivery-api-schema-validator2/api')->group(function () {
    
    // Validação de payload
    Route::post('validate', function () {
        return response()->json([
            'error' => 'Backend not configured',
            'message' => 'The validation service requires a backend server to be configured',
            'timestamp' => now()->toISOString()
        ], 503);
    });
    
    // Verificação de compatibilidade
    Route::post('compatibility', function () {
        return response()->json([
            'error' => 'Backend not configured',
            'message' => 'The compatibility service requires a backend server to be configured',
            'timestamp' => now()->toISOString()
        ], 503);
    });
    
    // Certificação
    Route::post('certify', function () {
        return response()->json([
            'error' => 'Backend not configured',
            'message' => 'The certification service requires a backend server to be configured',
            'timestamp' => now()->toISOString()
        ], 503);
    });
    
    // Listar schemas disponíveis
    Route::get('schemas', function () {
        return response()->json([
            'schemas' => [
                '1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', 
                '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta'
            ],
            'count' => 11,
            'note' => 'Schema list is static - backend required for validation',
            'timestamp' => now()->toISOString()
        ]);
    });
    
    // Fallback para outras rotas da API
    Route::any('{path}', function ($path) {
        return response()->json([
            'error' => 'Endpoint not found',
            'path' => $path,
            'message' => 'This API endpoint is not configured or requires a backend server',
            'available_endpoints' => [
                'GET /api/health',
                'GET /api/schemas',
                'POST /api/validate',
                'POST /api/compatibility',
                'POST /api/certify'
            ],
            'timestamp' => now()->toISOString()
        ], 404);
    })->where('path', '.*');
});
```

### 2. Copie o novo build para o servidor

```bash
# Copie o conteúdo de frontend/dist/* para:
# /var/www/html/public/opendelivery-api-schema-validator2/
```

### 3. Teste

**Abra o navegador e acesse:**
- https://fazmercado.com/opendelivery-api-schema-validator2

**Os assets devem agora carregar corretamente:**
- ✅ `/opendelivery-api-schema-validator2/assets/index-BDcncAON.js`
- ✅ `/opendelivery-api-schema-validator2/assets/ui-D4YkUuFg.js`
- ✅ `/opendelivery-api-schema-validator2/assets/monaco-CkAvZSel.css`
- ✅ `/opendelivery-api-schema-validator2/assets/vendor-D9s9tBNk.js`
- ✅ `/opendelivery-api-schema-validator2/assets/monaco-CRHfge2T.js`

## Como Funciona

1. **Rota principal**: `/opendelivery-api-schema-validator2` → redireciona para `/public/opendelivery-api-schema-validator2/`
2. **Rotas de assets**: `/opendelivery-api-schema-validator2/assets/{file}` → serve arquivo de `public/opendelivery-api-schema-validator2/assets/{file}`
3. **Favicon**: `/opendelivery-api-schema-validator2/favicon.svg` → serve `public/opendelivery-api-schema-validator2/favicon.svg`
4. **SPA routing**: `/opendelivery-api-schema-validator2/{path}` → serve sempre o `index.html`
5. **API**: `/opendelivery-api-schema-validator2/api/*` → responde com dados mock

## Resultado Esperado

- ✅ Aplicação carrega sem erros 404
- ✅ Assets CSS/JS carregam corretamente
- ✅ Favicon carrega corretamente
- ✅ API health retorna 200
- ✅ Navegação React funciona
- ⚠️ Script externo wsimg.com pode ainda dar aviso de CSP (mas não afeta funcionamento)

## Verificação

Execute o teste automatizado:
```bash
./test-routes.sh
```

Ou teste manualmente:
```bash
curl -I https://fazmercado.com/opendelivery-api-schema-validator2/assets/index-BDcncAON.js
curl -I https://fazmercado.com/opendelivery-api-schema-validator2/api/health
```

Ambos devem retornar 200 OK.
