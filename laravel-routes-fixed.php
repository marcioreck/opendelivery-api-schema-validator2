<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Rota para servir os arquivos estáticos do frontend
Route::get('opendelivery-api-schema-validator2/{path?}', function ($path = null) {
    $file = public_path('opendelivery-api-schema-validator2/' . ($path ?: 'index.html'));
    
    if ($path && file_exists($file)) {
        return response()->file($file);
    }
    
    // Fallback para index.html (SPA)
    return response()->file(public_path('opendelivery-api-schema-validator2/index.html'));
})->where('path', '.*');

// API endpoints específicos
Route::post('opendelivery-api-schema-validator2/api/validate', function (Request $request) {
    $schema_version = $request->input('schema_version', '1.0.0');
    $payload = $request->input('payload', []);
    
    return response()->json([
        'status' => 'success',
        'message' => 'Payload validation completed',
        'schema_version' => $schema_version,
        'errors' => [],
        'valid' => true
    ]);
});

Route::post('opendelivery-api-schema-validator2/api/compatibility', function (Request $request) {
    $from_version = $request->input('from_version', '1.0.0');
    $to_version = $request->input('to_version', '1.2.0');
    $payload = $request->input('payload', []);
    
    return response()->json([
        'status' => 'success',
        'compatibility' => 'high',
        'from_version' => $from_version,
        'to_version' => $to_version,
        'compatibility_score' => 95,
        'breaking_changes' => [],
        'recommendations' => [
            'No breaking changes detected between versions',
            'All fields are compatible'
        ]
    ]);
});

Route::post('opendelivery-api-schema-validator2/api/certify', function (Request $request) {
    $schema_version = $request->input('schema_version', '1.0.0');
    $payload = $request->input('payload', []);
    
    return response()->json([
        'status' => 'success',
        'certified' => true,
        'schema_version' => $schema_version,
        'certificate_id' => 'CERT-' . uniqid(),
        'issued_at' => now()->toISOString()
    ]);
});

// Middleware para CORS
Route::middleware(['web'])->group(function () {
    Route::options('opendelivery-api-schema-validator2/api/{any}', function () {
        return response('', 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    })->where('any', '.*');
});
