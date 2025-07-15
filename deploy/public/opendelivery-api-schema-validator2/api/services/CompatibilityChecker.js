"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompatibilityChecker = void 0;
const SchemaManager_1 = require("./SchemaManager");
class CompatibilityChecker {
    constructor() {
        this.schemaManager = new SchemaManager_1.SchemaManager();
    }
    async checkCompatibility(sourceVersion, targetVersion) {
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
    findIncompatibilities(sourceSchema, targetSchema) {
        const errors = [];
        this.compareSchemas(sourceSchema, targetSchema, '', errors);
        return errors;
    }
    compareSchemas(source, target, path, errors) {
        if (typeof source !== typeof target) {
            errors.push({
                path,
                message: `Type mismatch: ${typeof source} -> ${typeof target}`,
                schemaPath: path
            });
            return;
        }
        if (typeof source !== 'object' || source === null)
            return;
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
            const removedRequired = source.required.filter((field) => !target.required.includes(field));
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
                this.compareSchemas(sourceValue, targetValue, path ? `${path}.properties.${key}` : `properties.${key}`, errors);
            }
        }
        // Check for enum value changes
        if (source.enum && target.enum) {
            const removedValues = source.enum.filter((value) => !target.enum.includes(value));
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
exports.CompatibilityChecker = CompatibilityChecker;
