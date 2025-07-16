<?php

// Teste direto da validação sem usar o servidor web
require_once __DIR__ . '/packages/opendelivery/laravel-validator/vendor/autoload.php';

use OpenDelivery\LaravelValidator\Services\SchemaManager;
use OpenDelivery\LaravelValidator\Services\ValidationService;

echo "=== Teste de Validação OpenDelivery ===\n\n";

try {
    // Inicializar os serviços
    $schemaManager = new SchemaManager(__DIR__ . '/packages/opendelivery/laravel-validator/schemas');
    $validationService = new ValidationService($schemaManager);
    
    // Payload de teste
    $payload = [
        'order' => [
            'id' => 'ORD-12345',
            'customer' => [
                'name' => 'John Doe',
                'email' => 'john@example.com'
            ],
            'items' => [
                [
                    'product_id' => 'PROD-001',
                    'quantity' => 2,
                    'price' => 29.99
                ]
            ],
            'total' => 59.98,
            'status' => 'pending'
        ],
        'delivery' => [
            'address' => [
                'street' => '123 Main St',
                'city' => 'Anytown',
                'postal_code' => '12345'
            ],
            'scheduled_date' => '2024-12-20T10:00:00Z'
        ]
    ];
    
    echo "1. Testando listagem de schemas disponíveis:\n";
    $versions = $schemaManager->getAvailableVersions();
    foreach ($versions as $version) {
        echo "   - {$version}\n";
    }
    
    echo "\n2. Testando validação com schema 1.5.0:\n";
    $result = $validationService->validatePayload($payload, '1.5.0');
    
    echo "   Resultado: " . ($result['valid'] ? 'VÁLIDO' : 'INVÁLIDO') . "\n";
    echo "   Schema: " . $result['schema_version'] . "\n";
    echo "   Score: " . $result['score'] . "\n";
    
    if (!empty($result['errors'])) {
        echo "   Erros:\n";
        foreach ($result['errors'] as $error) {
            echo "     - {$error['property']}: {$error['message']}\n";
        }
    }
    
    if (!empty($result['warnings'])) {
        echo "   Avisos:\n";
        foreach ($result['warnings'] as $warning) {
            echo "     - {$warning['message']}\n";
        }
    }
    
    echo "\n3. Testando compatibilidade entre versões:\n";
    $compatibility = $validationService->checkCompatibility('1.4.0', '1.5.0', $payload);
    echo "   Compatível: " . ($compatibility['compatible'] ? 'SIM' : 'NÃO') . "\n";
    echo "   Score: " . $compatibility['compatibility_score'] . "\n";
    
    echo "\n4. Testando certificação:\n";
    $certification = $validationService->certifyPayload($payload, '1.5.0');
    echo "   Certificado: " . ($certification['certified'] ? 'SIM' : 'NÃO') . "\n";
    echo "   Score: " . $certification['score'] . "\n";
    echo "   Nível: " . $certification['certification_level'] . "\n";
    
    if ($certification['certified'] && !empty($certification['certificate_id'])) {
        echo "   ID do Certificado: " . $certification['certificate_id'] . "\n";
    }
    
    echo "\n=== Teste concluído com sucesso! ===\n";
    
} catch (Exception $e) {
    echo "ERRO: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
