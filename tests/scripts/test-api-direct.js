#!/usr/bin/env node

/**
 * Direct API testing script
 * Tests the search API endpoints directly
 */

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Search API Endpoints Directly...\n');

  try {
    // Test 1: Get all chats
    console.log('1️⃣ Testing GET /api/chats...');
    const chatsResponse = await fetch(`${BASE_URL}/api/chats?limit=5`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test-Script'
      }
    });
    
    console.log(`Status: ${chatsResponse.status}`);
    console.log(`Headers:`, Object.fromEntries(chatsResponse.headers.entries()));
    
    if (chatsResponse.status === 200) {
      const chatsData = await chatsResponse.json();
      console.log(`✅ Found ${chatsData.chats?.length || 0} chats`);
      console.log(`Response:`, JSON.stringify(chatsData, null, 2));
    } else {
      const errorText = await chatsResponse.text();
      console.log(`❌ Error: ${errorText}`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Search chats
    console.log('2️⃣ Testing GET /api/search...');
    const searchResponse = await fetch(`${BASE_URL}/api/search?q=greeting&limit=5`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test-Script'
      }
    });
    
    console.log(`Status: ${searchResponse.status}`);
    
    if (searchResponse.status === 200) {
      const searchData = await searchResponse.json();
      console.log(`✅ Found ${searchData.chats?.length || 0} search results`);
      console.log(`Response:`, JSON.stringify(searchData, null, 2));
    } else {
      const errorText = await searchResponse.text();
      console.log(`❌ Error: ${errorText}`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Search with minimum character validation
    console.log('3️⃣ Testing search with short query (should fail)...');
    const shortSearchResponse = await fetch(`${BASE_URL}/api/search?q=a&limit=5`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test-Script'
      }
    });
    
    console.log(`Status: ${shortSearchResponse.status}`);
    
    if (shortSearchResponse.status === 400) {
      const errorData = await shortSearchResponse.json();
      console.log(`✅ Correctly rejected short query: ${errorData.error}`);
    } else {
      const errorText = await shortSearchResponse.text();
      console.log(`❌ Should have rejected short query: ${errorText}`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 4: Test specific chat by ID
    console.log('4️⃣ Testing GET /api/chats/[id]...');
    const chatId = '8965adf6-830a-4365-a2fe-045b8e909b35'; // From our database query
    const chatResponse = await fetch(`${BASE_URL}/api/chats/${chatId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test-Script'
      }
    });
    
    console.log(`Status: ${chatResponse.status}`);
    
    if (chatResponse.status === 200) {
      const chatData = await chatResponse.json();
      console.log(`✅ Found chat: ${chatData.chat?.title}`);
      console.log(`Response:`, JSON.stringify(chatData, null, 2));
    } else {
      const errorText = await chatResponse.text();
      console.log(`❌ Error: ${errorText}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testAPI();
