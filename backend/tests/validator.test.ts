import { Validator } from '../src/services/Validator';
import { ApiVersion } from '../src/types';

describe('Validator', () => {
  let validator: Validator;

  beforeEach(async () => {
    validator = new Validator();
    await validator.initialize();
  });

  describe('validate', () => {
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

    it('should validate a correct payload', async () => {
      const payload = {
        id: '123',
        items: [
          {
            id: 'item1',
            name: 'Item 1',
            quantity: 1,
            price: 10.99
          }
        ],
        status: 'PENDING'
      };

      const result = await validator.validate(payload, '1.0.0' as ApiVersion);
      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
      expect(result.version).toBe('1.0.0');
    });

    it('should reject an invalid payload', async () => {
      const payload = {
        // Missing required fields
      };

      const result = await validator.validate(payload, '1.0.0' as ApiVersion);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it('should handle non-existent schema version', async () => {
      const payload = {
        id: '123',
        name: 'Test'
      };

      const result = await validator.validate(payload, '999.0.0' as ApiVersion);
      expect(result.isValid).toBe(false);
      expect(result.errors?.[0].message).toContain('Schema version');
    });

    it('should detect sensitive data', async () => {
      const payload = {
        id: '123',
        items: [
          {
            id: 'item1',
            name: 'Item 1',
            quantity: 1,
            price: 10.99,
            creditCard: '1234567890123456'
          }
        ],
        status: 'PENDING',
        password: 'secret123'
      };

      const result = await validator.validate(payload, '1.0.0' as ApiVersion);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(e => e.message.includes('sensitive'))).toBe(true);
    });
  });
}); 