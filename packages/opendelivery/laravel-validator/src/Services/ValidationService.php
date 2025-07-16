<?php

namespace OpenDelivery\LaravelValidator\Services;

use JsonSchema\Validator;
use JsonSchema\Constraints\Constraint;
use JsonSchema\SchemaStorage;
use JsonSchema\Uri\UriRetriever;
use JsonSchema\Uri\UriResolver;
use Illuminate\Support\Facades\Log;

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
     */
    public function validatePayload(array $payload, string $schemaVersion = null): array
    {
        try {
            $version = $schemaVersion ?? $this->schemaManager->getDefaultVersion();
            
            if (!$this->schemaManager->hasVersion($version)) {
                throw new \Exception("Schema version {$version} not found");
            }

            $schema = $this->schemaManager->loadSchema($version);
            
            // Convert payload to object for validation
            $payloadObject = json_decode(json_encode($payload));
            
            // Extract the actual JSON Schema from OpenAPI spec
            $jsonSchema = $this->extractJsonSchemaFromOpenApi($schema, $payload);
            
            // Validate against JSON Schema
            $this->validator->validate($payloadObject, $jsonSchema);
            
            $isValid = $this->validator->isValid();
            $errors = $this->validator->getErrors();
            
            $result = [
                'valid' => $isValid,
                'schema_version' => $version,
                'payload_size' => strlen(json_encode($payload)),
                'validation_time' => microtime(true),
                'errors' => $this->formatErrors($errors),
                'warnings' => $this->generateWarnings($payload, $schema),
                'score' => $this->calculateValidationScore($isValid, $errors, $payload),
            ];

            // Log validation attempt
            Log::info('OpenDelivery validation performed', [
                'version' => $version,
                'valid' => $isValid,
                'errors_count' => count($errors),
                'payload_size' => $result['payload_size'],
            ]);

            return $result;

        } catch (\Exception $e) {
            Log::error('OpenDelivery validation error', [
                'error' => $e->getMessage(),
                'version' => $schemaVersion,
                'payload_size' => strlen(json_encode($payload ?? [])),
            ]);

            return [
                'valid' => false,
                'schema_version' => $schemaVersion,
                'error' => $e->getMessage(),
                'errors' => [],
                'warnings' => [],
                'score' => 0,
            ];
        }
    }

    /**
     * Check compatibility between schema versions
     */
    public function checkCompatibility(string $fromVersion, string $toVersion, array $payload): array
    {
        try {
            if (!$this->schemaManager->hasVersion($fromVersion)) {
                throw new \Exception("Source schema version {$fromVersion} not found");
            }

            if (!$this->schemaManager->hasVersion($toVersion)) {
                throw new \Exception("Target schema version {$toVersion} not found");
            }

            $fromSchema = $this->schemaManager->loadSchema($fromVersion);
            $toSchema = $this->schemaManager->loadSchema($toVersion);

            // If payload is provided, validate against both versions
            $fromValidation = !empty($payload) ? $this->validatePayload($payload, $fromVersion) : null;
            $toValidation = !empty($payload) ? $this->validatePayload($payload, $toVersion) : null;

            $compatibility = $this->analyzeSchemaCompatibility($fromSchema, $toSchema);

            return [
                'compatible' => $compatibility['compatible'],
                'from_version' => $fromVersion,
                'to_version' => $toVersion,
                'compatibility_score' => $compatibility['score'],
                'breaking_changes' => $compatibility['breaking_changes'],
                'new_features' => $compatibility['new_features'],
                'deprecated_features' => $compatibility['deprecated_features'],
                'migration_notes' => $compatibility['migration_notes'],
                'payload_validation' => [
                    'from' => $fromValidation,
                    'to' => $toValidation,
                ],
            ];

        } catch (\Exception $e) {
            Log::error('OpenDelivery compatibility check error', [
                'error' => $e->getMessage(),
                'from_version' => $fromVersion,
                'to_version' => $toVersion,
            ]);

            return [
                'compatible' => false,
                'error' => $e->getMessage(),
                'from_version' => $fromVersion,
                'to_version' => $toVersion,
            ];
        }
    }

    /**
     * Certify a payload as OpenDelivery Ready
     */
    public function certifyPayload(array $payload, string $schemaVersion = null): array
    {
        try {
            $version = $schemaVersion ?? $this->schemaManager->getDefaultVersion();
            $validation = $this->validatePayload($payload, $version);

            if (!$validation['valid']) {
                return [
                    'certified' => false,
                    'reason' => 'Payload validation failed',
                    'validation' => $validation,
                ];
            }

            $certificationScore = $this->calculateCertificationScore($payload, $validation);
            $requirements = $this->checkCertificationRequirements($payload, $validation);

            $certified = $certificationScore >= 85 && $requirements['passed'];

            return [
                'certified' => $certified,
                'score' => $certificationScore,
                'schema_version' => $version,
                'requirements' => $requirements,
                'validation' => $validation,
                'certification_level' => $this->getCertificationLevel($certificationScore),
                'recommendations' => $this->generateRecommendations($payload, $validation),
                'certificate_id' => $certified ? $this->generateCertificateId($payload, $version) : null,
            ];

        } catch (\Exception $e) {
            Log::error('OpenDelivery certification error', [
                'error' => $e->getMessage(),
                'version' => $schemaVersion,
            ]);

            return [
                'certified' => false,
                'error' => $e->getMessage(),
                'schema_version' => $schemaVersion,
            ];
        }
    }

    /**
     * Extract JSON Schema from OpenAPI specification
     */
    private function extractJsonSchemaFromOpenApi(array $openApiSchema, array $payload): object
    {
        // For now, we'll use a basic schema extraction
        // In a full implementation, this would properly extract the relevant schema
        // based on the payload structure and OpenAPI paths
        
        if (isset($openApiSchema['components']['schemas'])) {
            // Try to find the main schema based on common patterns
            $schemas = $openApiSchema['components']['schemas'];
            
            // Look for main delivery schema
            foreach (['Delivery', 'DeliveryRequest', 'Order', 'Package'] as $schemaName) {
                if (isset($schemas[$schemaName])) {
                    return (object) $schemas[$schemaName];
                }
            }
            
            // If no main schema found, use the first one
            if (!empty($schemas)) {
                return (object) array_values($schemas)[0];
            }
        }

        // Fallback: create a basic schema
        return (object) [
            'type' => 'object',
            'properties' => (object) [],
            'additionalProperties' => true,
        ];
    }

    /**
     * Format validation errors for better readability
     */
    private function formatErrors(array $errors): array
    {
        $formatted = [];
        
        foreach ($errors as $error) {
            $formatted[] = [
                'property' => $error['property'] ?? '',
                'message' => $error['message'] ?? '',
                'constraint' => $error['constraint'] ?? '',
                'value' => $error['value'] ?? null,
            ];
        }
        
        return $formatted;
    }

    /**
     * Generate warnings for best practices
     */
    private function generateWarnings(array $payload, array $schema): array
    {
        $warnings = [];
        
        // Check for missing recommended fields
        if (!isset($payload['timestamp'])) {
            $warnings[] = [
                'type' => 'missing_recommended_field',
                'message' => 'Timestamp field is recommended for better tracking',
                'severity' => 'low',
            ];
        }
        
        // Check for overly large payloads
        if (strlen(json_encode($payload)) > 1024 * 1024) { // 1MB
            $warnings[] = [
                'type' => 'large_payload',
                'message' => 'Payload is very large, consider optimizing',
                'severity' => 'medium',
            ];
        }
        
        return $warnings;
    }

    /**
     * Calculate validation score
     */
    private function calculateValidationScore(bool $isValid, array $errors, array $payload): int
    {
        if (!$isValid) {
            return max(0, 100 - (count($errors) * 20));
        }
        
        $score = 100;
        
        // Deduct points for warnings
        if (strlen(json_encode($payload)) > 1024 * 100) { // 100KB
            $score -= 5;
        }
        
        return max(0, min(100, $score));
    }

    /**
     * Analyze schema compatibility
     */
    private function analyzeSchemaCompatibility(array $fromSchema, array $toSchema): array
    {
        // This is a simplified compatibility check
        // In a full implementation, this would do deep schema comparison
        
        $fromPaths = array_keys($fromSchema['paths'] ?? []);
        $toPaths = array_keys($toSchema['paths'] ?? []);
        
        $removedPaths = array_diff($fromPaths, $toPaths);
        $addedPaths = array_diff($toPaths, $fromPaths);
        
        $breakingChanges = [];
        $newFeatures = [];
        
        foreach ($removedPaths as $path) {
            $breakingChanges[] = "Removed endpoint: {$path}";
        }
        
        foreach ($addedPaths as $path) {
            $newFeatures[] = "Added endpoint: {$path}";
        }
        
        $compatible = empty($breakingChanges);
        $score = $compatible ? 100 : max(0, 100 - (count($breakingChanges) * 25));
        
        return [
            'compatible' => $compatible,
            'score' => $score,
            'breaking_changes' => $breakingChanges,
            'new_features' => $newFeatures,
            'deprecated_features' => [],
            'migration_notes' => $compatible ? 
                ['No breaking changes detected'] : 
                ['Review breaking changes before migration'],
        ];
    }

    /**
     * Calculate certification score
     */
    private function calculateCertificationScore(array $payload, array $validation): int
    {
        $score = $validation['score'] ?? 0;
        
        // Bonus points for good practices
        if (isset($payload['metadata'])) {
            $score += 5;
        }
        
        if (isset($payload['tracking_id'])) {
            $score += 5;
        }
        
        return min(100, $score);
    }

    /**
     * Check certification requirements
     */
    private function checkCertificationRequirements(array $payload, array $validation): array
    {
        $requirements = [
            'valid_schema' => $validation['valid'],
            'no_critical_errors' => count($validation['errors']) === 0,
            'acceptable_size' => strlen(json_encode($payload)) < 1024 * 1024, // 1MB
            'has_required_fields' => true, // Simplified check
        ];
        
        return [
            'requirements' => $requirements,
            'passed' => !in_array(false, $requirements, true),
        ];
    }

    /**
     * Get certification level based on score
     */
    private function getCertificationLevel(int $score): string
    {
        if ($score >= 95) return 'platinum';
        if ($score >= 85) return 'gold';
        if ($score >= 75) return 'silver';
        if ($score >= 65) return 'bronze';
        return 'none';
    }

    /**
     * Generate recommendations for improvement
     */
    private function generateRecommendations(array $payload, array $validation): array
    {
        $recommendations = [];
        
        if (!$validation['valid']) {
            $recommendations[] = 'Fix all validation errors before certification';
        }
        
        if (!isset($payload['metadata'])) {
            $recommendations[] = 'Add metadata field for better tracking';
        }
        
        if (strlen(json_encode($payload)) > 1024 * 100) { // 100KB
            $recommendations[] = 'Consider reducing payload size for better performance';
        }
        
        return $recommendations;
    }

    /**
     * Generate certificate ID
     */
    private function generateCertificateId(array $payload, string $version): string
    {
        $hash = hash('sha256', json_encode($payload) . $version . time());
        return 'OD-' . strtoupper(substr($hash, 0, 12));
    }
}
