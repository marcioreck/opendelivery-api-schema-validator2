import { CertificationResult, ValidationResult, CompatibilityReport, SecurityCheckResult } from '../types';
import { logger } from '../utils/logger';

export class CertificationService {
  private readonly MINIMUM_PASSING_SCORE = 80;
  private readonly WEIGHTS = {
    schemaValidation: 0.4,
    compatibility: 0.3,
    security: 0.3
  };

  public async certify(
    validationResults: ValidationResult[],
    compatibilityReports: CompatibilityReport[],
    securityChecks: SecurityCheckResult[]
  ): Promise<CertificationResult> {
    try {
      // Calculate scores for each component
      const schemaScore = this.calculateValidationScore(validationResults);
      const compatibilityScore = this.calculateCompatibilityScore(compatibilityReports);
      const securityScore = this.calculateSecurityScore(securityChecks);

      // Calculate weighted total score
      const totalScore = (
        schemaScore * this.WEIGHTS.schemaValidation +
        compatibilityScore * this.WEIGHTS.compatibility +
        securityScore * this.WEIGHTS.security
      );

      return {
        isPassing: totalScore >= this.MINIMUM_PASSING_SCORE,
        score: Math.round(totalScore * 100) / 100,
        details: {
          schemaValidation: validationResults[0], // Most recent version
          compatibilityChecks: compatibilityReports,
          securityChecks
        }
      };
    } catch (error) {
      logger.error('Certification error:', error);
      throw error;
    }
  }

  private calculateValidationScore(results: ValidationResult[]): number {
    if (results.length === 0) return 0;

    // Focus on the most recent version
    const latestResult = results[results.length - 1];
    if (!latestResult.isValid) return 0;

    return 100;
  }

  private calculateCompatibilityScore(reports: CompatibilityReport[]): number {
    if (reports.length === 0) return 0;

    const compatibleCount = reports.filter(report => report.isCompatible).length;
    return (compatibleCount / reports.length) * 100;
  }

  private calculateSecurityScore(checks: SecurityCheckResult[]): number {
    if (checks.length === 0) return 0;

    const passedCount = checks.filter(check => check.passed).length;
    return (passedCount / checks.length) * 100;
  }

  public async performSecurityChecks(payload: unknown): Promise<SecurityCheckResult[]> {
    const checks: SecurityCheckResult[] = [];

    // Check for sensitive data exposure
    checks.push(this.checkSensitiveData(payload));

    // Check for secure communication
    checks.push(this.checkSecureCommunication(payload));

    // Check for input validation
    checks.push(this.checkInputValidation(payload));

    // Check for authentication
    checks.push(this.checkAuthentication(payload));

    return checks;
  }

  private checkSensitiveData(payload: unknown): SecurityCheckResult {
    const sensitivePatterns = {
      creditCard: /\b\d{16}\b/,
      password: /password|senha/i,
      token: /token|secret/i
    };

    const payloadStr = JSON.stringify(payload);
    const hasSensitiveData = Object.values(sensitivePatterns).some(pattern => pattern.test(payloadStr));

    return {
      check: 'Sensitive Data Exposure',
      passed: !hasSensitiveData,
      details: hasSensitiveData ? 'Found potential sensitive data in payload' : undefined
    };
  }

  private checkSecureCommunication(payload: any): SecurityCheckResult {
    const hasHttpUrls = this.findInsecureUrls(payload);

    return {
      check: 'Secure Communication',
      passed: !hasHttpUrls,
      details: hasHttpUrls ? 'Found non-HTTPS URLs in payload' : undefined
    };
  }

  private findInsecureUrls(obj: any): boolean {
    if (typeof obj === 'string') {
      return obj.toLowerCase().startsWith('http://');
    }

    if (Array.isArray(obj)) {
      return obj.some(item => this.findInsecureUrls(item));
    }

    if (obj && typeof obj === 'object') {
      return Object.values(obj).some(value => this.findInsecureUrls(value));
    }

    return false;
  }

  private checkInputValidation(payload: any): SecurityCheckResult {
    // Check for common injection patterns
    const injectionPatterns = {
      sql: /'.*--|\bOR\b.*=|;.*--|\/\*|\*\/|UNION.*SELECT/i,
      xss: /<script|javascript:|data:|vbscript:|<img|<iframe/i,
      commandInjection: /\b(cmd|powershell|bash|sh)\b|[;&|`]/i
    };

    const payloadStr = JSON.stringify(payload);
    const hasInjectionAttempt = Object.values(injectionPatterns).some(pattern => pattern.test(payloadStr));

    return {
      check: 'Input Validation',
      passed: !hasInjectionAttempt,
      details: hasInjectionAttempt ? 'Found potential injection patterns' : undefined
    };
  }

  private checkAuthentication(payload: any): SecurityCheckResult {
    // Check for required authentication fields
    const hasAuthHeaders = payload.headers && (
      payload.headers.authorization ||
      payload.headers.Authentication ||
      payload.headers['x-api-key']
    );

    return {
      check: 'Authentication',
      passed: hasAuthHeaders,
      details: hasAuthHeaders ? undefined : 'Missing authentication headers'
    };
  }
} 