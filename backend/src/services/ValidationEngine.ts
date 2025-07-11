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
    
    // Add UUID format support (case-insensitive)
    this.ajv.addFormat('UUID', /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    this.ajv.addFormat('uuid', /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    
    // Add decimal format support for financial values
    this.ajv.addFormat('decimal', /^-?\d+(\.\d+)?$/);
    this.ajv.addFormat('DECIMAL', /^-?\d+(\.\d+)?$/);
  }

  public validateAgainstSchema(payload: unknown, schema: object): ValidationResult {
    try {
      // For OpenAPI schemas, we need to compile the complete schema with all references
      const compiledSchema = this.compileOpenAPISchema(schema);
      const isValid = compiledSchema(payload);

      return {
        isValid,
        errors: isValid ? undefined : this.processValidationErrors(compiledSchema.errors || []),
        version: this.detectSchemaVersion(schema)
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          path: '',
          message: `Schema compilation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          schemaPath: ''
        }],
        version: this.detectSchemaVersion(schema)
      };
    }
  }

  private compileOpenAPISchema(schema: any): any {
    // If this is an OpenAPI document, we need to handle it specially
    if (schema.openapi && schema.components?.schemas) {
      // For OpenAPI documents, we need to add all schemas first so references can be resolved
      const schemas = schema.components.schemas;
      
      // Add each schema component to AJV's schema registry
      for (const [schemaName, schemaDefinition] of Object.entries(schemas)) {
        const schemaId = `#/components/schemas/${schemaName}`;
        try {
          // Remove existing schema if it exists
          this.ajv.removeSchema(schemaId);
        } catch (error) {
          // Ignore if schema doesn't exist
        }
        
        try {
          this.ajv.addSchema(schemaDefinition as object, schemaId);
        } catch (error) {
          // Schema might have circular references, skip for now
        }
      }

      // Now try to compile the Order schema
      const orderSchema = schemas.Order;
      if (!orderSchema) {
        throw new Error('No Order schema found to validate against');
      }

      // Try to compile the Order schema directly
      try {
        return this.ajv.compile(orderSchema as object);
      } catch (error) {
        // If compilation fails, try to resolve references manually
        const resolvedSchema = this.resolveReferences(orderSchema, schemas);
        return this.ajv.compile(resolvedSchema);
      }
    }

    // For regular JSON schemas, compile directly
    return this.ajv.compile(schema);
  }

  private resolveReferences(schema: any, allSchemas: any): any {
    if (typeof schema !== 'object' || schema === null) {
      return schema;
    }

    if (Array.isArray(schema)) {
      return schema.map(item => this.resolveReferences(item, allSchemas));
    }

    if (schema.$ref) {
      const refPath = schema.$ref;
      if (refPath.startsWith('#/components/schemas/')) {
        const schemaPath = refPath.replace('#/components/schemas/', '');
        const parts = schemaPath.split('/');
        
        let resolvedSchema = allSchemas[parts[0]];
        for (let i = 1; i < parts.length; i++) {
          if (resolvedSchema && resolvedSchema[parts[i]]) {
            resolvedSchema = resolvedSchema[parts[i]];
          } else {
            // Can't resolve reference, return as is
            return schema;
          }
        }
        
        return this.resolveReferences(resolvedSchema, allSchemas);
      }
    }

    const resolved: any = {};
    for (const [key, value] of Object.entries(schema)) {
      resolved[key] = this.resolveReferences(value, allSchemas);
    }
    
    return resolved;
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