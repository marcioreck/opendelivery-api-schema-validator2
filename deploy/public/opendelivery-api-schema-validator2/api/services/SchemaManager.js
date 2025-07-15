"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaManager = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const js_yaml_1 = __importDefault(require("js-yaml"));
class SchemaManager {
    constructor() {
        this.schemas = new Map();
        this.schemaDirectory = (0, path_1.join)(__dirname, '../../schemas');
    }
    async loadSchemas() {
        try {
            const files = await fs_1.promises.readdir(this.schemaDirectory);
            const yamlFiles = files.filter(file => file.endsWith('.yaml'));
            for (const file of yamlFiles) {
                const filePath = (0, path_1.join)(this.schemaDirectory, file);
                const content = await fs_1.promises.readFile(filePath, 'utf8');
                const schema = js_yaml_1.default.load(content);
                // Extract version from filename (e.g., '1.0.0.yaml' -> '1.0.0')
                const version = file.replace('.yaml', '');
                this.schemas.set(version, schema);
            }
        }
        catch (error) {
            console.error('Error loading schemas:', error);
            throw new Error('Failed to load OpenDelivery schemas');
        }
    }
    async getSchema(version) {
        if (!this.schemas.has(version)) {
            await this.loadSchemas();
        }
        return this.schemas.get(version);
    }
    getAvailableVersions() {
        return Array.from(this.schemas.keys());
    }
    async getAllSchemas() {
        if (this.schemas.size === 0) {
            await this.loadSchemas();
        }
        return new Map(this.schemas);
    }
}
exports.SchemaManager = SchemaManager;
