import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { ValidationResult, ValidationError, ApiVersion } from '../types';
import { logger } from '../utils/logger';

export class ValidationEngine {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false,
      validateFormats: true
    });
    this.configureAjv();
  }

  private configureAjv(): void {
    // Add formats
    addFormats(this.ajv);

    // Add custom formats
    this.ajv.addFormat('uuid', /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    this.ajv.addFormat('phone', /^\+?[1-9]\d{1,14}$/);
    
    // Add custom keywords
    this.ajv.addKeyword({
      keyword: 'isOrderStatus',
      validate: (schema: boolean, data: string) => {
        if (!schema) return true;
        const validStatuses = [
          'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DISPATCHED',
          'DELIVERED', 'CONCLUDED', 'CANCELLED'
        ];
        return validStatuses.includes(data);
      }
    });
  }

  public validateAgainstSchema(payload: unknown, schema: object): ValidationResult {
    try {
      const validate = this.ajv.compile(schema);
      const isValid = validate(payload);

      if (!isValid) {
        const errors = this.processValidationErrors(validate.errors || []);
        return {
          isValid: false,
          errors,
          version: this.detectSchemaVersion(schema)
        };
      }

      return {
        isValid: true,
        version: this.detectSchemaVersion(schema)
      };
    } catch (error) {
      logger.error('Validation engine error:', error);
      throw error;
    }
  }

  private processValidationErrors(errors: Ajv.ErrorObject[]): ValidationError[] {
    return errors.map(error => ({
      path: error.instancePath || '/',
      message: this.getReadableErrorMessage(error),
      schemaPath: error.schemaPath
    }));
  }

  private getReadableErrorMessage(error: Ajv.ErrorObject): string {
    const baseMessage = error.message || 'Unknown error';
    
    switch (error.keyword) {
      case 'required':
        return `Missing required field: ${error.params.missingProperty}`;
      case 'enum':
        return `Invalid value. Allowed values are: ${error.params.allowedValues.join(', ')}`;
      case 'type':
        return `Invalid type. Expected ${error.params.type}`;
      case 'format':
        return `Invalid format. Expected ${error.params.format} format`;
      case 'pattern':
        return `Invalid format. Value does not match required pattern`;
      case 'isOrderStatus':
        return `Invalid order status. Must be one of the allowed status values`;
      default:
        return baseMessage;
    }
  }

  private detectSchemaVersion(schema: object): string {
    // Attempt to detect schema version from schema object
    const schemaObj = schema as any;
    return schemaObj.info?.version || 'unknown';
  }

  public validateSecurityRequirements(payload: unknown): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for sensitive data exposure
    this.checkSensitiveData(payload, '', errors);

    // Add more security checks as needed
    return errors;
  }

  private checkSensitiveData(obj: unknown, path: string, errors: ValidationError[]): void {
    if (!obj || typeof obj !== 'object') return;

    const sensitivePatterns = {
      creditCard: /^[0-9]{16}$/,
      ssn: /^[0-9]{3}-[0-9]{2}-[0-9]{4}$/,
      password: /^password$/i
    };

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}/${key}` : key;

      // Check for sensitive key names
      if (key.toLowerCase().includes('password') || 
          key.toLowerCase().includes('secret') || 
          key.toLowerCase().includes('token')) {
        errors.push({
          path: currentPath,
          message: 'Potential sensitive data exposure',
          schemaPath: '#/security'
        });
      }

      // Recursively check nested objects
      if (value && typeof value === 'object') {
        this.checkSensitiveData(value, currentPath, errors);
      }
    }
  }
} 