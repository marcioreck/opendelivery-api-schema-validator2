export type ApiVersion = 
  | '1.0.0'
  | '1.1.0'
  | '1.2.0'
  | '1.3.0'
  | '1.4.0'
  | '1.5.0'
  | '1.6.0-rc'
  | 'BETA';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  version: ApiVersion;
  timestamp: string;
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
  severity: 'error';
}

export interface ValidationWarning {
  path: string;
  message: string;
  code: string;
  severity: 'warning';
}

export interface CompatibilityReport {
  sourceVersion: ApiVersion;
  targetVersion: ApiVersion;
  isCompatible: boolean;
  breakingChanges: CompatibilityIssue[];
  deprecations: CompatibilityIssue[];
  newFeatures: CompatibilityIssue[];
  timestamp: string;
}

export interface CompatibilityIssue {
  type: 'breaking' | 'deprecation' | 'feature';
  path: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  migration?: string;
}

export interface CertificationResult {
  isCertified: boolean;
  version: ApiVersion;
  compliance: ComplianceCheck[];
  score: number;
  timestamp: string;
}

export interface ComplianceCheck {
  rule: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  details?: string;
} 