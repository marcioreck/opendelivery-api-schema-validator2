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
        $payload = $request->input('payload', []);
        $schemaVersion = $request->input('schema_version');

        try {
            $result = $this->validationService->validatePayload($payload, $schemaVersion);
            
            return response()->json([
                'status' => 'success',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function compatibility(Request $request)
    {
        $payload = $request->input('payload', []);
        $fromVersion = $request->input('from_version');
        $toVersion = $request->input('to_version');

        try {
            $result = $this->validationService->checkCompatibility($fromVersion, $toVersion, $payload);
            
            return response()->json([
                'status' => 'success',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function certify(Request $request)
    {
        $payload = $request->input('payload', []);
        $schemaVersion = $request->input('schema_version');

        try {
            $result = $this->validationService->certifyPayload($payload, $schemaVersion);
            
            return response()->json([
                'status' => 'success',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
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
