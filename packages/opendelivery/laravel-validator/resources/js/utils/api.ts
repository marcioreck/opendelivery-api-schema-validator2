// OpenDelivery Laravel Validator - API Utilities

import type {
  ValidationRequest,
  ValidationResult,
  CompatibilityRequest,
  CompatibilityResult,
  CertificationRequest,
  CertificationResult,
  SchemaVersion,
  ApiError,
} from '@/types';

// Base API configuration
const BASE_URL = '/opendelivery-api-schema-validator2';

// API error handler
const handleApiError = async (response: Response): Promise<never> => {
  let error: ApiError;
  
  try {
    const errorData = await response.json();
    error = {
      message: errorData.message || 'An error occurred',
      code: errorData.code || 'UNKNOWN_ERROR',
      details: errorData.details || null,
    };
  } catch {
    error = {
      message: `HTTP Error: ${response.status} ${response.statusText}`,
      code: 'HTTP_ERROR',
      details: { status: response.status, statusText: response.statusText },
    };
  }
  
  throw error;
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'same-origin',
  };
  
  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    await handleApiError(response);
  }
  
  return response.json();
};

// Health check API
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  return apiRequest('/health');
};

// Validation API
export const validatePayload = async (request: ValidationRequest): Promise<ValidationResult> => {
  return apiRequest('/validate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

// Compatibility API
export const checkCompatibility = async (request: CompatibilityRequest): Promise<CompatibilityResult> => {
  return apiRequest('/compatibility', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

// Certification API
export const certifyPayload = async (request: CertificationRequest): Promise<CertificationResult> => {
  return apiRequest('/certify', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

// Schema versions API
export const getSchemaVersions = async (): Promise<SchemaVersion[]> => {
  return apiRequest('/schemas');
};

// Get specific schema version
export const getSchemaVersion = async (version: string): Promise<any> => {
  return apiRequest(`/schemas/${version}`);
};

// Utility functions
export const formatValidationError = (error: ApiError): string => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return `Validation failed: ${error.message}`;
    case 'SCHEMA_NOT_FOUND':
      return `Schema version not found: ${error.message}`;
    case 'INVALID_JSON':
      return `Invalid JSON format: ${error.message}`;
    case 'NETWORK_ERROR':
      return `Network error: ${error.message}`;
    default:
      return error.message;
  }
};

export const isValidJson = (jsonString: string): boolean => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
};

export const formatJson = (jsonString: string): string => {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch {
    return jsonString;
  }
};

export const getScoreColor = (score: number): string => {
  if (score >= 90) return 'success';
  if (score >= 70) return 'warning';
  return 'danger';
};

export const getCertificationLevel = (percentage: number): string => {
  if (percentage >= 95) return 'expert';
  if (percentage >= 80) return 'advanced';
  if (percentage >= 60) return 'intermediate';
  return 'basic';
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const formatScore = (score: number, maxScore: number): string => {
  return `${score}/${maxScore}`;
};
