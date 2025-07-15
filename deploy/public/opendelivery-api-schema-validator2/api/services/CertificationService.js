"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationService = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const logger_1 = require("../utils/logger");
const ValidationService_1 = require("./ValidationService");
class CertificationService {
    constructor() {
        this.validationService = new ValidationService_1.ValidationService();
    }
    async certify(version, payload) {
        try {
            // First validate the payload
            const validationResult = await this.validationService.validate(version, payload);
            if (!validationResult.valid) {
                throw new errorHandler_1.AppError(400, 'Payload is not valid against schema');
            }
            // Run certification checks
            const checks = await this.runChecks(version, payload);
            // Calculate overall score
            const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
            const averageScore = Math.round(totalScore / checks.length);
            return {
                score: averageScore,
                checks,
                details: {
                    schema_version: version,
                    certified_at: new Date().toISOString(),
                    certification_level: this.getCertificationLevel(averageScore),
                },
            };
        }
        catch (error) {
            logger_1.logger.error('Certification error:', error);
            if (error instanceof errorHandler_1.AppError) {
                throw error;
            }
            throw new errorHandler_1.AppError(500, 'Certification service error');
        }
    }
    async runChecks(version, payload) {
        const checks = [];
        // 1. Schema Validation Check
        const validationResult = await this.validationService.validate(version, payload);
        checks.push({
            name: 'Schema Validation',
            status: validationResult.valid ? 'success' : 'error',
            message: validationResult.valid
                ? 'Payload is valid against the OpenDelivery schema'
                : `Schema validation failed: ${validationResult.errors?.[0]?.message || 'Unknown error'}`,
            score: validationResult.valid ? 100 : 0,
        });
        // 2. Required Fields Check
        const requiredFieldsCheck = this.checkRequiredFields(payload);
        checks.push(requiredFieldsCheck);
        // 3. Data Types Check
        const dataTypesCheck = this.checkDataTypes(payload);
        checks.push(dataTypesCheck);
        // 4. Business Rules Check
        const businessRulesCheck = this.checkBusinessRules(payload);
        checks.push(businessRulesCheck);
        // 5. Best Practices Check
        const bestPracticesCheck = this.checkBestPractices(payload);
        checks.push(bestPracticesCheck);
        // 6. Security Check
        const securityCheck = this.checkSecurity(payload);
        checks.push(securityCheck);
        return checks;
    }
    checkRequiredFields(payload) {
        const requiredFields = ['id', 'type', 'displayId', 'createdAt', 'orderTiming', 'merchant', 'items', 'total', 'payments'];
        const missingFields = requiredFields.filter(field => !payload[field]);
        if (missingFields.length === 0) {
            return {
                name: 'Required Fields',
                status: 'success',
                message: 'All required fields are present',
                score: 100,
            };
        }
        return {
            name: 'Required Fields',
            status: 'error',
            message: `Missing required fields: ${missingFields.join(', ')}`,
            score: Math.max(0, 100 - (missingFields.length * 20)),
        };
    }
    checkDataTypes(payload) {
        const errors = [];
        // Check ID format (should be UUID)
        if (payload.id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.id)) {
            errors.push('ID should be a valid UUID');
        }
        // Check date format
        if (payload.createdAt && !this.isValidDateTime(payload.createdAt)) {
            errors.push('createdAt should be a valid ISO 8601 date');
        }
        // Check items array
        if (payload.items && Array.isArray(payload.items)) {
            payload.items.forEach((item, index) => {
                if (typeof item.quantity !== 'number' || item.quantity <= 0) {
                    errors.push(`Item ${index + 1} quantity should be a positive number`);
                }
                if (typeof item.unitPrice?.value !== 'number' || item.unitPrice.value < 0) {
                    errors.push(`Item ${index + 1} unitPrice should be a non-negative number`);
                }
            });
        }
        return {
            name: 'Data Types',
            status: errors.length === 0 ? 'success' : 'warning',
            message: errors.length === 0
                ? 'All fields have correct data types'
                : `Data type issues: ${errors.join(', ')}`,
            score: Math.max(0, 100 - (errors.length * 15)),
        };
    }
    checkBusinessRules(payload) {
        const warnings = [];
        // Check total calculation consistency
        if (payload.items && payload.total) {
            const calculatedTotal = payload.items.reduce((sum, item) => {
                return sum + (item.totalPrice?.value || 0);
            }, 0);
            const declaredTotal = payload.total.itemsPrice?.value || 0;
            if (Math.abs(calculatedTotal - declaredTotal) > 0.01) {
                warnings.push('Items total does not match declared total');
            }
        }
        // Check payment consistency
        if (payload.payments && payload.total) {
            const totalPayments = payload.payments.methods?.reduce((sum, method) => {
                return sum + (method.value || 0);
            }, 0) || 0;
            const orderAmount = payload.total.orderAmount?.value || 0;
            if (Math.abs(totalPayments - orderAmount) > 0.01) {
                warnings.push('Payment total does not match order amount');
            }
        }
        return {
            name: 'Business Rules',
            status: warnings.length === 0 ? 'success' : 'warning',
            message: warnings.length === 0
                ? 'All business rules are satisfied'
                : `Business rule warnings: ${warnings.join(', ')}`,
            score: Math.max(70, 100 - (warnings.length * 10)),
        };
    }
    checkBestPractices(payload) {
        const suggestions = [];
        // Check for optional but recommended fields
        if (!payload.preparationStartDateTime) {
            suggestions.push('preparationStartDateTime is recommended for better tracking');
        }
        if (!payload.customer) {
            suggestions.push('customer information is recommended for better service');
        }
        if (payload.items && payload.items.some((item) => !item.externalCode)) {
            suggestions.push('externalCode is recommended for items to improve integration');
        }
        return {
            name: 'Best Practices',
            status: suggestions.length === 0 ? 'success' : 'warning',
            message: suggestions.length === 0
                ? 'Follows all recommended best practices'
                : `Recommendations: ${suggestions.join(', ')}`,
            score: Math.max(80, 100 - (suggestions.length * 5)),
        };
    }
    checkSecurity(payload) {
        const securityIssues = [];
        // Check for sensitive data exposure
        const sensitiveFields = ['password', 'token', 'secret', 'key'];
        this.checkForSensitiveData(payload, '', sensitiveFields, securityIssues);
        // Check for potential credit card numbers
        if (this.containsCreditCardNumbers(payload)) {
            securityIssues.push('Potential credit card numbers detected');
        }
        return {
            name: 'Security',
            status: securityIssues.length === 0 ? 'success' : 'warning',
            message: securityIssues.length === 0
                ? 'No security issues detected'
                : `Security warnings: ${securityIssues.join(', ')}`,
            score: Math.max(60, 100 - (securityIssues.length * 20)),
        };
    }
    checkForSensitiveData(obj, path, sensitiveFields, issues) {
        if (typeof obj !== 'object' || obj === null)
            return;
        for (const [key, value] of Object.entries(obj)) {
            const currentPath = path ? `${path}.${key}` : key;
            if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
                issues.push(`Sensitive field detected: ${currentPath}`);
            }
            if (typeof value === 'object' && value !== null) {
                this.checkForSensitiveData(value, currentPath, sensitiveFields, issues);
            }
        }
    }
    containsCreditCardNumbers(obj) {
        if (typeof obj !== 'object' || obj === null)
            return false;
        for (const value of Object.values(obj)) {
            if (typeof value === 'string' && /^\d{16}$/.test(value)) {
                return true;
            }
            if (typeof value === 'object' && value !== null) {
                if (this.containsCreditCardNumbers(value)) {
                    return true;
                }
            }
        }
        return false;
    }
    isValidDateTime(dateTime) {
        try {
            const date = new Date(dateTime);
            return date.toISOString() === dateTime;
        }
        catch {
            return false;
        }
    }
    getCertificationLevel(score) {
        if (score >= 95)
            return 'GOLD';
        if (score >= 85)
            return 'SILVER';
        if (score >= 70)
            return 'BRONZE';
        return 'NOT_CERTIFIED';
    }
}
exports.CertificationService = CertificationService;
