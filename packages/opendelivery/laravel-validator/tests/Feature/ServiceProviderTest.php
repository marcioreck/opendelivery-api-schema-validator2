<?php

namespace OpenDelivery\LaravelValidator\Tests\Feature;

use OpenDelivery\LaravelValidator\Tests\TestCase;
use OpenDelivery\LaravelValidator\Services\SchemaManager;
use OpenDelivery\LaravelValidator\Services\ValidationService;

class ServiceProviderTest extends TestCase
{

    /** @test */
    public function it_registers_services()
    {
        $this->assertInstanceOf(SchemaManager::class, app(SchemaManager::class));
        $this->assertInstanceOf(ValidationService::class, app(ValidationService::class));
    }

    /** @test */
    public function it_binds_services_as_singletons()
    {
        $schemaManager1 = app(SchemaManager::class);
        $schemaManager2 = app(SchemaManager::class);

        $this->assertSame($schemaManager1, $schemaManager2);

        $validationService1 = app(ValidationService::class);
        $validationService2 = app(ValidationService::class);

        $this->assertSame($validationService1, $validationService2);
    }

    /** @test */
    public function it_loads_routes()
    {
        $router = app('router');
        $routes = $router->getRoutes();

        $foundRoutes = [];
        foreach ($routes as $route) {
            if (str_starts_with($route->uri(), 'api/opendelivery/')) {
                $foundRoutes[] = $route->uri();
            }
        }

        $this->assertContains('api/opendelivery/validate', $foundRoutes);
        $this->assertContains('api/opendelivery/compatibility', $foundRoutes);
        $this->assertContains('api/opendelivery/certify', $foundRoutes);
        $this->assertContains('api/opendelivery/health', $foundRoutes);
        $this->assertContains('api/opendelivery/schemas/versions', $foundRoutes);
    }

    /** @test */
    public function it_publishes_config()
    {
        $this->artisan('vendor:publish', [
            '--provider' => 'OpenDelivery\LaravelValidator\OpenDeliveryServiceProvider',
            '--tag' => 'config'
        ]);

        $this->assertFileExists(config_path('opendelivery.php'));
    }

    /** @test */
    public function it_merges_config()
    {
        $config = config('opendelivery');

        $this->assertIsArray($config);
        $this->assertArrayHasKey('default_version', $config);
        $this->assertArrayHasKey('cache_ttl', $config);
        $this->assertArrayHasKey('schemas_path', $config);
        $this->assertArrayHasKey('validation', $config);
        $this->assertArrayHasKey('certification', $config);
    }

    /** @test */
    public function it_has_correct_default_config_values()
    {
        $config = config('opendelivery');

        $this->assertEquals('1.5.0', $config['default_version']);
        $this->assertEquals(3600, $config['cache_ttl']);
        $this->assertTrue($config['validation']['strict_mode']);
        $this->assertTrue($config['certification']['enabled']);
    }

    /** @test */
    public function it_loads_schemas_from_correct_path()
    {
        $schemaManager = app(SchemaManager::class);
        $versions = $schemaManager->listVersions();

        $this->assertIsArray($versions);
        $this->assertNotEmpty($versions);
        $this->assertContains('1.5.0', $versions);
    }

    /** @test */
    public function it_handles_missing_schemas_gracefully()
    {
        // Temporarily override schema path to non-existent directory
        config(['opendelivery.schemas_path' => '/non/existent/path']);

        $schemaManager = new SchemaManager();
        $versions = $schemaManager->listVersions();

        $this->assertIsArray($versions);
        $this->assertEmpty($versions);
    }

    /** @test */
    public function it_caches_schemas_correctly()
    {
        $schemaManager = app(SchemaManager::class);
        
        // First call should cache the schema
        $schema1 = $schemaManager->getSchema('1.5.0');
        
        // Second call should return cached version
        $schema2 = $schemaManager->getSchema('1.5.0');
        
        $this->assertNotNull($schema1);
        $this->assertNotNull($schema2);
        $this->assertEquals($schema1, $schema2);
    }

    /** @test */
    public function it_respects_cache_ttl_configuration()
    {
        $originalTtl = config('opendelivery.cache_ttl');
        
        // Change cache TTL
        config(['opendelivery.cache_ttl' => 1]);
        
        $schemaManager = app(SchemaManager::class);
        $schema = $schemaManager->getSchema('1.5.0');
        
        $this->assertNotNull($schema);
        
        // Restore original TTL
        config(['opendelivery.cache_ttl' => $originalTtl]);
    }

    /** @test */
    public function it_loads_middleware()
    {
        $kernel = app('Illuminate\Contracts\Http\Kernel');
        $middleware = $kernel->getMiddleware();

        // Check that API middleware is available
        $this->assertArrayHasKey('api', app('router')->getMiddlewareGroups());
    }

    /** @test */
    public function it_handles_validation_service_dependencies()
    {
        $validationService = app(ValidationService::class);
        
        $this->assertInstanceOf(ValidationService::class, $validationService);
        
        // Test that validation service can access schema manager
        $result = $validationService->validatePayload(['order' => ['id' => 'test']], '1.5.0');
        
        $this->assertIsArray($result);
        $this->assertArrayHasKey('valid', $result);
        $this->assertArrayHasKey('schema_version', $result);
    }
}
