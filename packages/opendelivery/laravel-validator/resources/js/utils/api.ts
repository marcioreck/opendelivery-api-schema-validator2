// OpenDelivery Laravel Validator - API Utilities

declare global {
  interface Window {
    Laravel?: {
      apiUrl: string;
      csrfToken: string;
    };
  }
}

// Get the base API URL from Laravel configuration
const BASE_URL = (window as any).Laravel?.apiUrl || '/opendelivery-api-schema-validator2';

export const validatePayload = async (payload: any, version?: string) => {
  try {
    const response = await fetch(`${BASE_URL}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': (window as any).Laravel?.csrfToken || '',
      },
      body: JSON.stringify({
        payload,
        version,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Validation error:', error);
    throw error;
  }
};

export const checkCompatibility = async (fromVersion: string, toVersion: string, payload: any) => {
  try {
    const response = await fetch(`${BASE_URL}/compatibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': (window as any).Laravel?.csrfToken || '',
      },
      body: JSON.stringify({
        fromVersion,
        toVersion,
        payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Compatibility check error:', error);
    throw error;
  }
};

export const certifyPayload = async (payload: any, version?: string) => {
  try {
    const response = await fetch(`${BASE_URL}/certify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': (window as any).Laravel?.csrfToken || '',
      },
      body: JSON.stringify({
        payload,
        version,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Certification error:', error);
    throw error;
  }
};

export const getAvailableVersions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/schemas`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get versions error:', error);
    throw error;
  }
};
