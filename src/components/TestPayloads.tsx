import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

// Test payloads organized by category and validation type
// Compatible with OpenDelivery API versions 1.5.0 and 1.6.0-rc
const TEST_PAYLOADS = {
  valid: {
    basic: {
      label: 'Basic Valid Order',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        type: "DELIVERY",
        displayId: "123456",
        createdAt: "2024-01-20T10:30:00Z",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:30:00Z",
        merchant: {
          id: "merchant123",
          name: "Test Restaurant"
        },
        items: [
          {
            id: "item1",
            name: "Hamburger",
            quantity: 1,
            unit: "UN",
            unitPrice: {
              value: 15.90,
              currency: "BRL"
            },
            totalPrice: {
              value: 15.90,
              currency: "BRL"
            },
            externalCode: "HAM001"
          }
        ],
        total: {
          itemsPrice: {
            value: 15.90,
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
            value: 15.90,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 15.90,
          methods: [
            {
              value: 15.90,
              currency: "BRL",
              type: "PENDING",
              method: "CREDIT",
              methodInfo: "Credit Card"
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
        displayId: "123457",
        createdAt: "2024-01-20T10:35:00Z",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:35:00Z",
        merchant: {
          id: "merchant456",
          name: "Complete Restaurant"
        },
        items: [
          {
            id: "item1",
            name: "Burger Combo",
            quantity: 2,
            unit: "UN",
            unitPrice: {
              value: 25.90,
              currency: "BRL"
            },
            totalPrice: {
              value: 51.80,
              currency: "BRL"
            },
            externalCode: "COMBO001"
          },
          {
            id: "item2",
            name: "Milkshake",
            quantity: 1,
            unit: "UN",
            unitPrice: {
              value: 12.90,
              currency: "BRL"
            },
            totalPrice: {
              value: 12.90,
              currency: "BRL"
            },
            externalCode: "MILK001"
          }
        ],
        total: {
          itemsPrice: {
            value: 64.70,
            currency: "BRL"
          },
          otherFees: {
            value: 5.00,
            currency: "BRL"
          },
          discount: {
            value: 0.00,
            currency: "BRL"
          },
          orderAmount: {
            value: 69.70,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 69.70,
          methods: [
            {
              value: 69.70,
              currency: "BRL",
              type: "PENDING",
              method: "CREDIT",
              methodInfo: "Credit Card"
            }
          ]
        },
        customer: {
          id: "cust456",
          name: "Jane Smith",
          phone: {
            number: "11988888888"
          },
          documentNumber: "98765432100",
          ordersCountOnMerchant: 3
        }
      }
    },
    withScheduling: {
      label: 'Scheduled Order',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174005",
        type: "DELIVERY",
        displayId: "123458",
        createdAt: "2024-01-20T10:40:00Z",
        orderTiming: "SCHEDULED",
        preparationStartDateTime: "2024-01-20T12:00:00Z",
        merchant: {
          id: "merchant789",
          name: "Scheduled Restaurant"
        },
        items: [
          {
            id: "item1",
            name: "Pizza",
            quantity: 1,
            unit: "UN",
            unitPrice: {
              value: 35.00,
              currency: "BRL"
            },
            totalPrice: {
              value: 35.00,
              currency: "BRL"
            },
            externalCode: "PIZZA001"
          }
        ],
        total: {
          itemsPrice: {
            value: 35.00,
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
            value: 35.00,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 35.00,
          pending: 0.00,
          methods: [
            {
              value: 35.00,
              currency: "BRL",
              type: "PREPAID",
              method: "PIX",
              methodInfo: "PIX Payment"
            }
          ]
        },
        schedule: {
          scheduledDateTime: "2024-01-20T12:00:00Z"
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
            observations: "Invalid item"
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
        displayId: "123456",
        createdAt: "invalid-date", // Invalid date format
        orderTiming: "INVALID_TIMING", // Invalid enum value
        preparationStartDateTime: "2024-01-20T10:30:00Z",
        merchant: {
          id: "merchant123",
          name: 123 // Should be string
        },
        items: [
          {
            id: "item1",
            name: 123, // Should be string
            quantity: "1", // Should be number
            unit: 123, // Should be string
            unitPrice: "10.90", // Should be object
            totalPrice: "10.90", // Should be object
            externalCode: "ITEM001"
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
              methodInfo: "Credit Card"
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
        displayId: "123456",
        createdAt: "2024-01-20T10:45:00Z",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:45:00Z",
        merchant: {
          id: "merchant123",
          name: "Test Restaurant"
        },
        items: [
          {
            id: "item1",
            name: "Product",
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
            externalCode: "ITEM001"
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
              methodInfo: "Credit Card"
            }
          ]
        }
      }
    },
    invalidEnums: {
      label: 'Invalid Enum Values',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174004",
        type: "INVALID_TYPE", // Invalid enum value
        displayId: "123456",
        createdAt: "2024-01-20T10:45:00Z",
        orderTiming: "INVALID_TIMING", // Invalid enum value
        preparationStartDateTime: "2024-01-20T10:45:00Z",
        merchant: {
          id: "merchant123",
          name: "Test Restaurant"
        },
        items: [
          {
            id: "item1",
            name: "Product",
            quantity: 1,
            unit: "INVALID_UNIT", // Invalid enum value
            unitPrice: {
              value: 10.00,
              currency: "INVALID_CURRENCY" // Invalid currency
            },
            totalPrice: {
              value: 10.00,
              currency: "INVALID_CURRENCY" // Invalid currency
            },
            externalCode: "ITEM001"
          }
        ],
        total: {
          itemsPrice: {
            value: 10.00,
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
            value: 10.00,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 10.00,
          methods: [
            {
              value: 10.00,
              currency: "BRL",
              type: "INVALID_TYPE", // Invalid enum value
              method: "INVALID_METHOD", // Invalid enum value
              methodInfo: "Credit Card"
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
        displayId: "123456",
        createdAt: "2024-01-20T10:50:00Z",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T10:50:00Z",
        category: "FOOD", // New field in 1.6.0
        merchant: {
          id: "merchant789",
          name: "Compatibility Restaurant"
        },
        items: [
          {
            id: "item1",
            name: "Product",
            quantity: 1,
            unit: "UN",
            unitPrice: {
              value: 10.00,
              currency: "BRL"
            },
            totalPrice: {
              value: 10.00,
              currency: "BRL"
            },
            externalCode: "COMPAT001"
          }
        ],
        total: {
          itemsPrice: {
            value: 10.00,
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
            value: 10.00,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 10.00,
          methods: [
            {
              value: 10.00,
              currency: "BRL",
              type: "PENDING",
              method: "CREDIT",
              methodInfo: "Credit Card"
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