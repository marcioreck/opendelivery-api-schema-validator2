<?php

// Rotas para OpenDelivery API Schema Validator 2
// Adicione estas rotas no arquivo routes/web.php do Laravel

// Rota principal - redireciona para a pasta public
Route::get('/opendelivery-api-schema-validator2', function () {
    return redirect('/public/opendelivery-api-schema-validator2/');
})->name('opendelivery-api-schema-validator2');

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
        'php_version' => PHP_VERSION
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

// Opcional: Middleware para CORS se necessário
Route::middleware(['web'])->group(function () {
    // As rotas acima já estão no grupo web por padrão
});

/* 
INSTRUÇÕES DE USO:

1. Copie este conteúdo para o arquivo routes/web.php do Laravel
2. Teste o health check: curl https://fazmercado.com/opendelivery-api-schema-validator2/api/health
3. Acesse a aplicação: https://fazmercado.com/opendelivery-api-schema-validator2

CONFIGURAÇÃO ADICIONAL OPCIONAL:

Se quiser proxy para um backend Express real:

use Illuminate\Support\Facades\Http;

Route::prefix('opendelivery-api-schema-validator2/api')->group(function () {
    Route::any('{path}', function ($path) {
        $backendUrl = 'http://localhost:3001/api/' . $path;
        
        try {
            $method = strtolower(request()->method());
            $response = Http::timeout(30)->$method($backendUrl, request()->all());
            
            return response($response->body(), $response->status())
                ->header('Content-Type', $response->header('Content-Type'));
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Backend service unavailable',
                'message' => $e->getMessage(),
                'timestamp' => now()->toISOString()
            ], 503);
        }
    })->where('path', '.*');
});
*/
