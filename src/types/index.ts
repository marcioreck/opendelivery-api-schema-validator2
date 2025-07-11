export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationError[];
  version: string;
}

export interface ValidationError {
  path: string;
  message: string;
  schemaPath: string;
}

export interface CompatibilityReport {
  sourceVersion: string;
  targetVersion: string;
  isCompatible: boolean;
  incompatibilities?: IncompatibilityIssue[];
}

export interface IncompatibilityIssue {
  path: string;
  reason: string;
  severity: 'ERROR' | 'WARNING';
  suggestedFix?: string;
}

export interface CertificationResult {
  isPassing: boolean;
  score: number;
  details: {
    schemaValidation: ValidationResult;
    compatibilityChecks: CompatibilityReport[];
    securityChecks: SecurityCheckResult[];
  };
}

export interface SecurityCheckResult {
  check: string;
  passed: boolean;
  details?: string;
}

export type ApiVersion = '1.0.0' | '1.1.0' | '1.2.0' | '1.3.0' | '1.4.0' | '1.5.0' | '1.6.0-rc'; 