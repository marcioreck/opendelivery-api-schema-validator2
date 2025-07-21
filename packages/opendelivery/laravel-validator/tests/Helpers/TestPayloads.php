<?php

namespace OpenDelivery\LaravelValidator\Tests\Helpers;

class TestPayloads
{
    /**
     * Get a valid OpenDelivery order payload compatible with v1.0.0+ (Basic Order)
     */
    public static function getBasicOrderV1(): array
    {
        return json_decode(file_get_contents(__DIR__ . '/../fixtures/valid-order-v1.0.0.json'), true);
    }

    /**
     * Get a complete OpenDelivery order payload compatible with v1.0.0+
     */
    public static function getCompleteOrderV1(): array
    {
        return json_decode(file_get_contents(__DIR__ . '/../fixtures/complete-order-v1.0.0.json'), true);
    }

    /**
     * Get a valid OpenDelivery order payload compatible with v1.2.0+ (Basic Order)
     */
    public static function getBasicOrderV12(): array
    {
        return json_decode(file_get_contents(__DIR__ . '/../fixtures/valid-order-v1.6.0-rc.json'), true);
    }

    /**
     * Get a complete OpenDelivery order payload compatible with v1.2.0+
     */
    public static function getCompleteOrderV12(): array
    {
        return json_decode(file_get_contents(__DIR__ . '/../fixtures/complete-order-v1.2.0.json'), true);
    }

    /**
     * Get a valid Beta order payload
     */
    public static function getValidOrderBeta(): array
    {
        return json_decode(file_get_contents(__DIR__ . '/../fixtures/valid-order-beta.json'), true);
    }

    /**
     * Get an invalid minimal order payload (missing required fields)
     */
    public static function getInvalidOrderMinimal(): array
    {
        return json_decode(file_get_contents(__DIR__ . '/../fixtures/invalid-order-minimal.json'), true);
    }

    /**
     * Get an invalid order payload (wrong data types)
     */
    public static function getInvalidOrderTypes(): array
    {
        return json_decode(file_get_contents(__DIR__ . '/../fixtures/invalid-order-types.json'), true);
    }

    /**
     * Get an invalid order payload (invalid enum values)
     */
    public static function getInvalidOrderEnums(): array
    {
        return json_decode(file_get_contents(__DIR__ . '/../fixtures/invalid-order-enums.json'), true);
    }

    /**
     * Get all available test payloads organized by category
     */
    public static function getAllTestPayloads(): array
    {
        return [
            'v1_0_compatible' => [
                'basic' => [
                    'label' => 'Basic Order (v1.0.0 Compatible)',
                    'payload' => self::getBasicOrderV1()
                ],
                'complete' => [
                    'label' => 'Complete Order (v1.0.0 Compatible)',
                    'payload' => self::getCompleteOrderV1()
                ]
            ],
            'v1_2_plus' => [
                'basic' => [
                    'label' => 'Enhanced Order (v1.2.0+ Compatible)',
                    'payload' => self::getBasicOrderV12()
                ],
                'complete' => [
                    'label' => 'Latest Features (v1.5.0+ Compatible)',
                    'payload' => self::getCompleteOrderV12()
                ]
            ],
            'invalid' => [
                'missingRequired' => [
                    'label' => 'Missing Required Fields',
                    'payload' => self::getInvalidOrderMinimal()
                ],
                'invalidTypes' => [
                    'label' => 'Invalid Data Types',
                    'payload' => self::getInvalidOrderTypes()
                ],
                'invalidEnums' => [
                    'label' => 'Invalid Enum Values',
                    'payload' => self::getInvalidOrderEnums()
                ]
            ]
        ];
    }

    /**
     * Get all available schema versions from the test environment
     */
    public static function getAllVersions(): array
    {
        return ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta'];
    }

    /**
     * Get the default schema version
     */
    public static function getDefaultVersion(): string
    {
        return '1.5.0';
    }

    /**
     * Get stable schema versions only (v1.0.0 compatible)
     */
    public static function getV1CompatibleVersions(): array
    {
        return ['1.0.0', '1.0.1', '1.1.0', '1.1.1'];
    }

    /**
     * Get modern schema versions (v1.2.0+)
     */
    public static function getModernVersions(): array
    {
        return ['1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0'];
    }

    /**
     * Get beta/experimental schema versions
     */
    public static function getBetaVersions(): array
    {
        return ['1.6.0-rc', 'beta'];
    }

    /**
     * Generate a test payload with customizable properties
     */
    public static function generateTestPayload(array $overrides = []): array
    {
        $defaultPayload = [
            "id" => "test-" . uniqid(),
            "type" => "DELIVERY",
            "displayId" => "TEST-" . rand(1000, 9999),
            "createdAt" => date('c'),
            "orderTiming" => "INSTANT",
            "preparationStartDateTime" => date('c'),
            "merchant" => [
                "id" => "test-merchant-" . uniqid(),
                "name" => "Test Merchant"
            ],
            "items" => [
                [
                    "id" => "test-item-" . uniqid(),
                    "name" => "Test Item",
                    "quantity" => 1,
                    "unit" => "UNIT",
                    "unitPrice" => [
                        "value" => 10.00,
                        "currency" => "BRL"
                    ],
                    "totalPrice" => [
                        "value" => 10.00,
                        "currency" => "BRL"
                    ],
                    "externalCode" => "TEST-001"
                ]
            ],
            "total" => [
                "itemsPrice" => [
                    "value" => 10.00,
                    "currency" => "BRL"
                ],
                "otherFees" => [
                    "value" => 0.00,
                    "currency" => "BRL"
                ],
                "discount" => [
                    "value" => 0.00,
                    "currency" => "BRL"
                ],
                "orderAmount" => [
                    "value" => 10.00,
                    "currency" => "BRL"
                ]
            ],
            "payments" => [
                "prepaid" => 0.00,
                "pending" => 10.00,
                "methods" => [
                    [
                        "value" => 10.00,
                        "currency" => "BRL",
                        "type" => "PENDING",
                        "method" => "CREDIT"
                    ]
                ]
            ]
        ];

        return array_merge_recursive($defaultPayload, $overrides);
    }

    /**
     * Get expected compatibility matrix for test payloads
     */
    public static function getCompatibilityMatrix(): array
    {
        return [
            'basic-v1.0.0' => [
                'compatible_versions' => ['1.0.0', '1.0.1', '1.1.0', '1.1.1'],
                'incompatible_versions' => ['1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta']
            ],
            'complete-v1.0.0' => [
                'compatible_versions' => ['1.0.0', '1.0.1', '1.1.0', '1.1.1'],
                'incompatible_versions' => ['1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta']
            ],
            'basic-v1.2.0+' => [
                'compatible_versions' => ['1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0'],
                'incompatible_versions' => ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.6.0-rc', 'beta']
            ],
            'complete-v1.2.0+' => [
                'compatible_versions' => ['1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0'],
                'incompatible_versions' => ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.6.0-rc', 'beta']
            ],
            'beta' => [
                'compatible_versions' => ['beta'],
                'incompatible_versions' => ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc']
            ],
            'invalid-minimal' => [
                'compatible_versions' => [],
                'incompatible_versions' => ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta']
            ],
            'invalid-types' => [
                'compatible_versions' => [],
                'incompatible_versions' => ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta']
            ],
            'invalid-enums' => [
                'compatible_versions' => [],
                'incompatible_versions' => ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta']
            ]
        ];
    }
}
