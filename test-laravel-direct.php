<?php

// Teste direto no Laravel 10
echo "=== Teste Laravel 10 ===\n";

require_once './laravel-test-app/vendor/autoload.php';

$app = require_once './laravel-test-app/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Simular uma requisição
$request = Illuminate\Http\Request::create('/opendelivery/validate', 'POST', [
    'payload' => [
        'order' => [
            'id' => 'ORD-12345',
            'customer' => [
                'name' => 'John Doe',
                'email' => 'john@example.com'
            ]
        ]
    ],
    'schema_version' => '1.5.0'
]);

$request->headers->set('Content-Type', 'application/json');

try {
    $response = $kernel->handle($request);
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Content: " . $response->getContent() . "\n";
} catch (Exception $e) {
    echo "Erro: " . $e->getMessage() . "\n";
}

echo "\n=== Fim do teste ===\n";
