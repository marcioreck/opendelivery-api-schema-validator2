import { ValidationEngine } from '../src/services/ValidationEngine';

describe('ValidationEngine', () => {
  let validationEngine: ValidationEngine;

  beforeEach(() => {
    validationEngine = new ValidationEngine();
  });

  describe('validateAgainstSchema', () => {
    it('should validate a payload against a schema', () => {
      const schema = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          version: { type: 'string' }
        },
        required: ['id', 'name', 'version']
      };

      const validPayload = {
        id: '123',
        name: 'Test',
        version: '1.0.0'
      };

      const result = validationEngine.validateAgainstSchema(validPayload, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should detect validation errors', () => {
      const schema = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          version: { type: 'string' }
        },
        required: ['id', 'name', 'version']
      };

      const invalidPayload = {
        id: 123, // Wrong type
        // Missing required fields
      };

      const result = validationEngine.validateAgainstSchema(invalidPayload, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });
  });

  describe('validateSecurityRequirements', () => {
    it('should detect sensitive data in payload', () => {
      const payload = {
        id: '123',
        password: 'secret123',
        creditCard: '1234567890123456',
        user: {
          token: 'abc123',
          apiKey: 'xyz789'
        }
      };

      const errors = validationEngine.validateSecurityRequirements(payload);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.path === 'password')).toBe(true);
      expect(errors.some(e => e.path === 'creditCard')).toBe(true);
      expect(errors.some(e => e.path === 'user.token')).toBe(true);
      expect(errors.some(e => e.path === 'user.apiKey')).toBe(true);
    });

    it('should not report false positives for safe data', () => {
      const payload = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        preferences: {
          theme: 'dark',
          language: 'en'
        }
      };

      const errors = validationEngine.validateSecurityRequirements(payload);
      expect(errors.length).toBe(0);
    });
  });
}); 