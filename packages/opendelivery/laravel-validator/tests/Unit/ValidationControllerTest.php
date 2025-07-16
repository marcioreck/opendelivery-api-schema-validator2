<?php

namespace OpenDelivery\LaravelValidator\Tests\Unit;

use OpenDelivery\LaravelValidator\Controllers\ValidateController;
use OpenDelivery\LaravelValidator\Services\ValidationService;
use OpenDelivery\LaravelValidator\Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Mockery;

class ValidationControllerTest extends TestCase
{
    protected ValidateController $controller;
    protected ValidationService $validationService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->validationService = Mockery::mock(ValidationService::class);
        $this->controller = new ValidateController($this->validationService);
    }

    /** @test */
    public function it_can_validate_payload()
    {
        $payload = ['order' => ['id' => 'test']];
        $version = '1.5.0';

        $expectedResult = [
            'valid' => true,
            'schema_version' => $version,
            'payload_size' => 25,
            'validation_time' => 0.1,
            'errors' => [],
            'warnings' => [],
            'score' => 85
        ];

        $this->validationService
            ->shouldReceive('validatePayload')
            ->with($payload, $version)
            ->once()
            ->andReturn($expectedResult);

        $request = Request::create('/validate', 'POST', [
            'payload' => $payload,
            'schema_version' => $version
        ]);

        $response = $this->controller->validate($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $responseData = $response->getData(true);
        $this->assertEquals('success', $responseData['status']);
        $this->assertEquals($expectedResult, $responseData['data']);
    }

    /** @test */
    public function it_handles_validation_errors()
    {
        $payload = ['invalid' => 'data'];
        $version = '1.5.0';

        $expectedResult = [
            'valid' => false,
            'schema_version' => $version,
            'payload_size' => 20,
            'validation_time' => 0.1,
            'errors' => [
                ['message' => 'Invalid payload structure', 'path' => '']
            ],
            'warnings' => [],
            'score' => 0
        ];

        $this->validationService
            ->shouldReceive('validatePayload')
            ->with($payload, $version)
            ->once()
            ->andReturn($expectedResult);

        $request = Request::create('/validate', 'POST', [
            'payload' => $payload,
            'schema_version' => $version
        ]);

        $response = $this->controller->validate($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $responseData = $response->getData(true);
        $this->assertEquals('success', $responseData['status']);
        $this->assertEquals($expectedResult, $responseData['data']);
    }

    /** @test */
    public function it_validates_with_default_version()
    {
        $payload = ['order' => ['id' => 'test']];

        $expectedResult = [
            'valid' => true,
            'schema_version' => '1.5.0',
            'payload_size' => 25,
            'validation_time' => 0.1,
            'errors' => [],
            'warnings' => [],
            'score' => 85
        ];

        $this->validationService
            ->shouldReceive('validatePayload')
            ->with($payload, null)
            ->once()
            ->andReturn($expectedResult);

        $request = Request::create('/validate', 'POST', [
            'payload' => $payload
        ]);

        $response = $this->controller->validate($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $responseData = $response->getData(true);
        $this->assertEquals('success', $responseData['status']);
        $this->assertEquals($expectedResult, $responseData['data']);
    }

    /** @test */
    public function it_handles_missing_payload()
    {
        $request = Request::create('/validate', 'POST', []);

        $this->validationService
            ->shouldReceive('validatePayload')
            ->with([], null)
            ->once()
            ->andReturn([
                'valid' => false,
                'errors' => [['message' => 'Payload is required']]
            ]);

        $response = $this->controller->validate($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $responseData = $response->getData(true);
        $this->assertEquals('success', $responseData['status']);
        $this->assertArrayHasKey('data', $responseData);
    }

    /** @test */
    public function it_can_check_compatibility()
    {
        $payload = ['order' => ['id' => 'test']];
        $fromVersion = '1.4.0';
        $toVersion = '1.5.0';

        $expectedResult = [
            'compatible' => true,
            'from_version' => $fromVersion,
            'to_version' => $toVersion,
            'compatibility_score' => 95,
            'breaking_changes' => [],
            'new_features' => ['feature1'],
            'deprecated_features' => [],
            'migration_notes' => []
        ];

        $this->validationService
            ->shouldReceive('checkCompatibility')
            ->with($fromVersion, $toVersion, $payload)
            ->once()
            ->andReturn($expectedResult);

        $request = Request::create('/compatibility', 'POST', [
            'payload' => $payload,
            'from_version' => $fromVersion,
            'to_version' => $toVersion
        ]);

        $response = $this->controller->compatibility($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $responseData = $response->getData(true);
        $this->assertEquals('success', $responseData['status']);
        $this->assertEquals($expectedResult, $responseData['data']);
    }

    /** @test */
    public function it_handles_compatibility_with_missing_versions()
    {
        $payload = ['order' => ['id' => 'test']];

        $request = Request::create('/compatibility', 'POST', [
            'payload' => $payload
        ]);

        $response = $this->controller->compatibility($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
        $responseData = $response->getData(true);
        $this->assertEquals('error', $responseData['status']);
        $this->assertArrayHasKey('message', $responseData);
    }

    /** @test */
    public function it_can_certify_payload()
    {
        $payload = [
            'order' => ['id' => 'test'],
            'metadata' => ['created_at' => '2024-01-01T00:00:00Z'],
            'tracking_id' => 'TRK-12345'
        ];
        $version = '1.5.0';

        $expectedResult = [
            'certified' => true,
            'score' => 92,
            'schema_version' => $version,
            'certificate_id' => 'OD-CERT-123456',
            'requirements' => ['req1', 'req2'],
            'validation' => ['valid' => true],
            'certification_level' => 'gold',
            'recommendations' => []
        ];

        $this->validationService
            ->shouldReceive('certifyPayload')
            ->with($payload, $version)
            ->once()
            ->andReturn($expectedResult);

        $request = Request::create('/certify', 'POST', [
            'payload' => $payload,
            'schema_version' => $version
        ]);

        $response = $this->controller->certify($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $responseData = $response->getData(true);
        $this->assertEquals('success', $responseData['status']);
        $this->assertEquals($expectedResult, $responseData['data']);
    }

    /** @test */
    public function it_handles_certification_failure()
    {
        $payload = ['invalid' => 'data'];
        $version = '1.5.0';

        $expectedResult = [
            'certified' => false,
            'score' => 15,
            'schema_version' => $version,
            'requirements' => ['req1', 'req2'],
            'validation' => ['valid' => false],
            'certification_level' => 'none',
            'recommendations' => ['Fix validation errors']
        ];

        $this->validationService
            ->shouldReceive('certifyPayload')
            ->with($payload, $version)
            ->once()
            ->andReturn($expectedResult);

        $request = Request::create('/certify', 'POST', [
            'payload' => $payload,
            'schema_version' => $version
        ]);

        $response = $this->controller->certify($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $responseData = $response->getData(true);
        $this->assertEquals('success', $responseData['status']);
        $this->assertEquals($expectedResult, $responseData['data']);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
