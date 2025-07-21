<?php

namespace OpenDelivery\LaravelValidator\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use OpenDelivery\LaravelValidator\Services\ValidationService;

class ValidateController extends Controller
{
    protected ValidationService $validationService;

    public function __construct(ValidationService $validationService)
    {
        $this->validationService = $validationService;
    }

    public function validate(Request $request)
    {
        error_log("ValidateController::validate - START");
        
        // Handle CORS preflight
        if ($request->getMethod() === 'OPTIONS') {
            error_log("ValidateController::validate - OPTIONS request, returning CORS");
            return $this->corsResponse();
        }

        error_log("ValidateController::validate - Method: " . $request->getMethod());
        
        $payload = $request->input('payload', []);
        error_log("ValidateController::validate - Payload keys: " . json_encode(array_keys($payload)));
        
        // Prioridade: version (React Laravel) > schema_version (Frontend) > schema (fallback)
        $schemaVersion = $request->input('version') ?? $request->input('schema_version') ?? $request->input('schema');
        error_log("ValidateController::validate - Schema version: " . $schemaVersion);
        
        // Validação para garantir que a versão seja fornecida
        if (empty($schemaVersion)) {
            error_log("ValidateController::validate - ERROR: No schema version provided");
            return $this->corsResponse([
                'status' => 'error',
                'message' => 'Schema version is required. Please provide version, schema_version, or schema field.'
            ], 400);
        }

        try {
            error_log("ValidateController::validate - Calling ValidationService::validate");
            $result = $this->validationService->validate($payload, $schemaVersion);
            error_log("ValidateController::validate - ValidationService returned result");
            
            return $this->corsResponse([
                'status' => 'success',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            error_log("ValidateController::validate - EXCEPTION: " . $e->getMessage());
            return $this->corsResponse([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function compatibility(Request $request)
    {
        error_log("ValidateController::compatibility - START");
        
        // Handle CORS preflight
        if ($request->getMethod() === 'OPTIONS') {
            error_log("ValidateController::compatibility - OPTIONS request, returning CORS");
            return $this->corsResponse();
        }

        error_log("ValidateController::compatibility - Method: " . $request->getMethod());

        $payload = $request->input('payload', []);
        $fromVersion = $request->input('from_version') ?? $request->input('fromVersion');
        $toVersion = $request->input('to_version') ?? $request->input('toVersion');
        
        error_log("ValidateController::compatibility - fromVersion: " . $fromVersion . ", toVersion: " . $toVersion);

        try {
            if (!$fromVersion || !$toVersion) {
                error_log("ValidateController::compatibility - ERROR: Missing version parameters");
                return $this->corsResponse([
                    'status' => 'error',
                    'message' => 'Both from_version/fromVersion and to_version/toVersion parameters are required'
                ], 400);
            }

            error_log("ValidateController::compatibility - Calling ValidationService::checkCompatibility");
            $result = $this->validationService->checkCompatibility($payload, $fromVersion, $toVersion);
            error_log("ValidateController::compatibility - ValidationService returned result");
            
            return $this->corsResponse([
                'status' => 'success',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            error_log("ValidateController::compatibility - EXCEPTION: " . $e->getMessage());
            return $this->corsResponse([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function certify(Request $request)
    {
        // Handle CORS preflight
        if ($request->getMethod() === 'OPTIONS') {
            return $this->corsResponse();
        }

        $payload = $request->input('payload', []);
        $schemaVersion = $request->input('schema_version') ?? $request->input('version');

        try {
            $result = $this->validationService->certifyPayload($payload, $schemaVersion);
            
            return $this->corsResponse([
                'status' => 'success',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return $this->corsResponse([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add CORS headers to response
     */
    private function corsResponse($data = [], $status = 200)
    {
        return response()->json($data, $status)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-TOKEN')
            ->header('Access-Control-Allow-Credentials', 'true')
            ->header('Access-Control-Max-Age', '86400');
    }

    public function dashboard()
    {
        return view('opendelivery::dashboard');
    }

    public function health()
    {
        return response()->json([
            'status' => 'healthy',
            'service' => 'OpenDelivery API Schema Validator',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ]);
    }
}
