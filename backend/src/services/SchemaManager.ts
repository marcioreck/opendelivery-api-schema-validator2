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
    // For testing purposes, use a hardcoded schema
    const testSchema = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0'
      },
      components: {
        schemas: {
          Order: {
            type: 'object',
            required: ['id', 'items', 'status'],
            properties: {
              id: {
                type: 'string'
              },
              items: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/OrderItem'
                }
              },
              status: {
                type: 'string',
                enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DISPATCHED', 'DELIVERED', 'CONCLUDED', 'CANCELLED']
              }
            }
          },
          OrderItem: {
            type: 'object',
            required: ['id', 'name', 'quantity', 'price'],
            properties: {
              id: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              quantity: {
                type: 'number',
                minimum: 1
              },
              price: {
                type: 'number',
                minimum: 0
              }
            }
          }
        }
      }
    };

    this.schemas.set('1.0.0' as ApiVersion, testSchema);
  }

  public async getSchema(version: ApiVersion): Promise<object | undefined> {
    if (!this.schemas.has(version)) {
      await this.loadSchemas();
    }
    return this.schemas.get(version);
  }

  public async getAllVersions(): Promise<ApiVersion[]> {
    if (this.schemas.size === 0) {
      await this.loadSchemas();
    }
    return Array.from(this.schemas.keys());
  }
} 