// OpenDelivery Laravel Validator - TypeScript Types
// Synchronized with frontend standalone types

export type ApiVersion = 
  | '1.0.0'
  | '1.0.1'
  | '1.1.0'
  | '1.1.1'
  | '1.2.0'
  | '1.2.1'
  | '1.3.0'
  | '1.4.0'
  | '1.5.0'
  | '1.6.0-rc'
  | 'beta';

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
  addedIn: string;
  required: boolean;
  type: string;
  description: string;
}

export interface CertificationResult {
  certified: boolean;
  score: number;
  maxScore: number;
  percentage: number;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  checks: CertificationCheck[];
}

export interface CertificationCheck {
  name: string;
  passed: boolean;
  score: number;
  maxScore: number;
  category: string;
  description: string;
  errors?: string[];
}

export interface SchemaVersion {
  version: string;
  name: string;
  description: string;
  releaseDate: string;
  status: 'stable' | 'beta' | 'deprecated';
  isDefault: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

export interface ValidationRequest {
  payload: object;
  version: string;
  strict?: boolean;
}

export interface CompatibilityRequest {
  fromVersion: string;
  toVersion: string;
  payload?: object;
}

export interface CertificationRequest {
  payload: object;
  version: string;
  includeWarnings?: boolean;
}

// Component Props Types
export interface ValidationFormProps {
  onValidate: (request: ValidationRequest) => Promise<ValidationResult>;
  loading?: boolean;
  initialPayload?: string;
  initialVersion?: string;
}

export interface CompatibilityFormProps {
  onCheck: (request: CompatibilityRequest) => Promise<CompatibilityResult>;
  loading?: boolean;
  availableVersions: SchemaVersion[];
}

export interface CertificationFormProps {
  onCertify: (request: CertificationRequest) => Promise<CertificationResult>;
  loading?: boolean;
  initialPayload?: string;
  initialVersion?: string;
}

export interface ResultDisplayProps {
  result: ValidationResult | CompatibilityResult | CertificationResult;
  type: 'validation' | 'compatibility' | 'certification';
}

export interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: number;
  options?: any;
}
