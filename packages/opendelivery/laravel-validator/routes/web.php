<?php

use Illuminate\Support\Facades\Route;
use OpenDelivery\LaravelValidator\Controllers\ValidateController;

// Main routes with opendelivery-api-schema-validator2 prefix
Route::prefix('opendelivery-api-schema-validator2')->group(function () {
    // API Endpoints
    Route::post('/validate', [ValidateController::class, 'validate'])->name('opendelivery.validate');
    Route::post('/compatibility', [ValidateController::class, 'compatibility'])->name('opendelivery.compatibility');
    Route::post('/certify', [ValidateController::class, 'certify'])->name('opendelivery.certify');
    
    // Health Check
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'service' => 'OpenDelivery API Schema Validator 2',
            'version' => '2.0.0',
            'timestamp' => now()->toISOString()
        ]);
    })->name('opendelivery.health');
    
    // User Interfaces
    Route::get('/blade', function () {
        return view('opendelivery::dashboard');
    })->name('opendelivery.blade');
    
    Route::get('/react', function () {
        return view('opendelivery::react-dashboard');
    })->name('opendelivery.react');
    
    Route::get('/routes', function () {
        return view('opendelivery::routes');
    })->name('opendelivery.routes');
    
    // Default route redirects to React
    Route::get('/', function () {
        return view('opendelivery::react-dashboard');
    })->name('opendelivery.index');
    
    // API route to get schema versions
    Route::get('/schemas', function () {
        return response()->json([
            [
                'version' => '1.6.0',
                'name' => 'Latest Stable',
                'description' => 'Current stable version',
                'releaseDate' => '2024-01-15',
                'status' => 'stable',
                'isDefault' => true
            ],
            [
                'version' => '1.5.0',
                'name' => 'Previous Stable',
                'description' => 'Previous stable version',
                'releaseDate' => '2023-12-01',
                'status' => 'stable',
                'isDefault' => false
            ],
            [
                'version' => '1.6.0-rc',
                'name' => 'Release Candidate',
                'description' => 'Pre-release version',
                'releaseDate' => '2024-01-01',
                'status' => 'beta',
                'isDefault' => false
            ],
        ]);
    })->name('opendelivery.schemas');
});
