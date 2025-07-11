import { promises as fs } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { ApiVersion } from '../types';

export class SchemaManager {
  private schemas: Map<ApiVersion, object>;
  private schemaDirectory: string;

  constructor() {
    this.schemas = new Map();
    this.schemaDirectory = join(__dirname, '../../schemas');
  }

  public async loadSchemas(): Promise<void> {
    try {
      const files = await fs.readdir(this.schemaDirectory);
      const yamlFiles = files.filter(file => file.endsWith('.yaml'));

      for (const file of yamlFiles) {
        const filePath = join(this.schemaDirectory, file);
        const content = await fs.readFile(filePath, 'utf8');
        const schema = yaml.load(content) as object;
        
        // Extract version from filename (e.g., '1.0.0.yaml' -> '1.0.0')
        const version = file.replace('.yaml', '') as ApiVersion;
        this.schemas.set(version, schema);
      }
    } catch (error) {
      console.error('Error loading schemas:', error);
      throw new Error('Failed to load OpenDelivery schemas');
    }
  }

  public async getSchema(version: ApiVersion): Promise<object | undefined> {
    if (!this.schemas.has(version)) {
      await this.loadSchemas();
    }
    return this.schemas.get(version);
  }

  public getAvailableVersions(): ApiVersion[] {
    return Array.from(this.schemas.keys());
  }

  public async getAllSchemas(): Promise<Map<ApiVersion, object>> {
    if (this.schemas.size === 0) {
      await this.loadSchemas();
    }
    return new Map(this.schemas);
  }
} 