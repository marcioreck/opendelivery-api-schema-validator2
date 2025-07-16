<?php

namespace OpenDelivery\LaravelValidator\Tests;

use Orchestra\Testbench\TestCase as Orchestra;
use OpenDelivery\LaravelValidator\OpenDeliveryServiceProvider;

abstract class TestCase extends Orchestra
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Additional setup if needed
    }

    protected function getPackageProviders($app)
    {
        return [
            OpenDeliveryServiceProvider::class,
        ];
    }

    protected function getEnvironmentSetUp($app)
    {
        // Setup the application environment for testing
        $app['config']->set('database.default', 'testing');
        $app['config']->set('database.connections.testing', [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => '',
        ]);
    }
}
