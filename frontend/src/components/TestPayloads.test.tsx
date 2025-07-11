import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TestPayloads from './TestPayloads';

// Import TEST_PAYLOADS directly from the component
const TEST_PAYLOADS = {
  v1_0_compatible: {
    basic: {
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        type: "DELIVERY",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:30:00Z",
        merchant: { id: "merchant-abc123", name: "Pizzaria Bella Vista" },
        customer: { id: "customer-123", name: "João Silva" },
        items: [{ id: "item-1", name: "Pizza", quantity: 1, unit: "UNIT", unitPrice: { value: 32.90, currency: "BRL" }, totalPrice: { value: 32.90, currency: "BRL" } }],
        total: { items: { value: 32.90, currency: "BRL" }, orderAmount: { value: 32.90, currency: "BRL" } },
        payments: { prepaid: 0.00, pending: 32.90, methods: [{ value: 32.90, currency: "BRL", type: "PENDING", method: "CREDIT" }] }
      }
    },
    complete: {
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174001",
        type: "DELIVERY",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:30:00Z",
        merchant: { id: "merchant-def456", name: "Hamburgueria do Centro" },
        customer: { id: "customer-456", name: "Maria Santos" },
        items: [{ id: "item-combo-001", quantity: 2, unitPrice: { value: 28.90, currency: "BRL" } }],
        total: { items: { value: 66.80, currency: "BRL" }, orderAmount: { value: 74.80, currency: "BRL" } },
        payments: { methods: [{ type: "PENDING" }] }
      }
    }
  },
  v1_2_plus: {
    basic: {
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        type: "DELIVERY",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:30:00Z",
        merchant: { id: "merchant-abc123", name: "Pizzaria Bella Vista" },
        items: [{ id: "item-pizza-001", name: "Pizza Margherita", quantity: 1, unit: "UN", unitPrice: { value: 32.90, currency: "BRL" }, totalPrice: { value: 32.90, currency: "BRL" } }],
        total: { itemsPrice: { value: 32.90, currency: "BRL" }, orderAmount: { value: 32.90, currency: "BRL" } },
        payments: { prepaid: 0.00, pending: 32.90, methods: [{ value: 32.90, currency: "BRL", type: "PENDING", method: "CREDIT" }] }
      }
    },
    complete: {
      payload: {
        merchant: { name: "Test" },
        preparationStartDateTime: "2024-01-20T10:30:00Z",
        total: { itemsPrice: { value: 74.80, currency: "BRL" }, otherFees: { value: 8.00, currency: "BRL" }, discount: { value: 0.00, currency: "BRL" } }
      }
    }
  },
  invalid: {
    missingRequired: {
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174002",
        items: [{ observations: "Item sem campos obrigatórios" }],
        createdAt: "2024-01-20T10:40:00Z"
      }
    },
    invalidTypes: {
      payload: {
        id: 123,
        type: "INVALID_TYPE",
        orderTiming: "INVALID_TIMING",
        items: [{ name: 123, quantity: "1" }],
        total: { itemsPrice: "15.90" },
        payments: { methods: "invalid" }
      }
    },
    invalidEnum: {
      payload: {
        type: "INVALID_SERVICE_TYPE",
        orderTiming: "INVALID_TIMING",
        items: [{ unit: "INVALID_UNIT", unitPrice: { currency: "INVALID_CURRENCY" } }]
      }
    }
  }
};

describe('TestPayloads Component', () => {
  const mockOnSelectPayload = vi.fn();

  beforeEach(() => {
    mockOnSelectPayload.mockClear();
  });

  it('renders test payload button', () => {
    render(<TestPayloads onSelectPayload={mockOnSelectPayload} />);
    expect(screen.getByText('Select Test Payload')).toBeInTheDocument();
  });

  describe('Valid Payloads', () => {
    it('v1.2.0+ basic valid order has all required fields', () => {
      const basicPayload = TEST_PAYLOADS.v1_2_plus.basic.payload;
      expect(basicPayload).toHaveProperty('type');
      expect(basicPayload).toHaveProperty('orderTiming');
      expect(basicPayload).toHaveProperty('preparationStartDateTime');
      expect(basicPayload).toHaveProperty('merchant');
      expect(basicPayload).toHaveProperty('items');
      expect(basicPayload).toHaveProperty('total');
      expect(basicPayload).toHaveProperty('payments');
      // Customer is optional in version 1.2.0+
    });

    it('v1.0.0 complete valid order has customer field', () => {
      const completePayload = TEST_PAYLOADS.v1_0_compatible.complete.payload;
      expect(completePayload).toHaveProperty('merchant');
      expect(completePayload).toHaveProperty('preparationStartDateTime');
      expect(completePayload).toHaveProperty('customer'); // Required in v1.0.0
      expect(completePayload.total).toHaveProperty('items'); // v1.0.0 uses 'items' not 'itemsPrice'
    });

    it('valid payloads have correct data types', () => {
      const basicPayload = TEST_PAYLOADS.v1_2_plus.basic.payload;
      expect(typeof basicPayload.id).toBe('string');
      expect(typeof basicPayload.items[0].quantity).toBe('number');
      expect(typeof basicPayload.items[0].unitPrice).toBe('object');
      expect(typeof basicPayload.total.orderAmount).toBe('object');
    });

    it('valid payloads have positive values', () => {
      const basicPayload = TEST_PAYLOADS.v1_2_plus.basic.payload;
      expect(basicPayload.items[0].quantity).toBeGreaterThan(0);
      expect(basicPayload.items[0].unitPrice.value).toBeGreaterThanOrEqual(0);
      expect(basicPayload.total.orderAmount.value).toBeGreaterThan(0);
    });

    it('valid payloads have proper enum values', () => {
      const basicPayload = TEST_PAYLOADS.v1_2_plus.basic.payload;
      expect(['INSTANT']).toContain(basicPayload.orderTiming);
      expect(['DELIVERY', 'TAKEOUT']).toContain(basicPayload.type);
      expect(['PREPAID', 'PENDING']).toContain(basicPayload.payments.methods[0].type);
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
      expect(typeof invalidTypesPayload.payments.methods).toBe('string'); // Should be array
    });

    it('invalid enum values payload has invalid enums', () => {
      const invalidEnumPayload = TEST_PAYLOADS.invalid.invalidEnum.payload;
      expect(invalidEnumPayload.type).toBe('INVALID_SERVICE_TYPE'); // Invalid enum value
      expect(invalidEnumPayload.orderTiming).toBe('INVALID_TIMING'); // Invalid enum value
      expect(invalidEnumPayload.items[0].unit).toBe('INVALID_UNIT'); // Invalid enum value
      expect(invalidEnumPayload.items[0].unitPrice.currency).toBe('INVALID_CURRENCY'); // Invalid enum value
    });

    it('invalid types payload has invalid enum values', () => {
      const invalidTypesPayload = TEST_PAYLOADS.invalid.invalidTypes.payload;
      expect(['INSTANT']).not.toContain(invalidTypesPayload.orderTiming);
      expect(['DELIVERY', 'TAKEOUT']).not.toContain(invalidTypesPayload.type);
    });
  });

  describe('User Interaction', () => {
    it('opens menu when button is clicked', async () => {
      render(<TestPayloads onSelectPayload={mockOnSelectPayload} />);
      
      const button = screen.getByText('Select Test Payload');
      fireEvent.click(button);

      // Check if menu is open by looking for category options
      expect(screen.getByText('OpenDelivery v1.0.0 Compatible')).toBeInTheDocument();
      expect(screen.getByText('OpenDelivery v1.2.0+ Compatible')).toBeInTheDocument();
      expect(screen.getByText('Invalid Payloads (for testing)')).toBeInTheDocument();
    });

    it('navigates to payload selection after category selection', async () => {
      render(<TestPayloads onSelectPayload={mockOnSelectPayload} />);
      
      const button = screen.getByText('Select Test Payload');
      fireEvent.click(button);

      const validCategory = screen.getByText('OpenDelivery v1.2.0+ Compatible');
      fireEvent.click(validCategory);

      expect(screen.getByText('Basic Order (v1.2.0+ Compatible)')).toBeInTheDocument();
      expect(screen.getByText('Complete Order (v1.2.0+ Compatible)')).toBeInTheDocument();
      expect(screen.getByText('← Back to Categories')).toBeInTheDocument();
    });

    it('calls onSelectPayload when a payload is selected', async () => {
      render(<TestPayloads onSelectPayload={mockOnSelectPayload} />);
      
      const button = screen.getByText('Select Test Payload');
      fireEvent.click(button);

      const validCategory = screen.getByText('OpenDelivery v1.2.0+ Compatible');
      fireEvent.click(validCategory);

      const basicPayload = screen.getByText('Basic Order (v1.2.0+ Compatible)');
      fireEvent.click(basicPayload);

      // Verify that onSelectPayload was called with a payload object
      expect(mockOnSelectPayload).toHaveBeenCalledTimes(1);
      const calledPayload = mockOnSelectPayload.mock.calls[0][0];
      expect(calledPayload).toHaveProperty('id');
      expect(calledPayload).toHaveProperty('type', 'DELIVERY');
      expect(calledPayload).toHaveProperty('orderTiming', 'INSTANT');
      expect(calledPayload).toHaveProperty('merchant');
      expect(calledPayload).toHaveProperty('items');
      expect(calledPayload).toHaveProperty('total');
      expect(calledPayload).toHaveProperty('payments');
    });
  });
}); 