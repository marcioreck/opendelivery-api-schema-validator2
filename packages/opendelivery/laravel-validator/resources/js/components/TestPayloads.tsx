import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

// Test payloads organized by OpenDelivery version compatibility
const TEST_PAYLOADS = {
  // Payloads for OpenDelivery v1.0.0/1.0.1/1.1.0/1.1.1 (older versions)
  v1_0_compatible: {
    basic: {
      label: 'Basic Order (v1.0.0 Compatible)',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        type: "DELIVERY",
        displayId: "ODV-123456",
        createdAt: "2024-01-20T10:30:00Z",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:30:00Z",
        merchant: {
          id: "merchant-abc123",
          name: "Pizzaria Bella Vista"
        },
        customer: {
          id: "customer-123",
          name: "João Silva",
          phone: {
            number: "11987654321"
          },
          documentNumber: "12345678901",
          ordersCountOnMerchant: 1
        },
        items: [
          {
            id: "item-pizza-001",
            name: "Pizza Margherita",
            quantity: 1,
            unit: "UNIT",
            unitPrice: {
              value: 32.90,
              currency: "BRL"
            },
            totalPrice: {
              value: 32.90,
              currency: "BRL"
            },
            externalCode: "PIZZA-MARG-001"
          }
        ],
        total: {
          items: {
            value: 32.90,
            currency: "BRL"
          },
          otherFees: {
            value: 0.00,
            currency: "BRL"
          },
          discount: {
            value: 0.00,
            currency: "BRL"
          },
          orderAmount: {
            value: 32.90,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 32.90,
          methods: [
            {
              value: 32.90,
              currency: "BRL",
              type: "PENDING",
              method: "CREDIT",
              methodInfo: "Cartão de Crédito"
            }
          ]
        }
      }
    },
    complete: {
      label: 'Complete Order (v1.0.0 Compatible)',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174001",
        type: "DELIVERY",
        displayId: "ODV-123457",
        createdAt: "2024-01-20T10:35:00Z",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:35:00Z",
        merchant: {
          id: "merchant-def456",
          name: "Hamburgueria do Centro"
        },
        customer: {
          id: "customer-456",
          name: "Maria Santos",
          phone: {
            number: "11987654322"
          },
          documentNumber: "12345678902",
          ordersCountOnMerchant: 3
        },
        items: [
          {
            id: "item-combo-001",
            name: "Combo Especial",
            quantity: 2,
            unit: "UNIT",
            unitPrice: {
              value: 28.90,
              currency: "BRL"
            },
            totalPrice: {
              value: 57.80,
              currency: "BRL"
            },
            externalCode: "COMBO-ESP-001"
          },
          {
            id: "item-bebida-001",
            name: "Refrigerante Lata",
            quantity: 2,
            unit: "UNIT",
            unitPrice: {
              value: 4.50,
              currency: "BRL"
            },
            totalPrice: {
              value: 9.00,
              currency: "BRL"
            },
            externalCode: "REFRI-LATA-001"
          }
        ],
        total: {
          items: {
            value: 66.80,
            currency: "BRL"
          },
          otherFees: {
            value: 8.00,
            currency: "BRL"
          },
          discount: {
            value: 0.00,
            currency: "BRL"
          },
          orderAmount: {
            value: 74.80,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 74.80,
          methods: [
            {
              value: 74.80,
              currency: "BRL",
              type: "PENDING",
              method: "CREDIT",
              methodInfo: "Cartão de Crédito"
            }
          ]
        }
      }
    }
  },
  // Payloads for OpenDelivery v1.2.0+ (modern versions)
  v1_2_plus: {
    basic: {
      label: 'Basic Order (v1.2.0+ Compatible)',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        type: "DELIVERY",
        displayId: "ODV-123456",
        createdAt: "2024-01-20T10:30:00Z",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:30:00Z",
        merchant: {
          id: "merchant-abc123",
          name: "Pizzaria Bella Vista"
        },
        items: [
          {
            id: "item-pizza-001",
            name: "Pizza Margherita",
            quantity: 1,
            unit: "UN",
            unitPrice: {
              value: 32.90,
              currency: "BRL"
            },
            totalPrice: {
              value: 32.90,
              currency: "BRL"
            },
            externalCode: "PIZZA-MARG-001"
          }
        ],
        total: {
          itemsPrice: {
            value: 32.90,
            currency: "BRL"
          },
          otherFees: {
            value: 0.00,
            currency: "BRL"
          },
          discount: {
            value: 0.00,
            currency: "BRL"
          },
          orderAmount: {
            value: 32.90,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 32.90,
          methods: [
            {
              value: 32.90,
              currency: "BRL",
              type: "PENDING",
              method: "CREDIT",
              methodInfo: "Cartão de Crédito"
            }
          ]
        }
      }
    },
    complete: {
      label: 'Complete Order (v1.2.0+ Compatible)',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174001",
        type: "DELIVERY",
        displayId: "ODV-123457",
        createdAt: "2024-01-20T10:35:00Z",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:35:00Z",
        merchant: {
          id: "merchant-def456",
          name: "Hamburgueria do Centro"
        },
        items: [
          {
            id: "item-combo-001",
            name: "Combo Especial",
            quantity: 2,
            unit: "UN",
            unitPrice: {
              value: 28.90,
              currency: "BRL"
            },
            totalPrice: {
              value: 57.80,
              currency: "BRL"
            },
            externalCode: "COMBO-ESP-001"
          },
          {
            id: "item-bebida-001",
            name: "Refrigerante Lata",
            quantity: 2,
            unit: "UN",
            unitPrice: {
              value: 4.50,
              currency: "BRL"
            },
            totalPrice: {
              value: 9.00,
              currency: "BRL"
            },
            externalCode: "REFRI-LATA-001"
          }
        ],
        total: {
          itemsPrice: {
            value: 66.80,
            currency: "BRL"
          },
          otherFees: {
            value: 8.00,
            currency: "BRL"
          },
          discount: {
            value: 0.00,
            currency: "BRL"
          },
          orderAmount: {
            value: 74.80,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 74.80,
          methods: [
            {
              value: 74.80,
              currency: "BRL",
              type: "PENDING",
              method: "CREDIT",
              methodInfo: "Cartão de Crédito"
            }
          ]
        },
        customer: {
          id: "customer-ghi789",
          name: "João Silva",
          phone: {
            number: "11987654321"
          },
          documentNumber: "12345678901",
          ordersCountOnMerchant: 5
        }
      }
    }
  },
  // Invalid payloads for testing error handling
  invalid: {
    missingRequired: {
      label: 'Missing Required Fields',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174002",
        items: [
          {
            // Missing required fields: id, name, quantity, unitPrice
            observations: "Item sem campos obrigatórios"
          }
        ],
        // Missing required fields: type, orderTiming, preparationStartDateTime, merchant, total, payments
        createdAt: "2024-01-20T10:40:00Z"
      }
    },
    invalidTypes: {
      label: 'Invalid Data Types',
      payload: {
        id: 123, // Should be string UUID
        type: "INVALID_TYPE", // Invalid enum value
        displayId: "ODV-123456",
        createdAt: "invalid-date", // Invalid date format
        orderTiming: "INVALID_TIMING", // Invalid enum value
        preparationStartDateTime: "2024-01-20T10:30:00Z",
        merchant: {
          id: "merchant-abc123",
          name: 123 // Should be string
        },
        items: [
          {
            id: "item-001",
            name: 123, // Should be string
            quantity: "1", // Should be number
            unit: 123, // Should be string
            unitPrice: "10.90", // Should be object
            totalPrice: "10.90", // Should be object
            externalCode: "ITEM-001"
          }
        ],
        total: {
          itemsPrice: "15.90", // Should be object
          otherFees: "0.00", // Should be object
          discount: "0.00", // Should be object
          orderAmount: "15.90" // Should be object
        },
        payments: {
          prepaid: "0.00", // Should be number
          pending: "15.90", // Should be number
          methods: "invalid" // Should be array
        }
      }
    },
    invalidEnum: {
      label: 'Invalid Enum Values',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174003",
        type: "INVALID_SERVICE_TYPE", // Invalid enum
        displayId: "ODV-123456",
        createdAt: "2024-01-20T10:30:00Z",
        orderTiming: "INVALID_TIMING", // Invalid enum
        preparationStartDateTime: "2024-01-20T10:30:00Z",
        merchant: {
          id: "merchant-abc123",
          name: "Pizzaria Bella Vista"
        },
        items: [
          {
            id: "item-pizza-001",
            name: "Pizza Margherita",
            quantity: 1,
            unit: "INVALID_UNIT", // Invalid enum
            unitPrice: {
              value: 32.90,
              currency: "INVALID_CURRENCY" // Invalid enum
            },
            totalPrice: {
              value: 32.90,
              currency: "BRL"
            },
            externalCode: "PIZZA-MARG-001"
          }
        ],
        total: {
          itemsPrice: {
            value: 32.90,
            currency: "BRL"
          },
          otherFees: {
            value: 0.00,
            currency: "BRL"
          },
          discount: {
            value: 0.00,
            currency: "BRL"
          },
          orderAmount: {
            value: 32.90,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 32.90,
          methods: [
            {
              value: 32.90,
              currency: "BRL",
              type: "INVALID_PAYMENT_TYPE", // Invalid enum
              method: "INVALID_METHOD", // Invalid enum
              methodInfo: "Cartão de Crédito"
            }
          ]
        }
      }
    }
  }
};

interface TestPayloadsProps {
  onSelectPayload: (payload: any) => void;
}

export default function TestPayloads({ onSelectPayload }: TestPayloadsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCategory('');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePayloadSelect = (payload: any) => {
    onSelectPayload(payload);
    handleClose();
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'v1_0_compatible':
        return 'OpenDelivery v1.0.0 Compatible';
      case 'v1_2_plus':
        return 'OpenDelivery v1.2.0+ Compatible';
      case 'invalid':
        return 'Invalid Payloads (for testing)';
      default:
        return category;
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={handleClick}
        sx={{ mb: 2 }}
      >
        Select Test Payload
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: '300px',
          },
        }}
      >
        {!selectedCategory ? (
          // Show categories
          Object.keys(TEST_PAYLOADS).map((category) => (
            <MenuItem
              key={category}
              onClick={() => handleCategorySelect(category)}
            >
              <Typography variant="body2">
                {getCategoryLabel(category)}
              </Typography>
            </MenuItem>
          ))
        ) : (
          // Show payloads for selected category
          <>
            <MenuItem onClick={() => setSelectedCategory('')}>
              <Typography variant="body2" color="primary">
                ← Back to Categories
              </Typography>
            </MenuItem>
            {Object.entries(TEST_PAYLOADS[selectedCategory as keyof typeof TEST_PAYLOADS]).map(([key, payload]) => (
              <MenuItem
                key={key}
                onClick={() => handlePayloadSelect(payload.payload)}
              >
                <Typography variant="body2">
                  {payload.label}
                </Typography>
              </MenuItem>
            ))}
          </>
        )}
      </Menu>
    </Box>
  );
} 