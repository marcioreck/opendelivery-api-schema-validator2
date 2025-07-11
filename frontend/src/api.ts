import axios from 'axios';
import { ValidationResult, CompatibilityReport, CertificationResult, ApiVersion } from './types';

// Use relative URLs to leverage Vite's proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const validatePayload = async (payload: unknown, version: string): Promise<ValidationResult> => {
  try {
    const response = await api.post('/api/validate', {
      schema_version: version,
      payload
    });
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
    const response = await api.post('/api/compatibility', {
      from_version: sourceVersion,
      to_version: targetVersion,
      payload
    });
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
    const response = await api.post('/api/certify', { 
      schema_version: version,
      payload 
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Certification failed');
    }
    throw error;
  }
}; 