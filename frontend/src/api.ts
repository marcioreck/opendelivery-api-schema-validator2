import axios from 'axios';
import { ValidationResult, CompatibilityReport, CertificationResult, ApiVersion } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const validatePayload = async (data: { schema_version: string; payload: unknown }): Promise<ValidationResult> => {
  try {
    const response = await api.post('/api/validate', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Validation failed');
    }
    throw error;
  }
};

export const checkCompatibility = async (
  sourceVersion: ApiVersion,
  targetVersion: ApiVersion
): Promise<CompatibilityReport> => {
  try {
    const response = await api.post('/api/compatibility', {
      sourceVersion,
      targetVersion
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Compatibility check failed');
    }
    throw error;
  }
};

export const certifyPayload = async (payload: unknown): Promise<CertificationResult> => {
  try {
    const response = await api.post('/api/certify', { payload });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Certification failed');
    }
    throw error;
  }
}; 