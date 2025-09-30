import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import { chat, message } from "@/lib/db/schema";
import { desc, sql } from "drizzle-orm";

/**
 * Test endpoint to debug the drizzle query builder issue
 * GET /api/test-drizzle
 */
export async function GET(request: NextRequest) {
  try {
    const testChatId = "8965adf6-830a-4365-a2fe-045b8e909b35";
    
    // Test the exact same query as in chats API
    const results = await db
      .select({
        id: chat.id,
        title: chat.title,
        createdAt: chat.createdAt,
        visibility: chat.visibility,
        userId: chat.userId,
        // Get message count for each chat
        messageCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM "Message_v2" 
          WHERE "Message_v2"."chatId" = ${chat.id}
        )`,
        // Get last message content
        lastMessage: sql<string>`(
          SELECT "Message_v2"."parts"::text 
          FROM "Message_v2" 
          WHERE "Message_v2"."chatId" = ${chat.id} 
          ORDER BY "Message_v2"."createdAt" DESC 
          LIMIT 1
        )`,
        // Get last message timestamp
        lastMessageAt: sql<Date>`(
          SELECT "Message_v2"."createdAt" 
          FROM "Message_v2" 
          WHERE "Message_v2"."chatId" = ${chat.id} 
          ORDER BY "Message_v2"."createdAt" DESC 
          LIMIT 1
        )`,
      })
      .from(chat)
      .where(sql`${chat.id} = ${testChatId}`)
      .orderBy(desc(chat.createdAt))
      .limit(1);
    
    return NextResponse.json({
      testChatId,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Test drizzle API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
