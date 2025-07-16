import axios from 'axios';
import { ValidationResult, CompatibilityReport, CertificationResult, ApiVersion } from './types';

// Configure API base URL for local development
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Debug log for development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    baseUrl: apiBaseUrl,
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
    if (import.meta.env.DEV) {
      console.log('📤 Request:', {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        data: config.data
      });
    }
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
    if (import.meta.env.DEV) {
      console.log('📥 Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export const validatePayload = async (payload: unknown, version: string): Promise<ValidationResult> => {
  try {
    const requestData = {
      schema_version: version,
      payload
    };
    
    const response = await api.post('/api/validate', requestData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
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
  try {
    const requestData = {
      from_version: sourceVersion,
      to_version: targetVersion,
      payload
    };
    
    const response = await api.post('/api/compatibility', requestData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Compatibility check failed');
    }
    throw error;
  }
};

export const certifyPayload = async (payload: unknown, version: string): Promise<CertificationResult> => {
  try {
    const requestData = { 
      schema_version: version,
      payload 
    };
    
    const response = await api.post('/api/certify', requestData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Certification failed');
    }
    throw error;
  }
}; 