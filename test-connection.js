#!/usr/bin/env node

const axios = require('axios');

async function testConnection() {
  console.log('🔍 Testando conexões...\n');
  
  // Test 1: Backend direto
  try {
    console.log('1. Testando backend direto (localhost:3001)...');
    const response = await axios.get('http://localhost:3001/api/health', { timeout: 5000 });
    console.log('✅ Backend direto: OK');
    console.log(`   Status: ${response.status}`);
    console.log(`   Service: ${response.data.service}`);
  } catch (error) {
    console.log('❌ Backend direto: ERRO');
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code}`);
  }
  
  console.log('');
  
  // Test 2: Frontend proxy
  try {
    console.log('2. Testando proxy do frontend (localhost:8000/api)...');
    const response = await axios.get('http://localhost:8000/api/health', { timeout: 5000 });
    console.log('✅ Proxy do frontend: OK');
    console.log(`   Status: ${response.status}`);
    console.log(`   Service: ${response.data.service}`);
  } catch (error) {
    console.log('❌ Proxy do frontend: ERRO');
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code}`);
  }
  
  console.log('');
  
  // Test 3: Validação via proxy
  try {
    console.log('3. Testando validação via proxy...');
    const testPayload = {
      schema_version: '1.6.0-rc',
      payload: {
        "merchant": {
          "id": "test-merchant",
          "name": "Test Merchant"
        }
      }
    };
    
    const response = await axios.post('http://localhost:8000/api/validate', testPayload, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Validação via proxy: OK');
    console.log(`   Status: ${response.status}`);
    console.log(`   Valid: ${response.data.valid}`);
  } catch (error) {
    console.log('❌ Validação via proxy: ERRO');
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
  
  console.log('\n🏁 Teste concluído');
}

testConnection().catch(console.error);
