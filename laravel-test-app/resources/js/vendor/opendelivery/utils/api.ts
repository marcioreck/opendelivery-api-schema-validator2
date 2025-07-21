// OpenDelivery Laravel Validator - API Utilities

declare global {
  interface Window {
    Laravel?: {
      apiUrl: string;
      csrfToken: string;
      appUrl: string;
      locale: string;
    };
  }
}

// Determine if we're in Laravel context or standalone
const isLaravelContext = typeof window !== 'undefined' && window.Laravel;

// Configure API base URL based on context
const getApiBaseUrl = () => {
  if (isLaravelContext) {
    return window.Laravel?.apiUrl || '/opendelivery-api-schema-validator2';
  }
  
  // Standalone frontend fallback
  return '/api';
};

const BASE_URL = getApiBaseUrl();

// Simple debug log for Laravel context
if (isLaravelContext && window.Laravel) {
  console.log('🔧 Laravel Package API Configuration:', {
    apiUrl: BASE_URL,
    hasCSRF: !!window.Laravel.csrfToken
  });
}

export const validatePayload = async (payload: any, version?: string): Promise<any> => {
  try {
    const requestData = {
      version: version || '1.5.0', // Default version
      payload
    };
    
    const response = await fetch(`${BASE_URL}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': isLaravelContext ? (window.Laravel?.csrfToken || '') : '',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Validation error:', error);
    throw error;
  }
};

export const checkCompatibility = async (fromVersion: string, toVersion: string, payload: any): Promise<any> => {
  try {
    const requestData = {
      fromVersion,
      toVersion,
      payload
    };
    
    const response = await fetch(`${BASE_URL}/compatibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': isLaravelContext ? (window.Laravel?.csrfToken || '') : '',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Compatibility check error:', error);
    throw error;
  }
};

export const certifyPayload = async (payload: any, version: string): Promise<any> => {
  try {
    const requestData = {
      version,
      payload
    };
    
    const response = await fetch(`${BASE_URL}/certify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': isLaravelContext ? (window.Laravel?.csrfToken || '') : '',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Certification error:', error);
    throw error;
  }
};

export const getAvailableVersions = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/schemas`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': isLaravelContext ? (window.Laravel?.csrfToken || '') : '',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.versions || ["1.0.0", "1.0.1", "1.1.0", "1.1.1", "1.2.0", "1.2.1", "1.3.0", "1.4.0", "1.5.0", "1.6.0-rc", "beta"];
  } catch (error: any) {
    console.error('Get versions error:', error);
    // Return fallback versions
    return ["1.0.0", "1.0.1", "1.1.0", "1.1.1", "1.2.0", "1.2.1", "1.3.0", "1.4.0", "1.5.0", "1.6.0-rc", "beta"];
  }
};

// Health check function
export const healthCheck = async (): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Health check error:', error);
    throw error;
  }
};
