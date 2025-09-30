#!/usr/bin/env node

/**
 * Test script for search API endpoints
 * Run with: node test-search-api.js
 */

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Search API Endpoints...\n');

  try {
    // Test 1: Get all chats
    console.log('1️⃣ Testing GET /api/chats...');
    const chatsResponse = await fetch(`${BASE_URL}/api/chats?limit=5`);
    console.log(`Status: ${chatsResponse.status}`);
    
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
    const searchResponse = await fetch(`${BASE_URL}/api/search?q=test&limit=5`);
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
    const shortSearchResponse = await fetch(`${BASE_URL}/api/search?q=a&limit=5`);
    console.log(`Status: ${shortSearchResponse.status}`);
    
    if (shortSearchResponse.status === 400) {
      const errorData = await shortSearchResponse.json();
      console.log(`✅ Correctly rejected short query: ${errorData.error}`);
    } else {
      console.log(`❌ Should have rejected short query`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAPI();
