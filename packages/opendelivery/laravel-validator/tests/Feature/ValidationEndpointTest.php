<?php

namespace OpenDelivery\LaravelValidator\Tests\Feature;

use OpenDelivery\LaravelValidator\Tests\TestCase;

class ValidationEndpointTest extends TestCase
{

    /** @test */
    public function it_can_validate_a_payload_via_api()
    {
        $payload = [
            'order' => [
                'id' => 'ORD-12345',
                'customer' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com'
                ]
            ],
            'metadata' => [
                'created_at' => '2024-01-01T00:00:00Z'
            ],
            'tracking_id' => 'TRK-12345'
        ];

        $response = $this->postJson('/api/opendelivery/validate', [
            'payload' => $payload,
            'version' => '1.5.0'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'valid',
            'schema_version',
            'payload_size',
            'validation_time',
            'errors',
            'warnings',
            'score'
        ]);
    }

    /** @test */
    public function it_validates_invalid_payload()
    {
        $payload = [
            'invalid' => 'structure'
        ];

        $response = $this->postJson('/api/opendelivery/validate', [
            'payload' => $payload,
            'version' => '1.5.0'
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'valid' => false
        ]);
        $response->assertJsonStructure([
            'errors' => []
        ]);
    }

    /** @test */
    public function it_requires_payload_parameter()
    {
        $response = $this->postJson('/api/opendelivery/validate', [
            'version' => '1.5.0'
        ]);

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'error'
        ]);
    }

    /** @test */
    public function it_uses_default_version_when_not_specified()
    {
        $payload = [
            'order' => [
                'id' => 'ORD-12345',
                'customer' => [
                    'name' => 'John Doe'
                ]
            ]
        ];

        $response = $this->postJson('/api/opendelivery/validate', [
            'payload' => $payload
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'valid',
            'schema_version'
        ]);
    }

    /** @test */
    public function it_handles_invalid_json_payload()
    {
        $response = $this->postJson('/api/opendelivery/validate', [
            'payload' => 'invalid json',
            'version' => '1.5.0'
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'valid' => false
        ]);
    }

    /** @test */
    public function it_can_check_compatibility()
    {
        $payload = [
            'order' => [
                'id' => 'ORD-12345',
                'customer' => [
                    'name' => 'John Doe'
                ]
            ]
        ];

        $response = $this->postJson('/api/opendelivery/compatibility', [
            'payload' => $payload,
            'from_version' => '1.4.0',
            'to_version' => '1.5.0'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'compatible',
            'from_version',
            'to_version',
            'compatibility_score',
            'breaking_changes',
            'new_features',
            'deprecated_features',
            'migration_notes'
        ]);
    }

    /** @test */
    public function it_requires_both_versions_for_compatibility()
    {
        $payload = [
            'order' => [
                'id' => 'ORD-12345'
            ]
        ];

        $response = $this->postJson('/api/opendelivery/compatibility', [
            'payload' => $payload,
            'from_version' => '1.4.0'
        ]);

        $response->assertStatus(400);
        $response->assertJsonStructure([
            'error'
        ]);
    }

    /** @test */
    public function it_can_certify_payload()
    {
        $payload = [
            'order' => [
                'id' => 'ORD-12345',
                'customer' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com'
                ]
            ],
            'metadata' => [
                'created_at' => '2024-01-01T00:00:00Z'
            ],
            'tracking_id' => 'TRK-12345'
        ];

        $response = $this->postJson('/api/opendelivery/certify', [
            'payload' => $payload,
            'version' => '1.5.0'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'certified',
            'score',
            'schema_version',
            'requirements',
            'validation',
            'certification_level',
            'recommendations'
        ]);
    }

    /** @test */
    public function it_can_list_schema_versions()
    {
        $response = $this->getJson('/api/opendelivery/schemas/versions');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'versions',
            'latest',
            'count'
        ]);
    }

    /** @test */
    public function it_can_get_schema_info()
    {
        $response = $this->getJson('/api/opendelivery/schemas/1.5.0');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'version',
            'title',
            'description'
        ]);
    }

    /** @test */
    public function it_handles_invalid_schema_version()
    {
        $response = $this->getJson('/api/opendelivery/schemas/999.0.0');

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'error'
        ]);
    }

    /** @test */
    public function it_can_compare_schema_versions()
    {
        $response = $this->getJson('/api/opendelivery/schemas/compare/1.4.0/1.5.0');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'from_version',
            'to_version',
            'compatibility',
            'breaking_changes',
            'new_features',
            'deprecated_features',
            'migration_notes'
        ]);
    }

    /** @test */
    public function it_can_get_validation_rules()
    {
        $response = $this->getJson('/api/opendelivery/schemas/1.5.0/rules');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'version',
            'rules'
        ]);
    }

    /** @test */
    public function it_can_get_schema_examples()
    {
        $response = $this->getJson('/api/opendelivery/schemas/1.5.0/examples');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'version',
            'examples'
        ]);
    }

    /** @test */
    public function it_handles_health_check()
    {
        $response = $this->getJson('/api/opendelivery/health');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'timestamp',
            'version',
            'schemas'
        ]);
    }
}
