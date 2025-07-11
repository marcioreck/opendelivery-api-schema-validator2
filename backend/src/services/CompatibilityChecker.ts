import { SchemaManager } from './SchemaManager';
import { ApiVersion, CompatibilityResult, ValidationError } from '../types';

export class CompatibilityChecker {
  private schemaManager: SchemaManager;

  constructor() {
    this.schemaManager = new SchemaManager();
  }

  public async checkCompatibility(sourceVersion: ApiVersion, targetVersion: ApiVersion): Promise<CompatibilityResult> {
    const sourceSchema = await this.schemaManager.getSchema(sourceVersion);
    const targetSchema = await this.schemaManager.getSchema(targetVersion);

    if (!sourceSchema || !targetSchema) {
      return {
        isCompatible: false,
        errors: [{
          path: '',
          message: `Schema version ${!sourceSchema ? sourceVersion : targetVersion} not found`,
          schemaPath: ''
        }]
      };
    }

    const incompatibilities = this.findIncompatibilities(sourceSchema, targetSchema);
    
    return {
      isCompatible: incompatibilities.length === 0,
      errors: incompatibilities
    };
  }

  private findIncompatibilities(sourceSchema: object, targetSchema: object): ValidationError[] {
    const errors: ValidationError[] = [];
    this.compareSchemas(sourceSchema, targetSchema, '', errors);
    return errors;
  }

  private compareSchemas(source: any, target: any, path: string, errors: ValidationError[]): void {
    if (typeof source !== typeof target) {
      errors.push({
        path,
        message: `Type mismatch: ${typeof source} -> ${typeof target}`,
        schemaPath: path
      });
      return;
    }

    if (typeof source !== 'object' || source === null) return;

    if (Array.isArray(source)) {
      if (!Array.isArray(target)) {
        errors.push({
          path,
          message: 'Array changed to non-array type',
          schemaPath: path
        });
        return;
      }
      return;
    }

    // Check for removed required fields
    if (source.required && target.required) {
      const removedRequired = source.required.filter((field: string) => !target.required.includes(field));
      if (removedRequired.length > 0) {
        errors.push({
          path: `${path}.required`,
          message: `Required fields removed: ${removedRequired.join(', ')}`,
          schemaPath: `${path}.required`
        });
      }
    }

    // Check properties
    if (source.properties && target.properties) {
      for (const [key, sourceValue] of Object.entries(source.properties)) {
        const targetValue = target.properties[key];
        if (!targetValue) {
          errors.push({
            path: `${path}.properties.${key}`,
            message: `Property removed: ${key}`,
            schemaPath: `${path}.properties.${key}`
          });
          continue;
        }

        this.compareSchemas(
          sourceValue,
          targetValue,
          path ? `${path}.properties.${key}` : `properties.${key}`,
          errors
        );
      }
    }

    // Check for enum value changes
    if (source.enum && target.enum) {
      const removedValues = source.enum.filter((value: any) => !target.enum.includes(value));
      if (removedValues.length > 0) {
        errors.push({
          path: `${path}.enum`,
          message: `Enum values removed: ${removedValues.join(', ')}`,
          schemaPath: `${path}.enum`
        });
      }
    }
  }
} 