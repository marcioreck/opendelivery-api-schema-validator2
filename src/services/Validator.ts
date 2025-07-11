import { ValidationResult, ValidationError, ApiVersion, CompatibilityReport, CertificationResult } from '../types';
import { logger } from '../utils/logger';
import { SchemaManager } from './SchemaManager';
import { ValidationEngine } from './ValidationEngine';
import { CompatibilityChecker } from './CompatibilityChecker';
import { CertificationService } from './CertificationService';

export class Validator {
  private schemaManager: SchemaManager;
  private validationEngine: ValidationEngine;
  private compatibilityChecker: CompatibilityChecker;
  private certificationService: CertificationService;

  constructor() {
    this.schemaManager = new SchemaManager();
    this.validationEngine = new ValidationEngine();
    this.compatibilityChecker = new CompatibilityChecker();
    this.certificationService = new CertificationService();
  }

  public async initialize(): Promise<void> {
    await this.schemaManager.initialize();
  }

  public async validate(payload: unknown, version: ApiVersion): Promise<ValidationResult> {
    try {
      const schema = this.schemaManager.getSchema(version);
      if (!schema) {
        throw new Error(`Schema for version ${version} not found`);
      }

      // Perform schema validation
      const validationResult = this.validationEngine.validateAgainstSchema(payload, schema);

      // Perform security validation
      const securityErrors = this.validationEngine.validateSecurityRequirements(payload);

      // Combine results
      if (securityErrors.length > 0) {
        return {
          isValid: false,
          errors: [...(validationResult.errors || []), ...securityErrors],
          version
        };
      }

      return validationResult;
    } catch (error) {
      logger.error('Validation error:', error);
      throw error;
    }
  }

  public async validateAllVersions(payload: unknown): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const versions = this.schemaManager.getAllVersions();
    
    for (const version of versions) {
      try {
        const result = await this.validate(payload, version);
        results.push(result);
      } catch (error) {
        logger.error(`Validation failed for version ${version}:`, error);
      }
    }

    return results;
  }

  public async checkCompatibility(
    sourceVersion: ApiVersion,
    targetVersion: ApiVersion
  ): Promise<CompatibilityReport> {
    try {
      const sourceSchema = this.schemaManager.getSchema(sourceVersion);
      const targetSchema = this.schemaManager.getSchema(targetVersion);

      if (!sourceSchema || !targetSchema) {
        throw new Error('Schema not found for one or both versions');
      }

      return await this.compatibilityChecker.checkCompatibility(
        sourceSchema,
        targetSchema,
        sourceVersion,
        targetVersion
      );
    } catch (error) {
      logger.error('Compatibility check error:', error);
      throw error;
    }
  }

  public async checkBreakingChanges(
    sourceVersion: ApiVersion,
    targetVersion: ApiVersion
  ): Promise<ValidationError[]> {
    try {
      const sourceSchema = this.schemaManager.getSchema(sourceVersion);
      const targetSchema = this.schemaManager.getSchema(targetVersion);

      if (!sourceSchema || !targetSchema) {
        throw new Error('Schema not found for one or both versions');
      }

      return await this.compatibilityChecker.checkBreakingChanges(sourceSchema, targetSchema);
    } catch (error) {
      logger.error('Breaking changes check error:', error);
      throw error;
    }
  }

  public async certify(payload: unknown): Promise<CertificationResult> {
    try {
      // Validate against all versions
      const validationResults = await this.validateAllVersions(payload);

      // Check compatibility between consecutive versions
      const compatibilityReports: CompatibilityReport[] = [];
      const versions = this.schemaManager.getAllVersions();
      
      for (let i = 0; i < versions.length - 1; i++) {
        const report = await this.checkCompatibility(versions[i], versions[i + 1]);
        compatibilityReports.push(report);
      }

      // Perform security checks
      const securityChecks = await this.certificationService.performSecurityChecks(payload);

      // Generate certification result
      return await this.certificationService.certify(
        validationResults,
        compatibilityReports,
        securityChecks
      );
    } catch (error) {
      logger.error('Certification error:', error);
      throw error;
    }
  }

  public getLastSchemaUpdateTime(): Date {
    return this.schemaManager.getLastUpdateTime();
  }

  public async reloadSchema(version: ApiVersion): Promise<void> {
    await this.schemaManager.reloadSchema(version);
  }
} 