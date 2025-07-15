"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const ValidationEngine_1 = require("./ValidationEngine");
const SchemaManager_1 = require("./SchemaManager");
class Validator {
    constructor() {
        this.validationEngine = new ValidationEngine_1.ValidationEngine();
        this.schemaManager = new SchemaManager_1.SchemaManager();
    }
    async initialize() {
        await this.schemaManager.loadSchemas();
    }
    async validate(payload, version) {
        const schema = await this.schemaManager.getSchema(version);
        if (!schema) {
            return {
                isValid: false,
                errors: [{
                        path: '',
                        message: `Schema version ${version} not found`,
                        schemaPath: ''
                    }],
                version
            };
        }
        // First check for sensitive data
        const securityErrors = this.validationEngine.validateSecurityRequirements(payload);
        if (securityErrors.length > 0) {
            return {
                isValid: false,
                errors: securityErrors,
                version
            };
        }
        // Then validate against schema
        const result = this.validationEngine.validateAgainstSchema(payload, schema);
        return {
            ...result,
            version
        };
    }
}
exports.Validator = Validator;
