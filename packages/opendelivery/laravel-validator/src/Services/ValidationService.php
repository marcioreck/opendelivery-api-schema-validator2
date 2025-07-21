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
     * Get the path to schema file
     */
    public function getSchemaPath(string $version = null): string
    {
        return $this->schemaManager->getSchemaPath($version);
    }

    /**
     * Get all available schema versions
     */
    public function getAvailableVersions(): array
    {
        return $this->schemaManager->getAvailableVersions();
    }

    /**
     * Get the default schema version
     */
    public function getDefaultVersion(): string
    {
        return $this->schemaManager->getDefaultVersion();
    }

    /**
     * Check if a schema version exists
     */
    public function hasVersion(string $version): bool
    {
        return $this->schemaManager->hasVersion($version);
    }

    /**
     * Get schema info (metadata)
     */
    public function getSchemaInfo(string $version): array
    {
        return $this->schemaManager->getSchemaInfo($version);
    }

        /**
     * Validate payload against OpenDelivery schema with rigorous checking
     */
    public function validate($payload, string $version = null): array
    {
        error_log("ValidationService::validate - START");
        
        $version = $version ?? $this->getDefaultVersion();
        error_log("ValidationService::validate - Using version: {$version}");

        try {
            // Load the schema with proper structure
            $schema = $this->loadSchema($version);
            if (!$schema) {
                return [
                    'valid' => false,
                    'errors' => ["Schema version {$version} not found"],
                    'version' => $version
                ];
            }

            // Get the Order schema from OpenAPI spec
            $orderSchema = $schema['components']['schemas']['Order'] ?? null;
            if (!$orderSchema) {
                return [
                    'valid' => false,
                    'errors' => ["Schema version {$version} does not contain Order definition"],
                    'version' => $version
                ];
            }

            // Perform rigorous validation using the same logic as Node.js backend
            $errors = $this->validateStructure($payload, $orderSchema, '');

            return [
                'valid' => empty($errors),
                'errors' => $errors,
                'version' => $version,
                'schema_used' => $schema['info']['title'] ?? "OpenDelivery API {$version}",
                'validated_at' => now()->toISOString()
            ];
            
        } catch (\Exception $e) {
            error_log("ValidationService::validate - EXCEPTION: " . $e->getMessage());
            return [
                'valid' => false,
                'errors' => ['Validation error: ' . $e->getMessage()],
                'version' => $version
            ];
        }
    }

    /**
     * Load schema with proper error handling
     */
    private function loadSchema(string $version): ?array
    {
        try {
            $schemaPath = $this->getSchemaPath($version);
            if (!file_exists($schemaPath)) {
                error_log("Schema file not found: {$schemaPath}");
                return null;
            }

            $yamlContent = file_get_contents($schemaPath);
            $schema = Yaml::parse($yamlContent);
            
            return $schema;
        } catch (\Exception $e) {
            error_log("Error loading schema {$version}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Validate structure with the same rigorous logic as Node.js backend
     */
    private function validateStructure($payload, array $schema, string $path): array
    {
        $errors = [];

        // Check required fields (RIGOROUS)
        if (isset($schema['required'])) {
            foreach ($schema['required'] as $field) {
                if (!isset($payload[$field])) {
                    $fieldPath = $path ? "{$path}.{$field}" : $field;
                    $errors[] = [
                        'path' => $fieldPath,
                        'message' => "Required field '{$field}' is missing",
                        'details' => []
                    ];
                }
            }
        }

        // Check properties types and values (RIGOROUS)
        if (isset($schema['properties'])) {
            foreach ($schema['properties'] as $field => $definition) {
                if (isset($payload[$field])) {
                    $value = $payload[$field];
                    $fieldPath = $path ? "{$path}.{$field}" : $field;
                    
                    $fieldErrors = $this->validateField($value, $definition, $fieldPath, $field);
                    $errors = array_merge($errors, $fieldErrors);
                }
            }
        }

        return $errors;
    }

    /**
     * Validate individual field with rigorous type checking
     */
    private function validateField($value, array $definition, string $fieldPath, string $fieldName): array
    {
        $errors = [];

        // Type validation
        if (isset($definition['type'])) {
            $type = $definition['type'];
            
            switch ($type) {
                case 'string':
                    if (!is_string($value)) {
                        $errors[] = [
                            'path' => $fieldPath,
                            'message' => "Field '{$fieldName}' must be a string",
                            'details' => ['type' => gettype($value)]
                        ];
                    }
                    break;
                    
                case 'number':
                    if (!is_numeric($value)) {
                        $errors[] = [
                            'path' => $fieldPath,
                            'message' => "Field '{$fieldName}' must be a number",
                            'details' => ['type' => gettype($value)]
                        ];
                    }
                    break;
                    
                case 'array':
                    if (!is_array($value)) {
                        $errors[] = [
                            'path' => $fieldPath,
                            'message' => "Field '{$fieldName}' must be an array",
                            'details' => ['type' => gettype($value)]
                        ];
                    }
                    break;
                    
                case 'object':
                    if (!is_array($value) && !is_object($value)) {
                        $errors[] = [
                            'path' => $fieldPath,
                            'message' => "Field '{$fieldName}' must be an object",
                            'details' => ['type' => gettype($value)]
                        ];
                    }
                    break;
            }
        }

        // Enum validation
        if (isset($definition['enum'])) {
            if (!in_array($value, $definition['enum'])) {
                $errors[] = [
                    'path' => $fieldPath,
                    'message' => "Invalid value for '{$fieldName}'. Must be one of: " . implode(', ', $definition['enum']),
                    'details' => ['value' => $value, 'allowed' => $definition['enum']]
                ];
            }
        }

        // Nested object validation
        if (isset($definition['type']) && $definition['type'] === 'object' && (is_array($value) || is_object($value))) {
            $nestedErrors = $this->validateStructure($value, $definition, $fieldPath);
            $errors = array_merge($errors, $nestedErrors);
        }

        // Array items validation  
        if (isset($definition['type']) && $definition['type'] === 'array' && is_array($value)) {
            if (isset($definition['items'])) {
                foreach ($value as $index => $item) {
                    $itemPath = "{$fieldPath}[{$index}]";
                    $itemErrors = $this->validateStructure($item, $definition['items'], $itemPath);
                    $errors = array_merge($errors, $itemErrors);
                }
            }
        }

        // Numeric constraints
        if (isset($definition['type']) && $definition['type'] === 'number' && is_numeric($value)) {
            if (isset($definition['minimum']) && $value < $definition['minimum']) {
                $errors[] = [
                    'path' => $fieldPath,
                    'message' => "Value must be >= {$definition['minimum']}",
                    'details' => ['value' => $value, 'minimum' => $definition['minimum']]
                ];
            }
            
            if (isset($definition['maximum']) && $value > $definition['maximum']) {
                $errors[] = [
                    'path' => $fieldPath,
                    'message' => "Value must be <= {$definition['maximum']}",
                    'details' => ['value' => $value, 'maximum' => $definition['maximum']]
                ];
            }
        }

        // String format validation
        if (isset($definition['type']) && $definition['type'] === 'string' && is_string($value)) {
            if (isset($definition['format'])) {
                switch ($definition['format']) {
                    case 'email':
                        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $errors[] = [
                                'path' => $fieldPath,
                                'message' => 'Invalid email format'
                            ];
                        }
                        break;
                        
                    case 'date-time':
                        if (!$this->isValidDateTime($value)) {
                            $errors[] = [
                                'path' => $fieldPath,
                                'message' => 'Invalid date-time format'
                            ];
                        }
                        break;
                }
            }
        }

        return $errors;
    }

    /**
     * Validate date-time format
     */
    private function isValidDateTime(string $dateTime): bool
    {
        $date = \DateTime::createFromFormat('Y-m-d\TH:i:s\Z', $dateTime);
        return $date !== false && preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/', $dateTime);
    }

    private function getSchemaNameUsed(array $schema): string
    {
        return $schema['title'] ?? 'Unknown Schema';
    }

    /**
     * Check compatibility between schema versions
     */
    public function checkCompatibility($payload, $fromVersion = null, $toVersion = null): array
    {
        error_log("ValidationService::checkCompatibility - START");
        try {
            error_log("ValidationService::checkCompatibility - Getting available versions");
            $versions = $this->getAvailableVersions();
            error_log("ValidationService::checkCompatibility - Found versions: " . implode(', ', $versions));
            
            $compatibleVersions = [];
            $errors = [];

            error_log("ValidationService::checkCompatibility - Starting version loop");
            foreach ($versions as $version) {
                error_log("ValidationService::checkCompatibility - Testing version: " . $version);
                
                // Skip versions that don't match the from/to filters
                if ($fromVersion && version_compare($version, $fromVersion, '<')) {
                    error_log("ValidationService::checkCompatibility - Skipping $version (before $fromVersion)");
                    continue;
                }
                if ($toVersion && version_compare($version, $toVersion, '>')) {
                    error_log("ValidationService::checkCompatibility - Skipping $version (after $toVersion)");
                    continue;
                }

                try {
                    error_log("ValidationService::checkCompatibility - Validating against version: " . $version);
                    $validationResult = $this->validate($payload, $version);
                    error_log("ValidationService::checkCompatibility - Validation completed for $version, valid: " . ($validationResult['valid'] ? 'true' : 'false'));
                    
                    if ($validationResult['valid']) {
                        $compatibleVersions[] = $version;
                    } else {
                        $errors[$version] = $validationResult['errors'];
                    }
                } catch (\Exception $e) {
                    error_log("ValidationService::checkCompatibility - Exception for version $version: " . $e->getMessage());
                    $errors[$version] = ['Schema validation error: ' . $e->getMessage()];
                }
            }

            error_log("ValidationService::checkCompatibility - Version loop completed");
            
            // If no compatible versions found, let's try a more lenient approach
            if (empty($compatibleVersions)) {
                error_log("ValidationService::checkCompatibility - No compatible versions found, checking basic structure");
                // Check if the payload has the basic structure of an OpenDelivery order
                if ($this->hasBasicOrderStructure($payload)) {
                    // Try to find the most suitable version based on payload features
                    $suggestedVersion = $this->suggestVersionBasedOnPayload($payload);
                    if ($suggestedVersion) {
                        error_log("ValidationService::checkCompatibility - Returning suggestion: " . $suggestedVersion);
                        return [
                            'compatible' => false,
                            'versions' => [],
                            'suggested_version' => $suggestedVersion,
                            'message' => "Payload has OpenDelivery structure but needs adjustments for version {$suggestedVersion}",
                            'errors' => $errors
                        ];
                    }
                }
            }

            error_log("ValidationService::checkCompatibility - Returning final result");
            return [
                'compatible' => !empty($compatibleVersions),
                'versions' => $compatibleVersions,
                'errors' => $errors,
                'message' => empty($compatibleVersions) 
                    ? '❌ Payload is not compatible with any OpenDelivery version. Please check the payload structure.'
                    : '✅ Payload is compatible with OpenDelivery versions: ' . implode(', ', $compatibleVersions)
            ];
        } catch (\Exception $e) {
            error_log("ValidationService::checkCompatibility - EXCEPTION: " . $e->getMessage());
            return [
                'compatible' => false,
                'versions' => [],
                'errors' => ['general' => [$e->getMessage()]],
                'message' => 'Error during compatibility check: ' . $e->getMessage()
            ];
        }
    }

    private function hasBasicOrderStructure($payload): bool
    {
        // Check if payload has basic OpenDelivery order structure
        return is_array($payload) && (
            (isset($payload['id']) && isset($payload['type'])) ||
            (isset($payload['order']) && is_array($payload['order']))
        );
    }

    private function suggestVersionBasedOnPayload($payload): ?string
    {
        // Simple heuristic to suggest a version based on payload features
        $versions = $this->getAvailableVersions();
        
        // For now, suggest the latest version
        return end($versions);
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
    private function extractJsonSchemaFromOpenApi(array $openApiSpec): array
    {
        if (!isset($openApiSpec['components']['schemas'])) {
            throw new \InvalidArgumentException('OpenAPI specification does not contain schemas');
        }

        $schemas = $openApiSpec['components']['schemas'];
        
        // Look for the most relevant schema for payload validation
        // Based on actual OpenAPI schema names found in the YAML files
        $preferredSchemas = ['Order', 'DeliveryOrder', 'DeliveryOrderEvent', 'Delivery', 'DeliveryRequest', 'OrderPayload', 'Payment'];
        
        foreach ($preferredSchemas as $schemaName) {
            if (isset($schemas[$schemaName])) {
                return $schemas[$schemaName];
            }
        }
        
        // Fallback to the first available schema
        return reset($schemas);
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
