<?php

namespace OpenDelivery\LaravelValidator\Services;

use Symfony\Component\Yaml\Yaml;

class ValidationHelper
{
    /**
     * Validate structure with the EXACT same logic as Node.js ValidationService.ts
     */
    public static function validateStructure($payload, array $schema, string $path): array
    {
        $errors = [];

        // Check required fields (exactly like Node.js)
        if (isset($schema['required']) && is_array($schema['required'])) {
            foreach ($schema['required'] as $field) {
                if (!isset($payload[$field])) {
                    $fieldPath = $path ? "{$path}.{$field}" : $field;
                    $errors[] = [
                        'path' => $fieldPath,
                        'message' => "Required field '{$field}' is missing"
                    ];
                }
            }
        }

        // Check properties types and values (exactly like Node.js)
        if (isset($schema['properties']) && is_array($schema['properties'])) {
            foreach ($schema['properties'] as $field => $definition) {
                if (isset($payload[$field])) {
                    $value = $payload[$field];
                    $fieldPath = $path ? "{$path}.{$field}" : $field;
                    
                    $fieldErrors = self::validateField($value, $definition, $fieldPath, $field);
                    $errors = array_merge($errors, $fieldErrors);
                }
            }
        }

        return $errors;
    }

    /**
     * Validate individual field with the EXACT same logic as Node.js
     */
    public static function validateField($value, array $definition, string $fieldPath, string $fieldName): array
    {
        $errors = [];

        // Type validation (exactly like Node.js)
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

        // Enum validation (exactly like Node.js)
        if (isset($definition['enum']) && is_array($definition['enum'])) {
            if (!in_array($value, $definition['enum'])) {
                $errors[] = [
                    'path' => $fieldPath,
                    'message' => "Invalid value for '{$fieldName}'. Must be one of: " . implode(', ', $definition['enum']),
                    'details' => ['value' => $value, 'allowed' => $definition['enum']]
                ];
            }
        }

        // Nested object validation (exactly like Node.js)
        if (isset($definition['type']) && $definition['type'] === 'object' && (is_array($value) || is_object($value))) {
            $nestedErrors = self::validateStructure($value, $definition, $fieldPath);
            $errors = array_merge($errors, $nestedErrors);
        }

        // Array items validation (exactly like Node.js)
        if (isset($definition['type']) && $definition['type'] === 'array' && isset($definition['items']) && is_array($value)) {
            foreach ($value as $index => $item) {
                $itemErrors = self::validateStructure($item, $definition['items'], "{$fieldPath}[{$index}]");
                $errors = array_merge($errors, $itemErrors);
            }
        }

        // Number validation (exactly like Node.js)
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

        // String format validation (exactly like Node.js)
        if (isset($definition['type']) && $definition['type'] === 'string' && isset($definition['format'])) {
            $formatErrors = self::validateStringFormat($value, $definition['format'], $fieldPath);
            $errors = array_merge($errors, $formatErrors);
        }

        return $errors;
    }

    /**
     * String format validation helpers
     */
    public static function validateStringFormat($value, string $format, string $fieldPath): array
    {
        $errors = [];

        switch ($format) {
            case 'email':
                if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $errors[] = [
                        'path' => $fieldPath,
                        'message' => "Invalid email format",
                        'details' => ['value' => $value]
                    ];
                }
                break;
            case 'date-time':
                if (!self::isValidDateTime($value)) {
                    $errors[] = [
                        'path' => $fieldPath,
                        'message' => "Invalid date-time format",
                        'details' => ['value' => $value]
                    ];
                }
                break;
            case 'uuid':
                if (!self::isValidUuid($value)) {
                    $errors[] = [
                        'path' => $fieldPath,
                        'message' => "Invalid UUID format",
                        'details' => ['value' => $value]
                    ];
                }
                break;
        }

        return $errors;
    }

    /**
     * DateTime validation helper
     */
    public static function isValidDateTime(string $value): bool
    {
        $formats = [
            'Y-m-d\TH:i:s\Z',
            'Y-m-d\TH:i:sP',
            'Y-m-d\TH:i:s.u\Z',
            'Y-m-d\TH:i:s.uP'
        ];

        foreach ($formats as $format) {
            $date = \DateTime::createFromFormat($format, $value);
            if ($date && $date->format($format) === $value) {
                return true;
            }
        }

        return false;
    }

    /**
     * UUID validation helper
     */
    public static function isValidUuid(string $value): bool
    {
        return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $value);
    }

    /**
     * Load schema from file (same as Node.js)
     */
    public static function loadSchema(string $version): ?array
    {
        try {
            $schemaPath = self::getSchemaPath($version);
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
     * Get schema file path
     */
    public static function getSchemaPath(string $version): string
    {
        return __DIR__ . "/../../schemas/{$version}.yaml";
    }
}
