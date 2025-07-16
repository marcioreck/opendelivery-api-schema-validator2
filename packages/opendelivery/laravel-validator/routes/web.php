<?php

use Illuminate\Support\Facades\Route;
use OpenDelivery\LaravelValidator\Controllers\ValidateController;

Route::prefix('opendelivery')->group(function () {
    Route::post('/validate', [ValidateController::class, 'validate'])->name('opendelivery.validate');
    Route::post('/compatibility', [ValidateController::class, 'compatibility'])->name('opendelivery.compatibility');
    Route::post('/certify', [ValidateController::class, 'certify'])->name('opendelivery.certify');
    
    Route::get('/dashboard', function () {
        return view('opendelivery::dashboard');
    })->name('opendelivery.dashboard');
    
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'service' => 'OpenDelivery Laravel Validator',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ]);
    })->name('opendelivery.health');
});
