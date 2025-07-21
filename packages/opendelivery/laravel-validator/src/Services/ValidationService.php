<?php

namespace OpenDelivery\LaravelValidator\Services;

use JsonSchema\Validator;
use JsonSchema\Constraints\Constraint;
use JsonSchema\SchemaStorage;
use JsonSchema\Uri\UriRetriever;
use JsonSchema\Uri\UriResolver;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Yaml\Yaml;

class ValidationService
{
    private SchemaManager $schemaManager;
    private Validator $validator;
    private SchemaStorage $schemaStorage;

    public function __construct(SchemaManager $schemaManager)
    {
        $this->schemaManager = $schemaManager;
        $this->validator = new Validator();
        $this->schemaStorage = new SchemaStorage();
    }

    /**
     * Validate a payload against a specific schema version
     * Uses the EXACT same logic as Node.js ValidationService.ts
     */
    public function validate(array $payload, string $version = null): array
    {
        error_log("ValidationService::validate - START");
        
        $version = $version ?? $this->getDefaultVersion();
        error_log("ValidationService::validate - Using version: {$version}");

        try {
            // Load the schema with proper structure (same as Node.js)
            $schema = ValidationHelper::loadSchema($version);
            if (!$schema) {
                return [
                    'valid' => false,
                    'errors' => ["Schema version {$version} not found"],
                    'schema_version' => $version
                ];
            }

            // Get the Order schema from OpenAPI spec (exactly like Node.js)
            $orderSchema = $schema['components']['schemas']['Order'] ?? null;
            if (!$orderSchema) {
                return [
                    'valid' => false,
                    'errors' => ["Schema version {$version} does not contain Order definition"],
                    'schema_version' => $version
                ];
            }

            // Validate the payload (exact same logic as Node.js validateStructure)
            $errors = ValidationHelper::validateStructure($payload, $orderSchema, '');
            
            if (empty($errors)) {
                return [
                    'valid' => true,
                    'details' => [
                        'schema_version' => $version,
                        'validated_at' => now()->toISOString()
                    ],
                    'schema_version' => $version
                ];
            } else {
                return [
                    'valid' => false,
                    'errors' => $errors,
                    'schema_version' => $version
                ];
            }

        } catch (\Exception $e) {
            error_log("ValidationService::validate - Exception: " . $e->getMessage());
            return [
                'valid' => false,
                'errors' => [$e->getMessage()],
                'schema_version' => $version
            ];
        }
    }

    /**
     * Get default version
     */
    private function getDefaultVersion(): string
    {
        return '1.5.0';
    }

    /**
     * Check compatibility between versions (for CompatibilityController)
     */
    public function checkCompatibility(string $fromVersion, string $toVersion): array
    {
        try {
            $fromSchema = ValidationHelper::loadSchema($fromVersion);
            $toSchema = ValidationHelper::loadSchema($toVersion);

            if (!$fromSchema || !$toSchema) {
                return [
                    'compatible' => false,
                    'message' => 'One or more schemas not found',
                    'fromVersion' => $fromVersion,
                    'toVersion' => $toVersion
                ];
            }

            return [
                'compatible' => true,
                'message' => "Schema {$fromVersion} is compatible with {$toVersion}",
                'fromVersion' => $fromVersion,
                'toVersion' => $toVersion,
                'changes' => ValidationHelper::getSchemaChanges($fromSchema, $toSchema)
            ];

        } catch (\Exception $e) {
            return [
                'compatible' => false,
                'message' => $e->getMessage(),
                'fromVersion' => $fromVersion,
                'toVersion' => $toVersion
            ];
        }
    }

    /**
     * Certify payload for OpenDelivery Ready (for CertificationController)
     */
    public function certify(array $payload, string $version = null): array
    {
        $version = $version ?? $this->getDefaultVersion();
        
        $validationResult = $this->validate($payload, $version);
        
        if ($validationResult['valid']) {
            return [
                'certified' => true,
                'message' => 'Payload is OpenDelivery Ready',
                'version' => $version,
                'score' => 100,
                'details' => [
                    'validation_passed' => true,
                    'schema_version' => $version,
                    'certified_at' => now()->toISOString()
                ]
            ];
        } else {
            return [
                'certified' => false,
                'message' => 'Payload validation failed',
                'version' => $version,
                'score' => 0,
                'errors' => $validationResult['errors']
            ];
        }
    }
}
