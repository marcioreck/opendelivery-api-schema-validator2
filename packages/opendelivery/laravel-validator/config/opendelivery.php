<?php

return [
    /*
    |--------------------------------------------------------------------------
    | OpenDelivery API Schema Validator Configuration
    |--------------------------------------------------------------------------
    */

    'default_schema_version' => '1.6.0-rc',

    'supported_versions' => [
        '1.0.0',
        '1.0.1',
        '1.1.0',
        '1.1.1',
        '1.2.0',
        '1.2.1',
        '1.3.0',
        '1.4.0',
        '1.5.0',
        '1.6.0-rc',
        'beta',
    ],

    'cache' => [
        'enabled' => true,
        'ttl' => 3600, // 1 hour
        'key_prefix' => 'opendelivery_',
    ],

    'nodejs_backend' => [
        'enabled' => false,
        'url' => 'http://localhost:3001',
        'timeout' => 30,
    ],

    'frontend' => [
        'enabled' => true,
        'route_prefix' => 'opendelivery',
        'middleware' => ['web'],
    ],
];
