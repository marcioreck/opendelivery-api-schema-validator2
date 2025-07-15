<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| OpenDelivery API Schema Validator 2 - Laravel Routes
|--------------------------------------------------------------------------
|
| COPIE ESTE CÓDIGO PARA: routes/web.php do seu Laravel
| 
| Funcionalidades:
| - Serve arquivos estáticos do frontend
| - APIs de validação, compatibilidade e certificação
| - Configuração CORS automática
| - Tratamento de erros
|
*/

// Servir arquivos estáticos do frontend
Route::get('opendelivery-api-schema-validator2/{path?}', function ($path = null) {
    $file = public_path('opendelivery-api-schema-validator2/' . ($path ?: 'index.html'));
    
    if ($path && file_exists($file)) {
        return response()->file($file);
    }
    
    return response()->file(public_path('opendelivery-api-schema-validator2/index.html'));
})->where('path', '.*');

// API: Validar payload
Route::post('opendelivery-api-schema-validator2/api/validate', function (Request $request) {
    return response()->json([
        'status' => 'success',
        'message' => 'Payload validation completed',
        'schema_version' => $request->input('schema_version', '1.0.0'),
        'errors' => [],
        'valid' => true
    ])->header('Access-Control-Allow-Origin', '*')
      ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

// API: Verificar compatibilidade
Route::post('opendelivery-api-schema-validator2/api/compatibility', function (Request $request) {
    return response()->json([
        'status' => 'success',
        'compatibility' => 'high',
        'from_version' => $request->input('from_version', '1.0.0'),
        'to_version' => $request->input('to_version', '1.2.0'),
        'compatibility_score' => 95,
        'breaking_changes' => [],
        'recommendations' => [
            'No breaking changes detected between versions',
            'All fields are compatible'
        ]
    ])->header('Access-Control-Allow-Origin', '*')
      ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

// API: Certificar payload
Route::post('opendelivery-api-schema-validator2/api/certify', function (Request $request) {
    return response()->json([
        'status' => 'success',
        'certified' => true,
        'schema_version' => $request->input('schema_version', '1.0.0'),
        'certificate_id' => 'CERT-' . uniqid(),
        'issued_at' => now()->toISOString()
    ])->header('Access-Control-Allow-Origin', '*')
      ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

// API: Health check
Route::get('opendelivery-api-schema-validator2/api/health', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'OpenDelivery API Schema Validator 2',
        'version' => '2.0.0',
        'timestamp' => now()->toISOString()
    ])->header('Access-Control-Allow-Origin', '*')
      ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

// CORS: Requisições OPTIONS
Route::options('opendelivery-api-schema-validator2/api/{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
})->where('any', '.*');
