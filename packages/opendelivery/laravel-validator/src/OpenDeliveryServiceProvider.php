<?php

namespace OpenDelivery\LaravelValidator;

use Illuminate\Support\ServiceProvider;

class OpenDeliveryServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     */
    public function boot(): void
    {
        // Publish config file
        $this->publishes([
            __DIR__ . '/../config/opendelivery.php' => config_path('opendelivery.php'),
        ], 'opendelivery-config');

        // Publish views
        $this->publishes([
            __DIR__ . '/../resources/views' => resource_path('views/vendor/opendelivery'),
        ], 'opendelivery-views');

        // Load routes
        $this->loadRoutesFrom(__DIR__ . '/../routes/web.php');

        // Load views
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'opendelivery');
    }

    /**
     * Register the application services.
     */
    public function register(): void
    {
        // Merge config
        $this->mergeConfigFrom(
            __DIR__ . '/../config/opendelivery.php',
            'opendelivery'
        );

        // Register services
        $this->app->singleton('opendelivery.schema-manager', function ($app) {
            return new \OpenDelivery\LaravelValidator\Services\SchemaManager();
        });

        $this->app->singleton('opendelivery.validator', function ($app) {
            return new \OpenDelivery\LaravelValidator\Services\ValidationService(
                $app->make('opendelivery.schema-manager')
            );
        });
    }
}
