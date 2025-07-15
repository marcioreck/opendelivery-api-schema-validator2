import axios from 'axios';
import { ValidationResult, CompatibilityReport, CertificationResult, ApiVersion } from './types';

// Configure API base URL based on environment
const getApiBaseUrl = () => {
  // Check if running in development (Vite dev server)
  if (import.meta.env.DEV) {
    return ''; // Use empty string for development - Vite proxy will handle /api routes
  }
  
  // Check for environment variable override
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Production: detect if running in Laravel subfolder
  const currentHost = window.location.origin;
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('/opendelivery-api-schema-validator2/')) {
    return `${currentHost}/opendelivery-api-schema-validator2`;
  }
  
  // Default fallback
  return '';
};

const apiBaseUrl = getApiBaseUrl();

// Debug log for development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    viteApiUrl: import.meta.env.VITE_API_URL,
    calculatedBaseUrl: apiBaseUrl,
    currentLocation: window.location.href
  });
}

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('📤 Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    return Promise.reject(error);
  }
);

export const validatePayload = async (payload: unknown, version: string): Promise<ValidationResult> => {
  console.log('🔍 validatePayload called:', { payload, version });
  
  try {
    const requestData = {
      schema_version: version,
      payload
    };
    
    console.log('📤 Sending request to:', api.defaults.baseURL + '/api/validate');
    console.log('📤 Request data:', requestData);
    
    const response = await api.post('/api/validate', requestData);
    
    console.log('📥 Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error in validatePayload:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('❌ Error response:', error.response.data);
      throw new Error(error.response.data.error || 'Validation failed');
    }
    throw error;
  }
};

export const checkCompatibility = async (
  sourceVersion: string,
  targetVersion: string,
  payload: unknown
): Promise<CompatibilityReport> => {
  console.log('🔍 checkCompatibility called:', { sourceVersion, targetVersion, payload });
  
  try {
    const requestData = {
      from_version: sourceVersion,
      to_version: targetVersion,
      payload
    };
    
    console.log('📤 Sending request to:', api.defaults.baseURL + '/api/compatibility');
    console.log('📤 Request data:', requestData);
    
    const response = await api.post('/api/compatibility', requestData);
    
    console.log('📥 Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error in checkCompatibility:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('❌ Error response:', error.response.data);
      throw new Error(error.response.data.error || 'Compatibility check failed');
    }
    throw error;
  }
};

export const certifyPayload = async (payload: unknown, version: string): Promise<CertificationResult> => {
  console.log('🔍 certifyPayload called:', { payload, version });
  
  try {
    const requestData = { 
      schema_version: version,
      payload 
    };
    
    console.log('📤 Sending request to:', api.defaults.baseURL + '/api/certify');
    console.log('📤 Request data:', requestData);
    
    const response = await api.post('/api/certify', requestData);
    
    console.log('📥 Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error in certifyPayload:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('❌ Error response:', error.response.data);
      throw new Error(error.response.data.error || 'Certification failed');
    }
    throw error;
  }
}; 