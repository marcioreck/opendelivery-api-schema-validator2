import { CompatibilityChecker } from '../src/services/CompatibilityChecker';
import { ApiVersion } from '../src/types';

describe('CompatibilityChecker', () => {
  let compatibilityChecker: CompatibilityChecker;

  beforeEach(() => {
    compatibilityChecker = new CompatibilityChecker();
  });

  describe('checkCompatibility', () => {
    it('should handle missing schema versions', async () => {
      const result = await compatibilityChecker.checkCompatibility(
        '999.0.0' as ApiVersion,
        '1.0.0' as ApiVersion
      );

      expect(result.isCompatible).toBe(false);
      expect(result.errors[0].message).toContain('Schema version');
    });

    it('should detect removed required fields', async () => {
      const sourceSchema = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        },
        required: ['id', 'name']
      };

      const targetSchema = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        },
        required: ['id'] // name is no longer required
      };

      const incompatibilities = compatibilityChecker['findIncompatibilities'](sourceSchema, targetSchema);
      expect(incompatibilities.length).toBeGreaterThan(0);
      expect(incompatibilities[0].message).toContain('Required fields removed');
    });

    it('should detect removed properties', async () => {
      const sourceSchema = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' }
        }
      };

      const targetSchema = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
          // description removed
        }
      };

      const incompatibilities = compatibilityChecker['findIncompatibilities'](sourceSchema, targetSchema);
      expect(incompatibilities.length).toBeGreaterThan(0);
      expect(incompatibilities[0].message).toContain('Property removed');
    });

    it('should detect enum value changes', async () => {
      const sourceSchema = {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['PENDING', 'ACTIVE', 'COMPLETED']
          }
        }
      };

      const targetSchema = {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['PENDING', 'COMPLETED'] // ACTIVE removed
          }
        }
      };

      const incompatibilities = compatibilityChecker['findIncompatibilities'](sourceSchema, targetSchema);
      expect(incompatibilities.length).toBeGreaterThan(0);
      expect(incompatibilities[0].message).toContain('Enum values removed');
    });
  });
}); 