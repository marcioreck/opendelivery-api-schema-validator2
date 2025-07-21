<?php

namespace OpenDelivery\LaravelValidator\Tests\Feature;

use OpenDelivery\LaravelValidator\Tests\Helpers\TestPayloads;
use Tests\TestCase;

class ValidationEndpointTest extends TestCase
{
    private $baseUrl = 'http://localhost:8010';
    private $apiPrefix = '/opendelivery/v1';

    public function setUp(): void
    {
        parent::setUp();
        // Ensure we're testing against the correct Laravel instance
        $this->baseUrl = config('app.url', 'http://localhost:8010');
    }

    /**
     * Test schemas endpoint returns all available versions
     */
    public function test_schemas_endpoint_returns_all_versions()
    {
        $response = $this->get($this->apiPrefix . '/schemas');
        
        $response->assertStatus(200);
        $schemas = $response->json();
        
        $this->assertArrayHasKey('schemas', $schemas);
        $this->assertContains('1.0.0', $schemas['schemas']);
        $this->assertContains('1.6.0-rc', $schemas['schemas']);
        $this->assertContains('beta', $schemas['schemas']);
        
        // Verify all expected versions are present
        $expectedVersions = TestPayloads::getAllVersions();
        foreach ($expectedVersions as $version) {
            $this->assertContains($version, $schemas['schemas']);
        }
    }

    /**
     * Test validation endpoint with valid order v1.0.0
     */
    public function test_validate_valid_order_v1()
    {
        $payload = TestPayloads::getValidOrderV1();
        
        $response = $this->postJson($this->apiPrefix . '/validate', [
            'payload' => $payload,
            'version' => '1.0.0'
        ]);

        $response->assertStatus(200);
        $result = $response->json();
        
        $this->assertTrue($result['valid']);
        $this->assertEmpty($result['errors']);
        $this->assertEquals('1.0.0', $result['version']);
    }

    /**
     * Test validation endpoint with valid order v1.6.0-rc
     */
    public function test_validate_valid_order_v16rc()
    {
        $payload = TestPayloads::getValidOrderV16RC();
        
        $response = $this->postJson($this->apiPrefix . '/validate', [
            'payload' => $payload,
            'version' => '1.0.0'
        ]);

        $response->assertStatus(200);
        $result = $response->json();
        
        $this->assertFalse($result['valid']);
        $this->assertNotEmpty($result['errors']);
        $this->assertEquals('1.0.0', $result['version']);
    }

    /**
     * Test validation endpoint with invalid order (wrong types)
     */
    public function test_validate_invalid_order_types()
    {
        $payload = TestPayloads::getInvalidOrderTypes();
        
        $response = $this->postJson($this->apiPrefix . '/validate', [
            'payload' => $payload,
            'version' => '1.0.0'
        ]);

        $response->assertStatus(200);
        $result = $response->json();
        
        $this->assertFalse($result['valid']);
        $this->assertNotEmpty($result['errors']);
        $this->assertEquals('1.0.0', $result['version']);
    }

    /**
     * Test compatibility endpoint with valid order
     */
    public function test_compatibility_check_valid_order()
    {
        $payload = TestPayloads::getBasicOrderV1();
        
        $response = $this->postJson($this->apiPrefix . '/compatibility', [
            'payload' => $payload
        ]);

        $response->assertStatus(200);
        $result = $response->json();
        
        $this->assertArrayHasKey('compatibility', $result);
        
        // Should be compatible with v1.0.x versions
        $v1CompatibleVersions = TestPayloads::getV1CompatibleVersions();
        foreach ($v1CompatibleVersions as $version) {
            $this->assertArrayHasKey($version, $result['compatibility']);
            $this->assertTrue($result['compatibility'][$version]['compatible']);
        }
    }

    /**
     * Test compatibility endpoint with invalid order
     */
    public function test_compatibility_check_invalid_order()
    {
        $payload = TestPayloads::getInvalidOrderMinimal();
        
        $response = $this->postJson($this->apiPrefix . '/compatibility', [
            'payload' => $payload
        ]);

        $response->assertStatus(200);
        $result = $response->json();
        
        $this->assertArrayHasKey('compatibility', $result);
        
        // Should be incompatible with all versions
        $allVersions = TestPayloads::getAllVersions();
        foreach ($allVersions as $version) {
            $this->assertArrayHasKey($version, $result['compatibility']);
            $this->assertFalse($result['compatibility'][$version]['compatible']);
        }
    }

    /**
     * Test certification endpoint with valid order
     */
    public function test_certify_valid_order()
    {
        $payload = TestPayloads::getBasicOrderV1();
        
        $response = $this->postJson($this->apiPrefix . '/certify', [
            'payload' => $payload,
            'version' => '1.0.0'
        ]);

        $response->assertStatus(200);
        $result = $response->json();
        
        $this->assertTrue($result['certified']);
        $this->assertEquals('1.0.0', $result['version']);
        $this->assertNotEmpty($result['certificate']);
    }

    /**
     * Test certification endpoint with invalid order
     */
    public function test_certify_invalid_order()
    {
        $payload = TestPayloads::getInvalidOrderMinimal();
        
        $response = $this->postJson($this->apiPrefix . '/certify', [
            'payload' => $payload,
            'version' => '1.0.0'
        ]);

        $response->assertStatus(422);
        $result = $response->json();
        
        $this->assertArrayHasKey('error', $result);
        $this->assertStringContainsString('Payload is not valid', $result['error']);
    }

    /**
     * Test CORS headers are present in responses
     */
    public function test_cors_headers_present()
    {
        $response = $this->get($this->apiPrefix . '/schemas');
        
        $response->assertStatus(200);
        $response->assertHeader('Access-Control-Allow-Origin', '*');
        $response->assertHeader('Access-Control-Allow-Methods');
        $response->assertHeader('Access-Control-Allow-Headers');
    }

    /**
     * Test error handling for missing payload
     */
    public function test_validate_missing_payload()
    {
        $response = $this->postJson($this->apiPrefix . '/validate', [
            'version' => '1.0.0'
            // Missing payload
        ]);

        $response->assertStatus(422);
        $result = $response->json();
        
        $this->assertArrayHasKey('error', $result);
        $this->assertStringContainsString('Payload is required', $result['error']);
    }

    /**
     * Test error handling for invalid version
     */
    public function test_validate_invalid_version()
    {
        $payload = TestPayloads::getBasicOrderV1();
        
        $response = $this->postJson($this->apiPrefix . '/validate', [
            'payload' => $payload,
            'version' => '99.99.99' // Non-existent version
        ]);

        $response->assertStatus(400);
        $result = $response->json();
        
        $this->assertArrayHasKey('error', $result);
        $this->assertStringContainsString('Schema version not found', $result['error']);
    }

    /**
     * Test generated test payload functionality
     */
    public function test_generated_payload_validation()
    {
        $payload = TestPayloads::generateTestPayload([
            'displayId' => 'GENERATED-TEST-001',
            'merchant' => [
                'name' => 'Generated Test Merchant'
            ]
        ]);
        
        $response = $this->postJson($this->apiPrefix . '/validate', [
            'payload' => $payload,
            'version' => '1.0.0'
        ]);

        $response->assertStatus(200);
        $result = $response->json();
        
        $this->assertTrue($result['valid']);
        $this->assertEquals('GENERATED-TEST-001', $payload['displayId']);
        $this->assertEquals('Generated Test Merchant', $payload['merchant']['name']);
    }
}
