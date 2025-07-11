import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

// Test payloads organized by category and validation type
// Compatible with OpenDelivery API versions - Following official OpenDelivery standard
const TEST_PAYLOADS = {
  valid: {
    basic: {
      label: 'Basic Valid Order',
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
      label: 'Complete Valid Order',
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
          methods: [
            {
              value: "15.90", // Should be number
              currency: "BRL",
              type: "INVALID_TYPE", // Invalid enum value
              method: "INVALID_METHOD", // Invalid enum value
              methodInfo: "Cartão de Crédito"
            }
          ]
        }
      }
    },
    invalidValues: {
      label: 'Invalid Values',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174003",
        type: "DELIVERY",
        displayId: "ODV-123456",
        createdAt: "2024-01-20T10:45:00Z",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:45:00Z",
        merchant: {
          id: "merchant-abc123",
          name: "Lanchonete da Praça"
        },
        items: [
          {
            id: "item-001",
            name: "Lanche Simples",
            quantity: 0, // Minimum is 1
            unit: "UN",
            unitPrice: {
              value: -10.00, // Minimum is 0
              currency: "BRL"
            },
            totalPrice: {
              value: -10.00, // Minimum is 0
              currency: "BRL"
            },
            externalCode: "LANCHE-001"
          }
        ],
        total: {
          itemsPrice: {
            value: -10.00, // Minimum is 0
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
            value: -10.00, // Minimum is 0
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: -10.00, // Minimum is 0
          methods: [
            {
              value: -10.00, // Minimum is 0
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
  compatibility: {
    v1_5_to_1_6: {
      label: 'v1.5.0 to v1.6.0 Changes',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174006",
        type: "DELIVERY",
        displayId: "ODV-123456",
        createdAt: "2024-01-20T10:50:00Z",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:50:00Z",
        category: "FOOD", // New field in 1.6.0
        merchant: {
          id: "merchant-jkl012",
          name: "Restaurante Bom Sabor"
        },
        items: [
          {
            id: "item-001",
            name: "Prato Executivo",
            quantity: 1,
            unit: "UN",
            unitPrice: {
              value: 24.90,
              currency: "BRL"
            },
            totalPrice: {
              value: 24.90,
              currency: "BRL"
            },
            externalCode: "PRATO-EXEC-001"
          }
        ],
        total: {
          itemsPrice: {
            value: 24.90,
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
            value: 24.90,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 24.90,
          methods: [
            {
              value: 24.90,
              currency: "BRL",
              type: "PENDING",
              method: "CREDIT",
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
  const [category, setCategory] = useState<string>('');
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setCategory('');
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCategory('');
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
  };

  const handlePayloadSelect = (payload: any) => {
    onSelectPayload(payload);
    handleClose();
  };

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={handleClick}
        size="small"
      >
        Load Example
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {!category ? (
          Object.entries(TEST_PAYLOADS).map(([cat, _]) => (
            <MenuItem
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              sx={{ textTransform: 'capitalize' }}
            >
              <Typography>{cat} Payloads</Typography>
            </MenuItem>
          ))
        ) : (
          Object.entries(TEST_PAYLOADS[category as keyof typeof TEST_PAYLOADS]).map(([_, { label, payload }]) => (
            <MenuItem
              key={label}
              onClick={() => handlePayloadSelect(payload)}
            >
              <Typography>{label}</Typography>
            </MenuItem>
          ))
        )}
        {category && (
          <MenuItem
            onClick={() => setCategory('')}
            sx={{ borderTop: '1px solid #eee' }}
          >
            <Typography>← Back</Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}

export { TEST_PAYLOADS }; 