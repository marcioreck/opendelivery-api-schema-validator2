import { Validator } from '../src/services/Validator';
import { ApiVersion } from '../src/types';

describe('Validator', () => {
  let validator: Validator;

  beforeEach(async () => {
    validator = new Validator();
    await validator.initialize();
  });

  describe('validate', () => {
    it('should validate a correct payload', async () => {
      const payload = {
        id: '12345678-1234-5678-9012-123456789012',
        type: 'DELIVERY',
        displayId: 'ORD-123',
        createdAt: '2023-01-01T10:00:00Z',
        orderTiming: 'INSTANT',
        preparationStartDateTime: '2023-01-01T10:00:00Z',
        merchant: {
          id: '22815773000169-dbc7e35a-c936-4665-9e13-eb55eb8b6824',
          name: 'Test Merchant'
        },
        items: [
          {
            id: '87654321-4321-5678-9012-210987654321',
            name: 'Test Item',
            unit: 'UNIT',
            quantity: 1,
            externalCode: 'TEST001',
            unitPrice: {
              value: 10.99,
              currency: 'BRL'
            },
            totalPrice: {
              value: 10.99,
              currency: 'BRL'
            }
          }
        ],
        total: {
          items: {
            value: 10.99,
            currency: 'BRL'
          },
          otherFees: {
            value: 0,
            currency: 'BRL'
          },
          discount: {
            value: 0,
            currency: 'BRL'
          },
          orderAmount: {
            value: 10.99,
            currency: 'BRL'
          }
        },
        payments: {
          prepaid: 10.99,
          pending: 0,
          methods: [
            {
              value: 10.99,
              currency: 'BRL',
              type: 'PREPAID',
              method: 'CREDIT'
            }
          ]
        },
        customer: {
          id: '11111111-1111-5678-9012-111111111111',
          name: 'Test Customer',
          phone: {
            number: '+5511999999999'
          },
          documentNumber: '12345678901',
          ordersCountOnMerchant: 1
        }
      };

      const result = await validator.validate(payload, '1.0.0' as ApiVersion);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
      expect(result.version).toBe('1.0.0');
    });

    it('should reject an invalid payload', async () => {
      const payload = {
        // Missing required fields
        id: 'invalid-id'
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
        id: '12345678-1234-5678-9012-123456789012',
        type: 'DELIVERY',
        displayId: 'ORD-123',
        createdAt: '2023-01-01T10:00:00Z',
        orderTiming: 'INSTANT',
        preparationStartDateTime: '2023-01-01T10:00:00Z',
        merchant: {
          id: '22815773000169-dbc7e35a-c936-4665-9e13-eb55eb8b6824',
          name: 'Test Merchant'
        },
        items: [
          {
            id: '87654321-4321-5678-9012-210987654321',
            name: 'Test Item',
            unit: 'UNIT',
            quantity: 1,
            externalCode: 'TEST001',
            unitPrice: {
              value: 10.99,
              currency: 'BRL'
            },
            totalPrice: {
              value: 10.99,
              currency: 'BRL'
            },
            creditCard: '1234567890123456'
          }
        ],
        total: {
          items: {
            value: 10.99,
            currency: 'BRL'
          },
          otherFees: {
            value: 0,
            currency: 'BRL'
          },
          discount: {
            value: 0,
            currency: 'BRL'
          },
          orderAmount: {
            value: 10.99,
            currency: 'BRL'
          }
        },
        payments: {
          prepaid: 10.99,
          pending: 0,
          methods: [
            {
              value: 10.99,
              currency: 'BRL',
              type: 'PREPAID',
              method: 'CREDIT'
            }
          ]
        },
        customer: {
          id: '11111111-1111-5678-9012-111111111111',
          name: 'Test Customer',
          phone: {
            number: '+5511999999999'
          },
          documentNumber: '12345678901',
          ordersCountOnMerchant: 1
        },
        password: 'secret123'
      };

      const result = await validator.validate(payload, '1.0.0' as ApiVersion);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some(e => e.message.includes('sensitive'))).toBe(true);
    });
  });
}); 