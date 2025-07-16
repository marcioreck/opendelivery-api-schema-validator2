<?php

namespace OpenDelivery\LaravelValidator\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Symfony\Component\Yaml\Yaml;

class SchemaManager
{
    private array $schemas = [];
    private string $schemasPath;

    public function __construct()
    {
        $this->schemasPath = __DIR__ . '/../../schemas';
    }

    /**
     * Get all available schema versions
     */
    public function getAvailableVersions(): array
    {
        $files = File::files($this->schemasPath);
        $versions = [];

        foreach ($files as $file) {
            if ($file->getExtension() === 'yaml') {
                $versions[] = $file->getBasename('.yaml');
            }
        }

        sort($versions);
        return $versions;
    }

    /**
     * Load a specific schema version
     */
    public function loadSchema(string $version): array
    {
        if (isset($this->schemas[$version])) {
            return $this->schemas[$version];
        }

        $cacheKey = "opendelivery.schema.{$version}";
        
        if (Cache::has($cacheKey)) {
            $this->schemas[$version] = Cache::get($cacheKey);
            return $this->schemas[$version];
        }

        $schemaPath = $this->schemasPath . "/{$version}.yaml";
        
        if (!File::exists($schemaPath)) {
            throw new \Exception("Schema version {$version} not found");
        }

        $yamlContent = File::get($schemaPath);
        $schema = Yaml::parse($yamlContent);

        // Cache the schema for performance
        Cache::put($cacheKey, $schema, config('opendelivery.cache.ttl', 3600));
        
        $this->schemas[$version] = $schema;
        return $schema;
    }

    /**
     * Get the default schema version
     */
    public function getDefaultVersion(): string
    {
        return config('opendelivery.default_schema_version', '1.6.0-rc');
    }

    /**
     * Check if a schema version exists
     */
    public function hasVersion(string $version): bool
    {
        return in_array($version, $this->getAvailableVersions());
    }

    /**
     * Get schema info (metadata)
     */
    public function getSchemaInfo(string $version): array
    {
        $schema = $this->loadSchema($version);
        
        return [
            'version' => $version,
            'title' => $schema['info']['title'] ?? 'OpenDelivery Schema',
            'description' => $schema['info']['description'] ?? '',
            'openapi_version' => $schema['openapi'] ?? '3.0.0',
            'paths_count' => count($schema['paths'] ?? []),
            'components_count' => count($schema['components']['schemas'] ?? []),
        ];
    }

    /**
     * Clear schema cache
     */
    public function clearCache(): void
    {
        $versions = $this->getAvailableVersions();
        
        foreach ($versions as $version) {
            Cache::forget("opendelivery.schema.{$version}");
        }
        
        $this->schemas = [];
    }
}
