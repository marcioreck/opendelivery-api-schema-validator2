import { ValidationEngine } from './ValidationEngine';
import { ValidationResult, ApiVersion } from '../types';
import { SchemaManager } from './SchemaManager';

export class Validator {
  private validationEngine: ValidationEngine;
  private schemaManager: SchemaManager;

  constructor() {
    this.validationEngine = new ValidationEngine();
    this.schemaManager = new SchemaManager();
  }

  public async initialize(): Promise<void> {
    await this.schemaManager.loadSchemas();
  }

  public async validate(payload: unknown, version: ApiVersion): Promise<ValidationResult> {
    const schema = await this.schemaManager.getSchema(version);
    if (!schema) {
      return {
        isValid: false,
        errors: [{
          path: '',
          message: `Schema version ${version} not found`,
          schemaPath: ''
        }],
        version
      };
    }

    // First check for sensitive data
    const securityErrors = this.validationEngine.validateSecurityRequirements(payload);
    if (securityErrors.length > 0) {
      return {
        isValid: false,
        errors: securityErrors,
        version
      };
    }

    // Then validate against schema
    const result = this.validationEngine.validateAgainstSchema(payload, schema);
    return {
      ...result,
      version
    };
  }
} 