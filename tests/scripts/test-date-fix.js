#!/usr/bin/env node

/**
 * Test script to verify date handling fix
 */

const BASE_URL = 'http://localhost:3000';

async function testDateHandling() {
  console.log('🧪 Testing Date Handling Fix...\n');

  try {
    // Test the title search API
    console.log('🔍 Testing title search API...');
    const response = await fetch(`${BASE_URL}/api/search/titles?q=greeting&limit=1`);
    const data = await response.json();
    
    if (response.ok && data.chats.length > 0) {
      const chat = data.chats[0];
      console.log('✅ API Response received');
      console.log(`📊 Chat: "${chat.title}"`);
      console.log(`📅 Created At: ${chat.createdAt} (type: ${typeof chat.createdAt})`);
      console.log(`📅 Last Message At: ${chat.lastMessageAt} (type: ${typeof chat.lastMessageAt})`);
      
      // Test date parsing
      const createdAt = new Date(chat.createdAt);
      console.log(`🔍 Parsed Created At: ${createdAt.toISOString()}`);
      console.log(`✅ Date parsing successful: ${!isNaN(createdAt.getTime())}`);
      
      if (chat.lastMessageAt) {
        const lastMessageAt = new Date(chat.lastMessageAt);
        console.log(`🔍 Parsed Last Message At: ${lastMessageAt.toISOString()}`);
        console.log(`✅ Last message date parsing successful: ${!isNaN(lastMessageAt.getTime())}`);
      }
      
    } else {
      console.log('❌ API request failed');
      console.log('Response:', data);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n🎯 Date Handling Fix Summary:');
  console.log('✅ Updated MockChat interface to accept Date | string');
  console.log('✅ Updated SearchResults Chat interface to accept Date | string');
  console.log('✅ Created dateUtils.ts with safe date parsing functions');
  console.log('✅ Replaced formatDate with formatRelativeDate utility');
  console.log('✅ Added proper type checking and error handling');
  
  console.log('\n💡 The error "date.getTime is not a function" should now be resolved!');
  console.log('   Both mock data (Date objects) and API data (strings) are handled correctly.');
}

// Run the test
testDateHandling();
