import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { ValidationResult, ValidationError } from '../types';

export class ValidationEngine {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      strict: false, // Allow OpenAPI keywords
      validateFormats: true
    });
    addFormats(this.ajv);
  }

  public validateAgainstSchema(payload: unknown, schema: object): ValidationResult {
    // Extract the actual schema and its dependencies from OpenAPI document
    const { mainSchema, dependencies } = this.extractSchemas(schema);

    // Add all dependencies to AJV
    for (const [id, depSchema] of Object.entries(dependencies)) {
      this.ajv.addSchema(depSchema, `#/components/schemas/${id}`);
    }

    const validate = this.ajv.compile(mainSchema);
    const isValid = validate(payload);

    return {
      isValid,
      errors: isValid ? undefined : this.processValidationErrors(validate.errors || []),
      version: this.detectSchemaVersion(schema)
    };
  }

  private extractSchemas(schema: any): { mainSchema: object; dependencies: Record<string, object> } {
    // If this is an OpenAPI document
    if (schema.openapi && schema.components?.schemas) {
      const { Order, ...otherSchemas } = schema.components.schemas;
      
      // Return the main schema and its dependencies
      return {
        mainSchema: Order || schema,
        dependencies: otherSchemas
      };
    }

    // If it's a regular schema
    return {
      mainSchema: schema,
      dependencies: {}
    };
  }

  public validateSecurityRequirements(payload: unknown): ValidationError[] {
    const errors: ValidationError[] = [];
    this.checkSensitiveData(payload, '', errors);
    return errors;
  }

  private processValidationErrors(errors: ErrorObject[]): ValidationError[] {
    return errors.map(error => ({
      path: error.instancePath,
      message: this.getReadableErrorMessage(error),
      schemaPath: error.schemaPath
    }));
  }

  private getReadableErrorMessage(error: ErrorObject): string {
    switch (error.keyword) {
      case 'type':
        return `Expected ${error.params.type} but got ${typeof error.data}`;
      case 'required':
        return `Missing required property: ${error.params.missingProperty}`;
      case 'enum':
        return `Value must be one of: ${error.params.allowedValues.join(', ')}`;
      case 'format':
        return `Invalid ${error.params.format} format`;
      default:
        return error.message || 'Validation error';
    }
  }

  private detectSchemaVersion(schema: object): string {
    return (schema as any).info?.version || 'unknown';
  }

  private checkSensitiveData(obj: unknown, path: string, errors: ValidationError[]): void {
    if (typeof obj !== 'object' || obj === null) return;

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        this.checkSensitiveData(item, `${path}[${index}]`, errors);
      });
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      // Check for sensitive field names
      if (/password|token|secret|key|credit.*card/i.test(key)) {
        errors.push({
          path: currentPath,
          message: 'Potential sensitive data detected',
          schemaPath: ''
        });
      }

      // Check for sensitive patterns in values
      if (typeof value === 'string') {
        if (/^\d{16}$/.test(value)) { // Credit card number pattern
          errors.push({
            path: currentPath,
            message: 'Potential credit card number detected',
            schemaPath: ''
          });
        }
      }

      // Recursively check nested objects
      if (typeof value === 'object' && value !== null) {
        this.checkSensitiveData(value, currentPath, errors);
      }
    }
  }
} 