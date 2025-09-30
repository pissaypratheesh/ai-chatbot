#!/usr/bin/env node

/**
 * Comprehensive API testing script
 * Tests all search API endpoints
 */

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing All Search API Endpoints...\n');

  const tests = [
    {
      name: '1️⃣ Get All Chats',
      url: '/api/chats?limit=5',
      expectedStatus: 200,
      description: 'Should return all chats with pagination'
    },
    {
      name: '2️⃣ Search for "greeting"',
      url: '/api/search?q=greeting&limit=5',
      expectedStatus: 200,
      description: 'Should find chats containing "greeting"'
    },
    {
      name: '3️⃣ Search for "javascript"',
      url: '/api/search?q=javascript&limit=5',
      expectedStatus: 200,
      description: 'Should find chats containing "javascript"'
    },
    {
      name: '4️⃣ Search with short query (should fail)',
      url: '/api/search?q=a&limit=5',
      expectedStatus: 400,
      description: 'Should reject queries shorter than 2 characters'
    },
    {
      name: '5️⃣ Search for non-existent term',
      url: '/api/search?q=nonexistent&limit=5',
      expectedStatus: 200,
      description: 'Should return empty results for non-existent terms'
    },
    {
      name: '6️⃣ Get specific chat by ID',
      url: '/api/chats/8965adf6-830a-4365-a2fe-045b8e909b35',
      expectedStatus: 200,
      description: 'Should return specific chat details'
    },
    {
      name: '7️⃣ Get non-existent chat (should fail)',
      url: '/api/chats/00000000-0000-0000-0000-000000000000',
      expectedStatus: 404,
      description: 'Should return 404 for non-existent chat'
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`${test.name} - ${test.description}`);
      console.log(`URL: ${BASE_URL}${test.url}`);
      
      const response = await fetch(`${BASE_URL}${test.url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'API-Test-Script'
        }
      });
      
      const status = response.status;
      const data = await response.json();
      
      if (status === test.expectedStatus) {
        console.log(`✅ PASS - Status: ${status}`);
        passedTests++;
        
        // Show relevant data for successful tests
        if (status === 200) {
          if (data.chats) {
            console.log(`   Found ${data.chats.length} chats`);
            if (data.chats.length > 0) {
              console.log(`   First chat: "${data.chats[0].title}"`);
            }
          } else if (data.chat) {
            console.log(`   Chat: "${data.chat.title}"`);
          }
        } else if (status === 400) {
          console.log(`   Error: ${data.error}`);
        } else if (status === 404) {
          console.log(`   Error: ${data.error}`);
        }
      } else {
        console.log(`❌ FAIL - Expected: ${test.expectedStatus}, Got: ${status}`);
        console.log(`   Response:`, JSON.stringify(data, null, 2));
      }
      
    } catch (error) {
      console.log(`❌ ERROR - ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }

  console.log('='.repeat(60));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! APIs are working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the output above.');
  }
}

// Run the tests
testAPI();
