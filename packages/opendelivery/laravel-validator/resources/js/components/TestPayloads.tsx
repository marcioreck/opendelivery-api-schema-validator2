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
            id: "item-burger-001",
            name: "Hambúrguer Tradicional",
            quantity: 2,
            unit: "UNIT",
            unitPrice: {
              value: 25.50,
              currency: "BRL"
            },
            totalPrice: {
              value: 51.00,
              currency: "BRL"
            },
            externalCode: "BURGER-TRAD-001"
          },
          {
            id: "item-fries-001",
            name: "Batata Frita Grande",
            quantity: 1,
            unit: "UNIT",
            unitPrice: {
              value: 12.00,
              currency: "BRL"
            },
            totalPrice: {
              value: 12.00,
              currency: "BRL"
            },
            externalCode: "FRIES-LARGE-001"
          }
        ],
        total: {
          items: {
            value: 63.00,
            currency: "BRL"
          },
          otherFees: {
            value: 5.00,
            currency: "BRL"
          },
          discount: {
            value: 8.00,
            currency: "BRL"
          },
          orderAmount: {
            value: 60.00,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 60.00,
          methods: [
            {
              value: 60.00,
              currency: "BRL",
              type: "PENDING",
              method: "DEBIT",
              methodInfo: "Cartão de Débito"
            }
          ]
        }
      }
    }
  },
  // Payloads for OpenDelivery v1.2.0+ (with enhanced features)
  v1_2_compatible: {
    enhanced: {
      label: 'Enhanced Order (v1.2.0+ Compatible)',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174002",
        type: "DELIVERY",
        displayId: "ODV-123458",
        createdAt: "2024-01-20T11:00:00Z",
        orderTiming: "SCHEDULED",
        preparationStartDateTime: "2024-01-20T12:00:00Z",
        merchant: {
          id: "merchant-ghi789",
          name: "Restaurante Gourmet",
          address: {
            street: "Rua das Flores, 123",
            city: "São Paulo",
            state: "SP",
            zipCode: "01234-567"
          }
        },
        customer: {
          id: "customer-789",
          name: "Carlos Oliveira",
          phone: {
            number: "11987654323"
          },
          documentNumber: "12345678903",
          ordersCountOnMerchant: 7,
          email: "carlos@example.com"
        },
        items: [
          {
            id: "item-pasta-001",
            name: "Pasta Carbonara",
            quantity: 1,
            unit: "UNIT",
            unitPrice: {
              value: 45.00,
              currency: "BRL"
            },
            totalPrice: {
              value: 45.00,
              currency: "BRL"
            },
            externalCode: "PASTA-CARB-001",
            observations: "Sem cebola"
          }
        ],
        total: {
          items: {
            value: 45.00,
            currency: "BRL"
          },
          otherFees: {
            value: 6.00,
            currency: "BRL"
          },
          discount: {
            value: 0.00,
            currency: "BRL"
          },
          orderAmount: {
            value: 51.00,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 51.00,
          methods: [
            {
              value: 51.00,
              currency: "BRL",
              type: "PENDING",
              method: "PIX",
              methodInfo: "PIX"
            }
          ]
        },
        delivery: {
          address: {
            street: "Av. Paulista, 1000",
            city: "São Paulo",
            state: "SP",
            zipCode: "01310-100"
          },
          estimatedDeliveryTime: "2024-01-20T12:45:00Z"
        }
      }
    }
  },
  // Payloads for OpenDelivery v1.5.0+ (latest features)
  v1_5_compatible: {
    latest: {
      label: 'Latest Features (v1.5.0+ Compatible)',
      payload: {
        id: "123e4567-e89b-12d3-a456-426614174003",
        type: "DELIVERY",
        displayId: "ODV-123459",
        createdAt: "2024-01-20T14:00:00Z",
        orderTiming: "INSTANT",
        preparationStartDateTime: "2024-01-20T14:00:00Z",
        merchant: {
          id: "merchant-jkl012",
          name: "Sushi Express",
          address: {
            street: "Rua da Liberdade, 456",
            city: "São Paulo",
            state: "SP",
            zipCode: "01503-001"
          },
          coordinates: {
            lat: -23.5505,
            lng: -46.6333
          }
        },
        customer: {
          id: "customer-012",
          name: "Ana Costa",
          phone: {
            number: "11987654324"
          },
          documentNumber: "12345678904",
          ordersCountOnMerchant: 15,
          email: "ana@example.com"
        },
        items: [
          {
            id: "item-sushi-001",
            name: "Combo Sushi Premium",
            quantity: 1,
            unit: "UNIT",
            unitPrice: {
              value: 85.00,
              currency: "BRL"
            },
            totalPrice: {
              value: 85.00,
              currency: "BRL"
            },
            externalCode: "SUSHI-PREM-001",
            observations: "Sem wasabi"
          },
          {
            id: "item-drink-001",
            name: "Água Mineral",
            quantity: 2,
            unit: "UNIT",
            unitPrice: {
              value: 3.50,
              currency: "BRL"
            },
            totalPrice: {
              value: 7.00,
              currency: "BRL"
            },
            externalCode: "WATER-MIN-001"
          }
        ],
        total: {
          items: {
            value: 92.00,
            currency: "BRL"
          },
          otherFees: {
            value: 8.00,
            currency: "BRL"
          },
          discount: {
            value: 10.00,
            currency: "BRL"
          },
          orderAmount: {
            value: 90.00,
            currency: "BRL"
          }
        },
        payments: {
          prepaid: 0.00,
          pending: 90.00,
          methods: [
            {
              value: 90.00,
              currency: "BRL",
              type: "PENDING",
              method: "CREDIT",
              methodInfo: "Cartão de Crédito Visa"
            }
          ]
        },
        delivery: {
          address: {
            street: "Rua Augusta, 2000",
            city: "São Paulo",
            state: "SP",
            zipCode: "01305-100",
            complement: "Apto 501"
          },
          estimatedDeliveryTime: "2024-01-20T15:00:00Z",
          coordinates: {
            lat: -23.5489,
            lng: -46.6388
          }
        },
        metadata: {
          source: "mobile_app",
          version: "1.5.0",
          platform: "android"
        }
      }
    }
  }
};

interface TestPayloadsProps {
  onSelectPayload: (payload: any) => void;
}

const TestPayloads: React.FC<TestPayloadsProps> = ({ onSelectPayload }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        sx={{ textTransform: 'none' }}
      >
        Load Test Payload
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
        <MenuItem disabled>
          <Typography variant="subtitle2" color="text.secondary">
            v1.0.0 Compatible
          </Typography>
        </MenuItem>
        {Object.entries(TEST_PAYLOADS.v1_0_compatible).map(([key, item]) => (
          <MenuItem
            key={key}
            onClick={() => handlePayloadSelect(item.payload)}
            sx={{ pl: 3 }}
          >
            {item.label}
          </MenuItem>
        ))}
        
        <MenuItem disabled>
          <Typography variant="subtitle2" color="text.secondary">
            v1.2.0+ Compatible
          </Typography>
        </MenuItem>
        {Object.entries(TEST_PAYLOADS.v1_2_compatible).map(([key, item]) => (
          <MenuItem
            key={key}
            onClick={() => handlePayloadSelect(item.payload)}
            sx={{ pl: 3 }}
          >
            {item.label}
          </MenuItem>
        ))}
        
        <MenuItem disabled>
          <Typography variant="subtitle2" color="text.secondary">
            v1.5.0+ Compatible
          </Typography>
        </MenuItem>
        {Object.entries(TEST_PAYLOADS.v1_5_compatible).map(([key, item]) => (
          <MenuItem
            key={key}
            onClick={() => handlePayloadSelect(item.payload)}
            sx={{ pl: 3 }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default TestPayloads;
