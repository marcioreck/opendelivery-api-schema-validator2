<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'opendelivery-api-schema-validator2/validate',
        'opendelivery-api-schema-validator2/compatibility',
        'opendelivery-api-schema-validator2/certify',
    ];
}
