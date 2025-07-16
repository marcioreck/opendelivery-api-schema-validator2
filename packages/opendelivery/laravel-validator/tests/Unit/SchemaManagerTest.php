<?php

namespace OpenDelivery\LaravelValidator\Tests\Unit;

use OpenDelivery\LaravelValidator\Services\SchemaManager;
use OpenDelivery\LaravelValidator\Tests\TestCase;
use Illuminate\Support\Facades\File;

class SchemaManagerTest extends TestCase
{
    protected SchemaManager $schemaManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->schemaManager = new SchemaManager();
    }

    /** @test */
    public function it_can_get_available_versions()
    {
        $versions = $this->schemaManager->getAvailableVersions();
        
        $this->assertIsArray($versions);
        $this->assertNotEmpty($versions);
        $this->assertContains('1.5.0', $versions);
    }

    /** @test */
    public function it_can_check_if_version_exists()
    {
        $this->assertTrue($this->schemaManager->hasVersion('1.5.0'));
        $this->assertFalse($this->schemaManager->hasVersion('999.0.0'));
    }

    /** @test */
    public function it_can_get_default_version()
    {
        $defaultVersion = $this->schemaManager->getDefaultVersion();
        
        $this->assertIsString($defaultVersion);
        $this->assertNotEmpty($defaultVersion);
    }

    /** @test */
    public function it_can_load_schema()
    {
        $schema = $this->schemaManager->loadSchema('1.5.0');
        
        $this->assertIsArray($schema);
        $this->assertArrayHasKey('openapi', $schema);
        $this->assertArrayHasKey('info', $schema);
        $this->assertArrayHasKey('paths', $schema);
    }

    /** @test */
    public function it_throws_exception_for_invalid_version()
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Schema version 999.0.0 not found');
        
        $this->schemaManager->loadSchema('999.0.0');
    }

    /** @test */
    public function it_can_get_schema_info()
    {
        $info = $this->schemaManager->getSchemaInfo('1.5.0');
        
        $this->assertIsArray($info);
        $this->assertArrayHasKey('version', $info);
        $this->assertArrayHasKey('title', $info);
        $this->assertArrayHasKey('description', $info);
        $this->assertEquals('1.5.0', $info['version']);
    }

    /** @test */
    public function it_caches_loaded_schemas()
    {
        // First load
        $schema1 = $this->schemaManager->loadSchema('1.5.0');
        
        // Second load should use cache
        $schema2 = $this->schemaManager->loadSchema('1.5.0');
        
        $this->assertEquals($schema1, $schema2);
    }

    /** @test */
    public function it_validates_schema_structure()
    {
        $schema = $this->schemaManager->loadSchema('1.5.0');
        
        // Basic OpenAPI structure validation
        $this->assertArrayHasKey('openapi', $schema);
        $this->assertArrayHasKey('info', $schema);
        $this->assertArrayHasKey('paths', $schema);
        $this->assertArrayHasKey('components', $schema);
        
        // Version validation
        $this->assertIsString($schema['openapi']);
        $this->assertIsArray($schema['info']);
        $this->assertIsArray($schema['paths']);
        $this->assertIsArray($schema['components']);
    }

    /** @test */
    public function it_handles_missing_schema_directory()
    {
        // Create a SchemaManager with non-existent directory
        $reflection = new \ReflectionClass(SchemaManager::class);
        $property = $reflection->getProperty('schemasPath');
        $property->setAccessible(true);
        
        $schemaManager = new SchemaManager();
        $property->setValue($schemaManager, '/non/existent/path');
        
        $this->expectException(\Exception::class);
        $schemaManager->getAvailableVersions();
    }
}
