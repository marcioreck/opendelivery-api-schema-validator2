import axios from 'axios';
import { ValidationResult, CompatibilityReport, CertificationResult, ApiVersion } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const validatePayload = async (payload: unknown, version: string): Promise<ValidationResult> => {
  try {
    const response = await api.post('/api/validate', {
      version,
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
      source_version: sourceVersion,
      target_version: targetVersion,
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
      version,
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