<?php

use Illuminate\Support\Facades\Route;
use OpenDelivery\LaravelValidator\Controllers\ValidateController;
use OpenDelivery\LaravelValidator\Services\SchemaManager;

// Main routes with opendelivery-api-schema-validator2 prefix
Route::prefix('opendelivery-api-schema-validator2')->group(function () {
    // API Endpoints with manual CORS support
    Route::match(['GET', 'POST', 'OPTIONS'], '/validate', [ValidateController::class, 'validate'])->name('opendelivery.validate');
    Route::match(['GET', 'POST', 'OPTIONS'], '/compatibility', [ValidateController::class, 'compatibility'])->name('opendelivery.compatibility');
    Route::match(['GET', 'POST', 'OPTIONS'], '/certify', [ValidateController::class, 'certify'])->name('opendelivery.certify');
    
    // Schema versions endpoint
    Route::get('/schemas', function () {
        $schemaManager = app(SchemaManager::class);
        $versions = $schemaManager->getAvailableVersions();
        
        $schemaList = [];
        foreach ($versions as $version) {
            $status = 'stable';
            $name = "Version {$version}";
            $description = "OpenDelivery API Schema {$version}";
            
            // Special cases for specific versions
            if ($version === 'beta') {
                $status = 'beta';
                $name = 'Beta Version';
                $description = 'Latest beta features';
            } elseif (strpos($version, 'rc') !== false) {
                $status = 'beta';
                $name = 'Release Candidate';
                $description = 'Pre-release version';
            } elseif ($version === '1.6.0-rc' || $version === 'beta') {
                $status = 'beta';
            }
            
            $schemaList[] = [
                'version' => $version,
                'name' => $name,
                'description' => $description,
                'releaseDate' => $version === '1.6.0-rc' ? '2024-01-01' : '2024-01-15',
                'status' => $status,
                'isDefault' => $version === '1.5.0' // Default to stable version
            ];
        }
        
        return response()->json($schemaList)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-TOKEN');
    })->name('opendelivery.schemas');
    
    // Health Check
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'service' => 'OpenDelivery API Schema Validator 2',
            'version' => '2.0.0',
            'timestamp' => now()->toISOString()
        ])
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-TOKEN');
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
});
