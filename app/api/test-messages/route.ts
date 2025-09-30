import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import { chat, message } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/**
 * Test endpoint to debug the message counting issue
 * GET /api/test-messages
 */
export async function GET(request: NextRequest) {
  try {
    // Test 1: Count messages for a specific chat
    const testChatId = "8965adf6-830a-4365-a2fe-045b8e909b35";
    
    const messageCountResult = await db.execute(sql`
      SELECT COUNT(*)::int as count
      FROM "Message_v2" 
      WHERE "Message_v2"."chatId" = ${testChatId}
    `);
    
    const lastMessageResult = await db.execute(sql`
      SELECT "Message_v2"."parts"::text as parts
      FROM "Message_v2" 
      WHERE "Message_v2"."chatId" = ${testChatId} 
      ORDER BY "Message_v2"."createdAt" DESC 
      LIMIT 1
    `);
    
    // Test 2: Get all messages for this chat
    const allMessages = await db.execute(sql`
      SELECT "Message_v2"."id", "Message_v2"."role", "Message_v2"."parts"::text as parts
      FROM "Message_v2" 
      WHERE "Message_v2"."chatId" = ${testChatId}
      ORDER BY "Message_v2"."createdAt" DESC
    `);
    
    return NextResponse.json({
      testChatId,
      messageCount: messageCountResult[0]?.count || 0,
      lastMessage: lastMessageResult[0]?.parts || null,
      allMessages: allMessages.map(msg => ({
        id: msg.id,
        role: msg.role,
        parts: msg.parts
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Test messages API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
