export type ApiVersion = '1.0.0' | '1.1.0' | '1.2.0' | '1.3.0' | '1.4.0' | '1.5.0' | '1.6.0-rc';

export interface ValidationError {
  path: string;
  message: string;
  schemaPath: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationError[];
  version: string;
}

export interface CompatibilityResult {
  isCompatible: boolean;
  errors: ValidationError[];
}

export interface CertificationResult {
  score: number;
  details: CertificationDetail[];
  level: CertificationLevel;
  timestamp: string;
}

export interface CertificationDetail {
  category: string;
  score: number;
  maxScore: number;
  checks: CertificationCheck[];
}

export interface CertificationCheck {
  name: string;
  passed: boolean;
  score: number;
  message: string;
}

export type CertificationLevel = 'NONE' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'; 