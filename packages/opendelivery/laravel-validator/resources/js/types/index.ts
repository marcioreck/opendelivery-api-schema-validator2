// OpenDelivery Laravel Validator - TypeScript Types

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number;
  version: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface CompatibilityResult {
  compatible: boolean;
  fromVersion: string;
  toVersion: string;
  breakingChanges: BreakingChange[];
  deprecatedFields: DeprecatedField[];
  newFields: NewField[];
}

export interface BreakingChange {
  field: string;
  type: 'removed' | 'type_changed' | 'required_added' | 'format_changed';
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface DeprecatedField {
  field: string;
  deprecatedIn: string;
  removedIn?: string;
  replacement?: string;
  message: string;
}

export interface NewField {
  field: string;
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
