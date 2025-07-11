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
      
      // First validate against source version
      const sourceValidation = await this.validationService.validate(sourceVersion, payload);
      if (!sourceValidation.valid) {
        logger.warn(`Payload is not valid against source version ${sourceVersion}`);
        throw new AppError(400, 'Payload is not valid against source version schema');
      }

      // Then validate against target version
      const targetValidation = await this.validationService.validate(targetVersion, payload);

      // Analyze changes and compatibility
      const changes = this.analyzeChanges(sourceVersion, targetVersion, sourceValidation, targetValidation);

      const result = {
        compatible: targetValidation.valid,
        changes,
        details: {
          source_version: sourceVersion,
          target_version: targetVersion,
          source_validation: {
            valid: sourceValidation.valid,
            errors: sourceValidation.errors
          },
          target_validation: {
            valid: targetValidation.valid,
            errors: targetValidation.errors
          },
          checked_at: new Date().toISOString(),
        },
      };

      logger.info(`Compatibility check completed: ${result.compatible ? 'compatible' : 'incompatible'}`, {
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

  private analyzeChanges(sourceVersion: string, targetVersion: string, sourceValidation: any, targetValidation: any) {
    const changes: any[] = [];

    // If target validation failed, analyze the errors
    if (!targetValidation.valid && targetValidation.errors) {
      targetValidation.errors.forEach((error: any) => {
        changes.push({
          type: 'error',
          path: error.path,
          description: `Validation error in target version: ${error.message}`,
          severity: 'high'
        });
      });
    }

    // If both validations passed, check for potential warnings
    if (sourceValidation.valid && targetValidation.valid) {
      changes.push({
        type: 'info',
        path: '/',
        description: 'Payload is fully compatible with both versions',
        severity: 'low'
      });
    }

    // Add version-specific information
    if (sourceVersion !== targetVersion) {
      changes.push({
        type: 'version_change',
        path: '/',
        description: `Schema version changed from ${sourceVersion} to ${targetVersion}`,
        severity: 'medium'
      });
    }

    // Check for common version differences
    const sourceVersionNum = this.parseVersion(sourceVersion);
    const targetVersionNum = this.parseVersion(targetVersion);
    
    if (targetVersionNum > sourceVersionNum) {
      changes.push({
        type: 'upgrade',
        path: '/',
        description: `Upgrading from ${sourceVersion} to ${targetVersion} - new features may be available`,
        severity: 'low'
      });
    } else if (targetVersionNum < sourceVersionNum) {
      changes.push({
        type: 'downgrade',
        path: '/',
        description: `Downgrading from ${sourceVersion} to ${targetVersion} - some features may not be available`,
        severity: 'medium'
      });
    }

    return changes;
  }

  private parseVersion(version: string): number {
    // Convert version string to number for comparison
    // e.g., "1.5.0" -> 1.5, "1.6.0-rc" -> 1.6
    const cleanVersion = version.replace('-rc', '');
    const parts = cleanVersion.split('.');
    return parseFloat(`${parts[0]}.${parts[1]}`);
  }
} 