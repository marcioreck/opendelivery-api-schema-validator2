import { AppError } from '../utils/errorHandler';
import { logger } from '../utils/logger';
import { ValidationService } from './ValidationService';

export class CompatibilityService {
  private validationService: ValidationService;

  constructor() {
    this.validationService = new ValidationService();
  }

  public async checkCompatibility(sourceVersion: string, targetVersion: string, payload: any) {
    try {
      logger.info(`Checking compatibility from ${sourceVersion} to ${targetVersion}`);
      
      // Validate against both versions (don't fail immediately)
      const sourceValidation = await this.validationService.validate(sourceVersion, payload);
      const targetValidation = await this.validationService.validate(targetVersion, payload);

      // Analyze changes and compatibility
      const changes = this.analyzeChanges(sourceVersion, targetVersion, sourceValidation, targetValidation);

      // Determine overall compatibility
      const isCompatible = this.determineCompatibility(sourceVersion, targetVersion, sourceValidation, targetValidation);

      const result = {
        compatible: isCompatible,
        compatibility_level: this.getCompatibilityLevel(sourceVersion, targetVersion, sourceValidation, targetValidation),
        changes,
        recommendations: this.generateRecommendations(sourceVersion, targetVersion, sourceValidation, targetValidation),
        details: {
          source_version: sourceVersion,
          target_version: targetVersion,
          source_validation: {
            valid: sourceValidation.valid,
            errors: sourceValidation.errors || []
          },
          target_validation: {
            valid: targetValidation.valid,
            errors: targetValidation.errors || []
          },
          checked_at: new Date().toISOString(),
        },
      };

      logger.info(`Compatibility check completed: ${result.compatible ? 'compatible' : 'incompatible'}`, {
        compatibility_level: result.compatibility_level,
        changes_count: changes.length,
        source_version: sourceVersion,
        target_version: targetVersion
      });

      return result;
    } catch (error) {
      logger.error('Compatibility check error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Compatibility service error');
    }
  }

  private determineCompatibility(sourceVersion: string, targetVersion: string, sourceValidation: any, targetValidation: any): boolean {
    // If both validations pass, it's compatible
    if (sourceValidation.valid && targetValidation.valid) {
      return true;
    }

    // If source is invalid but target is valid, it might be an upgrade that fixes issues
    if (!sourceValidation.valid && targetValidation.valid) {
      return true;
    }

    // If both are invalid, check if target has fewer or different errors
    if (!sourceValidation.valid && !targetValidation.valid) {
      const sourceErrorCount = sourceValidation.errors?.length || 0;
      const targetErrorCount = targetValidation.errors?.length || 0;
      
      // If target has fewer errors, consider it partially compatible
      return targetErrorCount < sourceErrorCount;
    }

    // If source is valid but target is invalid, it's incompatible
    return false;
  }

  private getCompatibilityLevel(sourceVersion: string, targetVersion: string, sourceValidation: any, targetValidation: any): string {
    if (sourceValidation.valid && targetValidation.valid) {
      return 'fully_compatible';
    }

    if (!sourceValidation.valid && targetValidation.valid) {
      return 'upgraded_compatibility';
    }

    if (!sourceValidation.valid && !targetValidation.valid) {
      const sourceErrorCount = sourceValidation.errors?.length || 0;
      const targetErrorCount = targetValidation.errors?.length || 0;
      
      if (targetErrorCount < sourceErrorCount) {
        return 'partially_compatible';
      } else if (targetErrorCount === sourceErrorCount) {
        return 'same_issues';
      } else {
        return 'incompatible';
      }
    }

    return 'regression';
  }

  private analyzeChanges(sourceVersion: string, targetVersion: string, sourceValidation: any, targetValidation: any) {
    const changes: any[] = [];

    // Version-specific changes
    const versionChanges = this.getVersionSpecificChanges(sourceVersion, targetVersion);
    changes.push(...versionChanges);

    // Validation error changes
    const sourceErrors = sourceValidation.errors || [];
    const targetErrors = targetValidation.errors || [];

    // Errors that exist in source but not in target (fixed)
    const fixedErrors = sourceErrors.filter((sourceError: any) => 
      !targetErrors.some((targetError: any) => 
        targetError.path === sourceError.path && targetError.message === sourceError.message
      )
    );

    fixedErrors.forEach((error: any) => {
      changes.push({
        type: 'fixed_error',
        path: error.path,
        description: `Fixed: ${error.message}`,
        severity: 'low'
      });
    });

    // Errors that exist in target but not in source (new issues)
    const newErrors = targetErrors.filter((targetError: any) => 
      !sourceErrors.some((sourceError: any) => 
        sourceError.path === targetError.path && sourceError.message === targetError.message
      )
    );

    newErrors.forEach((error: any) => {
      changes.push({
        type: 'new_error',
        path: error.path,
        description: `New issue: ${error.message}`,
        severity: 'high'
      });
    });

    // If both validations passed, mention successful compatibility
    if (sourceValidation.valid && targetValidation.valid) {
      changes.push({
        type: 'success',
        path: '/',
        description: 'Payload is fully compatible with both versions',
        severity: 'low'
      });
    }

    return changes;
  }

  private getVersionSpecificChanges(sourceVersion: string, targetVersion: string): any[] {
    const changes: any[] = [];
    
    const sourceVersionNum = this.parseVersion(sourceVersion);
    const targetVersionNum = this.parseVersion(targetVersion);

    // Common version-specific changes
    if (sourceVersionNum < 1.2 && targetVersionNum >= 1.2) {
      changes.push({
        type: 'schema_change',
        path: 'customer',
        description: 'Customer field became optional in v1.2.0+',
        severity: 'medium'
      });
      changes.push({
        type: 'schema_change',
        path: 'total',
        description: 'Total structure changed from "items" to "itemsPrice" in v1.2.0+',
        severity: 'medium'
      });
    }

    if (sourceVersionNum < 1.1 && targetVersionNum >= 1.1) {
      changes.push({
        type: 'schema_change',
        path: 'items[].unit',
        description: 'Unit field accepts more values in v1.1.0+ (UNIT, UN, KG, etc.)',
        severity: 'low'
      });
    }

    if (sourceVersionNum < 1.5 && targetVersionNum >= 1.5) {
      changes.push({
        type: 'feature_addition',
        path: 'orderTiming',
        description: 'Added ONDEMAND option in v1.5.0',
        severity: 'low'
      });
    }

    // Version direction
    if (targetVersionNum > sourceVersionNum) {
      changes.push({
        type: 'upgrade',
        path: '/',
        description: `Upgrading from ${sourceVersion} to ${targetVersion}`,
        severity: 'low'
      });
    } else if (targetVersionNum < sourceVersionNum) {
      changes.push({
        type: 'downgrade',
        path: '/',
        description: `Downgrading from ${sourceVersion} to ${targetVersion}`,
        severity: 'medium'
      });
    }

    return changes;
  }

  private generateRecommendations(sourceVersion: string, targetVersion: string, sourceValidation: any, targetValidation: any): string[] {
    const recommendations: string[] = [];

    const sourceVersionNum = this.parseVersion(sourceVersion);
    const targetVersionNum = this.parseVersion(targetVersion);

    // Version-specific recommendations
    if (sourceVersionNum < 1.2 && targetVersionNum >= 1.2) {
      recommendations.push('Consider removing the customer field if not needed, as it became optional in v1.2.0+');
      recommendations.push('Update total structure to use "itemsPrice" instead of "items"');
    }

    if (!sourceValidation.valid && targetValidation.valid) {
      recommendations.push('Your payload will work better with the target version - consider upgrading');
    }

    if (sourceValidation.valid && !targetValidation.valid) {
      recommendations.push('The target version introduces new requirements - review the validation errors');
    }

    if (targetVersionNum > sourceVersionNum) {
      recommendations.push('Upgrading to a newer version may provide additional features and improvements');
    }

    if (recommendations.length === 0) {
      recommendations.push('No specific recommendations - payload compatibility looks good');
    }

    return recommendations;
  }

  private parseVersion(version: string): number {
    // Convert version string to number for comparison
    // e.g., "1.5.0" -> 1.5, "1.6.0-rc" -> 1.6
    const cleanVersion = version.replace('-rc', '').replace('beta', '0.9');
    const parts = cleanVersion.split('.');
    return parseFloat(`${parts[0]}.${parts[1]}`);
  }
} 