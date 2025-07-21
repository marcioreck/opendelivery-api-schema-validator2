// Test script to compare validation between Node.js backend and Laravel package
const axios = require('axios');

// Test payload that should be valid in both 1.2.0 and 1.5.0
const testPayload = {
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
};

async function testValidation() {
  console.log('🧪 Testing validation consistency between Node.js and Laravel\n');

  // Test versions to compare
  const versions = ['1.2.0', '1.5.0'];
  
  for (const version of versions) {
    console.log(`📋 Testing with version ${version}:`);
    
    // Test Node.js backend
    try {
      const nodeResponse = await axios.post('http://localhost:3001/opendelivery-api-schema-validator2/validate', {
        version,
        payload: testPayload
      });
      console.log(`  ✅ Node.js (${version}): Valid = ${nodeResponse.data.valid}, Errors = ${nodeResponse.data.errors?.length || 0}`);
      if (nodeResponse.data.errors && nodeResponse.data.errors.length > 0) {
        console.log(`     First error: ${nodeResponse.data.errors[0].message || nodeResponse.data.errors[0]}`);
      }
    } catch (error) {
      console.log(`  ❌ Node.js (${version}): Error = ${error.message}`);
    }
    
    // Test Laravel backend
    try {
      const laravelResponse = await axios.post('http://localhost:8010/opendelivery-api-schema-validator2/validate', {
        version,
        payload: testPayload
      }, {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });
      console.log(`  ✅ Laravel (${version}): Valid = ${laravelResponse.data.valid}, Errors = ${laravelResponse.data.errors?.length || 0}`);
      if (laravelResponse.data.errors && laravelResponse.data.errors.length > 0) {
        console.log(`     First error: ${laravelResponse.data.errors[0].message || laravelResponse.data.errors[0]}`);
      }
    } catch (error) {
      console.log(`  ❌ Laravel (${version}): Error = ${error.message}`);
    }
    
    console.log('');
  }
}

testValidation().catch(console.error);
