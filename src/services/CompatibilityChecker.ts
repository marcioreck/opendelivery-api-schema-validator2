import { CompatibilityReport, IncompatibilityIssue, ApiVersion } from '../types';
import { logger } from '../utils/logger';

export class CompatibilityChecker {
  private compareSchemaStructures(sourceSchema: any, targetSchema: any, path = ''): IncompatibilityIssue[] {
    const issues: IncompatibilityIssue[] = [];

    // Compare properties
    if (sourceSchema.properties && targetSchema.properties) {
      for (const [key, sourceProperty] of Object.entries(sourceSchema.properties)) {
        const currentPath = path ? `${path}/${key}` : key;
        const targetProperty = targetSchema.properties[key];

        if (!targetProperty) {
          // Property removed in target version
          issues.push({
            path: currentPath,
            reason: `Property '${key}' is not supported in target version`,
            severity: 'ERROR',
            suggestedFix: `Remove the '${key}' property`
          });
          continue;
        }

        // Check type changes
        if (sourceProperty.type !== targetProperty.type) {
          issues.push({
            path: currentPath,
            reason: `Type mismatch: changed from '${sourceProperty.type}' to '${targetProperty.type}'`,
            severity: 'ERROR',
            suggestedFix: `Convert '${key}' to type '${targetProperty.type}'`
          });
        }

        // Check enum changes
        if (sourceProperty.enum && targetProperty.enum) {
          const removedValues = sourceProperty.enum.filter((v: string) => !targetProperty.enum.includes(v));
          if (removedValues.length > 0) {
            issues.push({
              path: currentPath,
              reason: `Enum values removed: ${removedValues.join(', ')}`,
              severity: 'ERROR',
              suggestedFix: `Update enum values to match target version`
            });
          }
        }

        // Recursively check nested objects
        if (sourceProperty.type === 'object' && targetProperty.type === 'object') {
          issues.push(...this.compareSchemaStructures(sourceProperty, targetProperty, currentPath));
        }
      }
    }

    // Check for new required fields
    if (targetSchema.required) {
      const sourceRequired = sourceSchema.required || [];
      const newRequired = targetSchema.required.filter((field: string) => !sourceRequired.includes(field));
      
      if (newRequired.length > 0) {
        issues.push({
          path: path || '/',
          reason: `New required fields in target version: ${newRequired.join(', ')}`,
          severity: 'ERROR',
          suggestedFix: `Add the following required fields: ${newRequired.join(', ')}`
        });
      }
    }

    return issues;
  }

  public async checkCompatibility(
    sourceSchema: object,
    targetSchema: object,
    sourceVersion: ApiVersion,
    targetVersion: ApiVersion
  ): Promise<CompatibilityReport> {
    try {
      const incompatibilities = this.compareSchemaStructures(sourceSchema, targetSchema);

      return {
        sourceVersion,
        targetVersion,
        isCompatible: incompatibilities.length === 0,
        incompatibilities: incompatibilities.length > 0 ? incompatibilities : undefined
      };
    } catch (error) {
      logger.error('Compatibility check error:', error);
      throw error;
    }
  }

  public async checkBreakingChanges(
    sourceSchema: object,
    targetSchema: object,
    path = ''
  ): Promise<IncompatibilityIssue[]> {
    const issues: IncompatibilityIssue[] = [];

    try {
      // Check for removed endpoints
      if (sourceSchema.paths && targetSchema.paths) {
        for (const [endpoint, sourceMethods] of Object.entries(sourceSchema.paths)) {
          const targetMethods = targetSchema.paths[endpoint];
          
          if (!targetMethods) {
            issues.push({
              path: `${path}/paths/${endpoint}`,
              reason: `Endpoint removed in target version`,
              severity: 'ERROR',
              suggestedFix: `Update client to use alternative endpoint`
            });
            continue;
          }

          // Check for removed HTTP methods
          for (const [method, sourceOp] of Object.entries(sourceMethods)) {
            if (!targetMethods[method]) {
              issues.push({
                path: `${path}/paths/${endpoint}/${method}`,
                reason: `HTTP method removed in target version`,
                severity: 'ERROR',
                suggestedFix: `Update client to use alternative method`
              });
            }
          }
        }
      }

      // Check for authentication changes
      if (sourceSchema.security !== targetSchema.security) {
        issues.push({
          path: `${path}/security`,
          reason: 'Authentication requirements changed',
          severity: 'ERROR',
          suggestedFix: 'Update authentication mechanism to match target version'
        });
      }

      return issues;
    } catch (error) {
      logger.error('Breaking changes check error:', error);
      throw error;
    }
  }
} 