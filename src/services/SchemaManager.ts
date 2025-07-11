import { promises as fs } from 'fs';
import { join } from 'path';
import { ApiVersion } from '../types';
import { logger } from '../utils/logger';
import { loadSchema } from '../utils/schemaLoader';

export class SchemaManager {
  private schemas: Map<ApiVersion, object>;
  private lastUpdate: Date;
  private readonly updateInterval: number;
  private readonly schemaDir: string;

  constructor() {
    this.schemas = new Map();
    this.lastUpdate = new Date(0);
    this.updateInterval = parseInt(process.env.SCHEMA_UPDATE_INTERVAL_HOURS || '24', 10) * 60 * 60 * 1000;
    this.schemaDir = join(__dirname, '..', '..', 'schemas');
  }

  public async initialize(): Promise<void> {
    await this.ensureSchemaDirectory();
    await this.loadAllSchemas();
    this.startUpdateScheduler();
  }

  private async ensureSchemaDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.schemaDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create schema directory:', error);
      throw error;
    }
  }

  private async loadAllSchemas(): Promise<void> {
    const versions: ApiVersion[] = ['1.0.0', '1.1.0', '1.2.0', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc'];

    for (const version of versions) {
      try {
        const schema = await loadSchema(version);
        this.schemas.set(version, schema);
        logger.info(`Loaded schema for version ${version}`);
      } catch (error) {
        logger.error(`Failed to load schema for version ${version}:`, error);
      }
    }

    this.lastUpdate = new Date();
  }

  private startUpdateScheduler(): void {
    setInterval(async () => {
      try {
        await this.checkForUpdates();
      } catch (error) {
        logger.error('Failed to check for schema updates:', error);
      }
    }, this.updateInterval);
  }

  private async checkForUpdates(): Promise<void> {
    // TODO: Implement schema update check from OpenDelivery repository
    logger.info('Checking for schema updates...');
  }

  public getSchema(version: ApiVersion): object | undefined {
    return this.schemas.get(version);
  }

  public getAllVersions(): ApiVersion[] {
    return Array.from(this.schemas.keys());
  }

  public getLastUpdateTime(): Date {
    return this.lastUpdate;
  }

  public async reloadSchema(version: ApiVersion): Promise<void> {
    try {
      const schema = await loadSchema(version);
      this.schemas.set(version, schema);
      logger.info(`Reloaded schema for version ${version}`);
    } catch (error) {
      logger.error(`Failed to reload schema for version ${version}:`, error);
      throw error;
    }
  }
} 