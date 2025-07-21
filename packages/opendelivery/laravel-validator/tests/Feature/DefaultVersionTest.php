<?php

namespace OpenDelivery\LaravelValidator\Tests\Feature;

use OpenDelivery\LaravelValidator\Tests\Helpers\TestPayloads;
use Tests\TestCase;

class DefaultVersionTest extends TestCase
{
    private $apiPrefix = '/opendelivery/v1';

    /**
     * Test that the default version is 1.5.0 when no version is specified
     */
    public function test_default_version_is_1_5_0()
    {
        $defaultVersion = TestPayloads::getDefaultVersion();
        $this->assertEquals('1.5.0', $defaultVersion);
        
        $configVersion = config('opendelivery.default_schema_version');
        $this->assertEquals('1.5.0', $configVersion);
    }

    /**
     * Test validation endpoint uses default version when none specified
     */
    public function test_validate_uses_default_version_when_not_specified()
    {
        $payload = TestPayloads::getCompleteOrderV12(); // This payload works with 1.5.0
        
        // Test without specifying version - should use default 1.5.0
        $response = $this->postJson($this->apiPrefix . '/validate', [
            'payload' => $payload
        ]);

        $response->assertStatus(200);
        $result = $response->json();
        
        // Should use default version 1.5.0
        $this->assertEquals('1.5.0', $result['version']);
        $this->assertTrue($result['valid']);
    }

    /**
     * Test that schemas endpoint marks 1.5.0 as default
     */
    public function test_schemas_endpoint_marks_1_5_0_as_default()
    {
        $response = $this->get($this->apiPrefix . '/schemas');
        
        $response->assertStatus(200);
        $schemas = $response->json();
        
        // Find the 1.5.0 version in the response
        $version150 = collect($schemas)->firstWhere('version', '1.5.0');
        $this->assertNotNull($version150);
        $this->assertTrue($version150['isDefault'] ?? false);
        
        // Make sure no other version is marked as default
        $otherDefaults = collect($schemas)
            ->where('version', '!=', '1.5.0')
            ->where('isDefault', true);
        $this->assertCount(0, $otherDefaults);
    }

    /**
     * Test compatibility endpoint uses payloads compatible with default version
     */
    public function test_compatibility_works_with_default_version_payloads()
    {
        $payload = TestPayloads::getCompleteOrderV12(); // Compatible with 1.5.0
        
        $response = $this->postJson($this->apiPrefix . '/compatibility', [
            'payload' => $payload
        ]);

        $response->assertStatus(200);
        $result = $response->json();
        
        $this->assertArrayHasKey('compatibility', $result);
        
        // Should be compatible with 1.5.0 (default version)
        $this->assertArrayHasKey('1.5.0', $result['compatibility']);
        $this->assertTrue($result['compatibility']['1.5.0']['compatible']);
    }

    /**
     * Test certification endpoint uses default version when not specified
     */
    public function test_certify_uses_default_version_when_not_specified()
    {
        $payload = TestPayloads::getCompleteOrderV12(); // Compatible with 1.5.0
        
        $response = $this->postJson($this->apiPrefix . '/certify', [
            'payload' => $payload
        ]);

        $response->assertStatus(200);
        $result = $response->json();
        
        $this->assertTrue($result['certified']);
        $this->assertEquals('1.5.0', $result['version']);
        $this->assertNotEmpty($result['certificate']);
    }
}
