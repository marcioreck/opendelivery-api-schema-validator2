import axios from 'axios';
import { ValidationResult, CompatibilityReport, CertificationResult, ApiVersion } from './types';

// Configure API base URL for local development
// Use relative URLs in development to leverage Vite proxy
const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:3001');

// Debug log for development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    baseUrl: apiBaseUrl,
    currentLocation: window.location.href,
    usingProxy: apiBaseUrl === '',
    env: {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      NODE_ENV: import.meta.env.NODE_ENV
    }
  });
  
  // Test connectivity on module load
  setTimeout(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/health`, { timeout: 5000 });
      console.log('✅ API Health Check: OK', response.data.service);
    } catch (error: any) {
      console.error('❌ API Health Check: Failed', error.message);
      if (error.code === 'ERR_NETWORK') {
        console.error('💡 Dica: Verifique se o backend está rodando na porta 3001');
      }
    }
  }, 1000);
}

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000, // 10 seconds timeout
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
    // Enhanced error logging for debugging
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL
    };
    
    console.error('❌ Response error:', errorDetails);
    
    // Add user-friendly error message
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      error.userMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
    } else if (error.code === 'ENOTFOUND') {
      error.userMessage = 'Servidor não encontrado. Verifique a configuração da URL.';
    } else if (error.code === 'ETIMEDOUT') {
      error.userMessage = 'Timeout: O servidor demorou muito para responder.';
    } else if (error.response?.status >= 500) {
      error.userMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
    } else if (error.response?.status === 404) {
      error.userMessage = 'Endpoint não encontrado. Verifique a URL da API.';
    } else {
      error.userMessage = error.response?.data?.message || 'Erro desconhecido na comunicação com o servidor.';
    }
    
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
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = (error as any).userMessage || error.response?.data?.error || 'Validation failed';
      throw new Error(errorMessage);
    }
    throw new Error('Erro inesperado durante a validação');
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
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = (error as any).userMessage || error.response?.data?.error || 'Compatibility check failed';
      throw new Error(errorMessage);
    }
    throw new Error('Erro inesperado durante a verificação de compatibilidade');
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
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = (error as any).userMessage || error.response?.data?.error || 'Certification failed';
      throw new Error(errorMessage);
    }
    throw new Error('Erro inesperado durante a certificação');
  }
}; 