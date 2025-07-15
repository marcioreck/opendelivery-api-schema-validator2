"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
class ValidationService {
    constructor() {
        this.schemas = new Map();
        this.loadSchemas();
    }
    async validate(version, payload) {
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
        }
        catch (error) {
            return {
                valid: false,
                errors: [{
                        message: error instanceof Error ? error.message : 'Validation error'
                    }]
            };
        }
    }
    validateStructure(payload, schema, path) {
        const errors = [];
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
            for (const [field, def] of Object.entries(schema.properties)) {
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
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    isValidDateTime(dateTime) {
        const date = new Date(dateTime);
        return !isNaN(date.getTime()) && dateTime.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/) !== null;
    }
    loadSchemas() {
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
            }
            catch (error) {
                console.error(`Error loading schema ${file}:`, error);
            }
        }
    }
}
exports.ValidationService = ValidationService;
