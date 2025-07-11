import { ApiVersion } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export class ValidationService {
  private schemas: Map<string, any>;

  constructor() {
    this.schemas = new Map();
    this.loadSchemas();
  }

  public async validate(version: string, payload: any) {
    const schema = this.schemas.get(version);
    if (!schema) {
      return {
        valid: false,
        errors: [{
          message: `Schema version ${version} not found`
        }]
      };
    }

    try {
      // Get the Order schema from the OpenAPI spec
      const orderSchema = schema.components?.schemas?.Order;
      if (!orderSchema) {
        return {
          valid: false,
          errors: [{
            message: `Schema version ${version} does not contain Order definition`
          }]
        };
      }

      // Validate the payload
      const validationErrors = this.validateStructure(payload, orderSchema, '');
      if (validationErrors.length > 0) {
        return {
          valid: false,
          errors: validationErrors,
          schema_version: version
        };
      }

      return {
        valid: true,
        details: {
          schema_version: version,
          validated_at: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        valid: false,
        errors: [{
          message: error instanceof Error ? error.message : 'Validation error'
        }]
      };
    }
  }

  private validateStructure(payload: any, schema: any, path: string): Array<{path: string, message: string, details?: any}> {
    const errors: Array<{path: string, message: string, details?: any}> = [];

    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in payload)) {
          errors.push({
            path: path ? `${path}.${field}` : field,
            message: `Required field '${field}' is missing`
          });
        }
      }
    }

    // Check properties types and values
    if (schema.properties) {
      for (const [field, def] of Object.entries<any>(schema.properties)) {
        if (field in payload) {
          const value = payload[field];
          const fieldPath = path ? `${path}.${field}` : field;
          
          // Check type
          if (def.type === 'string' && typeof value !== 'string') {
            errors.push({
              path: fieldPath,
              message: `Field '${field}' must be a string`,
              details: { type: typeof value }
            });
          }
          if (def.type === 'number' && typeof value !== 'number') {
            errors.push({
              path: fieldPath,
              message: `Field '${field}' must be a number`,
              details: { type: typeof value }
            });
          }
          if (def.type === 'array' && !Array.isArray(value)) {
            errors.push({
              path: fieldPath,
              message: `Field '${field}' must be an array`,
              details: { type: typeof value }
            });
          }

          // Check enum values
          if (def.enum && !def.enum.includes(value)) {
            errors.push({
              path: fieldPath,
              message: `Invalid value for '${field}'. Must be one of: ${def.enum.join(', ')}`,
              details: { value, allowed: def.enum }
            });
          }

          // Check nested objects
          if (def.type === 'object' && typeof value === 'object') {
            errors.push(...this.validateStructure(value, def, fieldPath));
          }

          // Check array items
          if (def.type === 'array' && def.items && Array.isArray(value)) {
            value.forEach((item, index) => {
              errors.push(...this.validateStructure(item, def.items, `${fieldPath}[${index}]`));
            });
          }

          // Check minimum values for numbers
          if (def.type === 'number' && typeof value === 'number') {
            if (def.minimum !== undefined && value < def.minimum) {
              errors.push({
                path: fieldPath,
                message: `Value must be >= ${def.minimum}`,
                details: { value, minimum: def.minimum }
              });
            }
            if (def.maximum !== undefined && value > def.maximum) {
              errors.push({
                path: fieldPath,
                message: `Value must be <= ${def.maximum}`,
                details: { value, maximum: def.maximum }
              });
            }
          }

          // Check string formats
          if (def.type === 'string' && def.format) {
            if (def.format === 'email' && !this.isValidEmail(value)) {
              errors.push({
                path: fieldPath,
                message: 'Invalid email format'
              });
            }
            if (def.format === 'date-time' && !this.isValidDateTime(value)) {
              errors.push({
                path: fieldPath,
                message: 'Invalid date-time format'
              });
            }
          }
        }
      }
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidDateTime(dateTime: string): boolean {
    const date = new Date(dateTime);
    return !isNaN(date.getTime()) && dateTime.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/) !== null;
  }

  private loadSchemas() {
    const schemasDir = path.join(__dirname, '../../schemas');
    const schemaFiles = fs.readdirSync(schemasDir)
      .filter(file => file.endsWith('.yaml'));

    for (const file of schemaFiles) {
      try {
        const schemaPath = path.join(schemasDir, file);
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');
        const schema = yaml.load(schemaContent);
        
        // Extract version from filename (e.g., '1.0.0.yaml' -> '1.0.0')
        const version = path.basename(file, '.yaml');
        this.schemas.set(version, schema);
      } catch (error) {
        console.error(`Error loading schema ${file}:`, error);
      }
    }
  }
} 