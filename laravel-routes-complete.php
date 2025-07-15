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
    $backendUrl = env('OPENDELIVERY_BACKEND_URL', 'http://localhost:3001');
    $url = $backendUrl . '/api/validate';
    
    $client = new \GuzzleHttp\Client();
    
    try {
        $response = $client->request('POST', $url, [
            'json' => $request->all(),
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json'
            ]
        ]);
        
        return response($response->getBody())
            ->header('Content-Type', 'application/json')
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Backend validation service unavailable',
            'message' => 'Unable to connect to validation backend',
            'timestamp' => now()->toISOString()
        ], 503)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
});

// API: Verificar compatibilidade
Route::post('opendelivery-api-schema-validator2/api/compatibility', function (Request $request) {
    $backendUrl = env('OPENDELIVERY_BACKEND_URL', 'http://localhost:3001');
    $url = $backendUrl . '/api/compatibility';
    
    $client = new \GuzzleHttp\Client();
    
    try {
        $response = $client->request('POST', $url, [
            'json' => $request->all(),
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json'
            ]
        ]);
        
        return response($response->getBody())
            ->header('Content-Type', 'application/json')
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Backend compatibility service unavailable',
            'message' => 'Unable to connect to compatibility backend',
            'timestamp' => now()->toISOString()
        ], 503)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
});

// API: Certificar payload
Route::post('opendelivery-api-schema-validator2/api/certify', function (Request $request) {
    $backendUrl = env('OPENDELIVERY_BACKEND_URL', 'http://localhost:3001');
    $url = $backendUrl . '/api/certify';
    
    $client = new \GuzzleHttp\Client();
    
    try {
        $response = $client->request('POST', $url, [
            'json' => $request->all(),
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json'
            ]
        ]);
        
        return response($response->getBody())
            ->header('Content-Type', 'application/json')
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Backend certification service unavailable',
            'message' => 'Unable to connect to certification backend',
            'timestamp' => now()->toISOString()
        ], 503)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
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
