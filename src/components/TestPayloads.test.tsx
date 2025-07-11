import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TestPayloads, { TEST_PAYLOADS } from './TestPayloads';

describe('TestPayloads Component', () => {
  const mockOnSelectPayload = vi.fn();

  beforeEach(() => {
    mockOnSelectPayload.mockClear();
  });

  it('renders test payload button', () => {
    render(<TestPayloads onSelectPayload={mockOnSelectPayload} />);
    expect(screen.getByText('Load Example')).toBeInTheDocument();
  });

  describe('Valid Payloads', () => {
    it('basic valid order has all required fields', () => {
      const basicPayload = TEST_PAYLOADS.valid.basic.payload;
      expect(basicPayload).toHaveProperty('id');
      expect(basicPayload).toHaveProperty('type');
      expect(basicPayload).toHaveProperty('displayId');
      expect(basicPayload).toHaveProperty('createdAt');
      expect(basicPayload).toHaveProperty('orderTiming');
      expect(basicPayload).toHaveProperty('preparationStartDateTime');
      expect(basicPayload).toHaveProperty('merchant');
      expect(basicPayload).toHaveProperty('items');
      expect(basicPayload).toHaveProperty('total');
      expect(basicPayload).toHaveProperty('payments');
    });

    it('complete valid order has all optional fields', () => {
      const completePayload = TEST_PAYLOADS.valid.complete.payload;
      expect(completePayload).toHaveProperty('merchant');
      expect(completePayload).toHaveProperty('preparationStartDateTime');
      expect(completePayload.total).toHaveProperty('itemsPrice');
      expect(completePayload.total).toHaveProperty('otherFees');
      expect(completePayload.total).toHaveProperty('discount');
      expect(completePayload).toHaveProperty('customer');
    });

    it('valid payloads have correct data types', () => {
      const basicPayload = TEST_PAYLOADS.valid.basic.payload;
      expect(typeof basicPayload.id).toBe('string');
      expect(typeof basicPayload.items[0].quantity).toBe('number');
      expect(typeof basicPayload.items[0].unitPrice).toBe('object');
      expect(typeof basicPayload.total.orderAmount).toBe('object');
    });

    it('valid payloads have positive values', () => {
      const basicPayload = TEST_PAYLOADS.valid.basic.payload;
      expect(basicPayload.items[0].quantity).toBeGreaterThan(0);
      expect(basicPayload.items[0].unitPrice.value).toBeGreaterThanOrEqual(0);
      expect(basicPayload.total.orderAmount.value).toBeGreaterThan(0);
    });

    it('valid payloads have proper enum values', () => {
      const basicPayload = TEST_PAYLOADS.valid.basic.payload;
      expect(['INSTANT', 'SCHEDULED', 'ONDEMAND']).toContain(basicPayload.orderTiming);
      expect(['DELIVERY', 'TAKEOUT', 'INDOOR']).toContain(basicPayload.type);
      expect(['PREPAID', 'PENDING']).toContain(basicPayload.payments.methods[0].type);
    });

    it('scheduled order has proper scheduling fields', () => {
      const scheduledPayload = TEST_PAYLOADS.valid.withScheduling.payload;
      expect(scheduledPayload.orderTiming).toBe('SCHEDULED');
      expect(scheduledPayload).toHaveProperty('schedule');
      expect(scheduledPayload.schedule).toHaveProperty('scheduledDateTime');
    });
  });

  describe('Invalid Payloads', () => {
    it('missing required fields payload is incomplete', () => {
      const missingFieldsPayload = TEST_PAYLOADS.invalid.missingRequired.payload;
      expect(missingFieldsPayload).not.toHaveProperty('type');
      expect(missingFieldsPayload).not.toHaveProperty('orderTiming');
      expect(missingFieldsPayload).not.toHaveProperty('preparationStartDateTime');
      expect(missingFieldsPayload).not.toHaveProperty('merchant');
      expect(missingFieldsPayload).not.toHaveProperty('total');
      expect(missingFieldsPayload).not.toHaveProperty('payments');
    });

    it('invalid types payload has wrong data types', () => {
      const invalidTypesPayload = TEST_PAYLOADS.invalid.invalidTypes.payload;
      expect(typeof invalidTypesPayload.id).toBe('number'); // Should be string
      expect(typeof invalidTypesPayload.items[0].name).toBe('number'); // Should be string
      expect(typeof invalidTypesPayload.total.itemsPrice).toBe('string'); // Should be object
      expect(typeof invalidTypesPayload.payments.methods[0].value).toBe('string'); // Should be number
    });

    it('invalid values payload has out-of-range values', () => {
      const invalidValuesPayload = TEST_PAYLOADS.invalid.invalidValues.payload;
      expect(invalidValuesPayload.items[0].quantity).toBe(0); // Should be >= 1
      expect(invalidValuesPayload.items[0].unitPrice.value).toBeLessThan(0); // Should be >= 0
      expect(invalidValuesPayload.total.orderAmount.value).toBeLessThan(0); // Should be >= 0
    });

    it('invalid enum values payload has invalid enum values', () => {
      const invalidEnumsPayload = TEST_PAYLOADS.invalid.invalidEnums.payload;
      expect(['INSTANT', 'SCHEDULED', 'ONDEMAND']).not.toContain(invalidEnumsPayload.orderTiming);
      expect(['DELIVERY', 'TAKEOUT', 'INDOOR']).not.toContain(invalidEnumsPayload.type);
      expect(['PREPAID', 'PENDING']).not.toContain(invalidEnumsPayload.payments.methods[0].type);
    });
  });

  describe('Compatibility Tests', () => {
    it('compatibility payload exists for version migration', () => {
      const compatibilityPayload = TEST_PAYLOADS.compatibility.v1_5_to_1_6.payload;
      expect(compatibilityPayload).toHaveProperty('id');
      expect(compatibilityPayload).toHaveProperty('orderTiming');
      expect(compatibilityPayload).toHaveProperty('type');
      expect(compatibilityPayload).toHaveProperty('merchant');
      expect(compatibilityPayload).toHaveProperty('category'); // New field in 1.6.0
    });
  });

  describe('User Interaction', () => {
    it('opens menu when button is clicked', async () => {
      render(<TestPayloads onSelectPayload={mockOnSelectPayload} />);
      
      const button = screen.getByText('Load Example');
      fireEvent.click(button);

      // Check if menu is open by looking for menu items
      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(3);
      
      // Check if all category options are present using exact text matching
      expect(screen.getByRole('menuitem', { name: /^valid Payloads$/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /^invalid Payloads$/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /^compatibility Payloads$/i })).toBeInTheDocument();
    });

    it('navigates to payload selection after category selection', async () => {
      render(<TestPayloads onSelectPayload={mockOnSelectPayload} />);
      
      const button = screen.getByText('Load Example');
      fireEvent.click(button);

      const validCategory = screen.getByRole('menuitem', { name: /^valid Payloads$/i });
      fireEvent.click(validCategory);

      expect(screen.getByText('Basic Valid Order')).toBeInTheDocument();
      expect(screen.getByText('Complete Valid Order')).toBeInTheDocument();
      expect(screen.getByText('Scheduled Order')).toBeInTheDocument();
      expect(screen.getByText('← Back')).toBeInTheDocument();
    });

    it('calls onSelectPayload when a payload is selected', async () => {
      render(<TestPayloads onSelectPayload={mockOnSelectPayload} />);
      
      const button = screen.getByText('Load Example');
      fireEvent.click(button);

      const validCategory = screen.getByRole('menuitem', { name: /^valid Payloads$/i });
      fireEvent.click(validCategory);

      const basicPayload = screen.getByText('Basic Valid Order');
      fireEvent.click(basicPayload);

      expect(mockOnSelectPayload).toHaveBeenCalledWith(TEST_PAYLOADS.valid.basic.payload);
    });
  });
}); 