import { promises as fs } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';
import { ApiVersion } from '../types';
import { logger } from './logger';

export async function loadSchema(version: ApiVersion): Promise<object> {
  try {
    const schemaPath = join(__dirname, '..', '..', 'schemas', `${version}.yaml`);
    const schemaContent = await fs.readFile(schemaPath, 'utf-8');
    return parse(schemaContent);
  } catch (error) {
    logger.error(`Error loading schema for version ${version}:`, error);
    throw new Error(`Failed to load schema for version ${version}`);
  }
}

export async function downloadLatestSchemas(): Promise<void> {
  // TODO: Implement schema download from OpenDelivery API repository
  // This will be implemented in a separate task
  throw new Error('Not implemented yet');
} 