import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import { chat, message } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";

/**
 * Get all chats API endpoint
 * GET /api/chats?limit={limit}&offset={offset}&userId={userId}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const userId = searchParams.get("userId");

    // Build query with conditional where clause
    const results = await db
      .select({
        id: chat.id,
        title: chat.title,
        createdAt: chat.createdAt,
        visibility: chat.visibility,
        userId: chat.userId,
      })
      .from(chat)
      .where(userId ? eq(chat.userId, userId) : undefined)
      .orderBy(desc(chat.createdAt))
      .limit(limit)
      .offset(offset);

    // Get message counts and last messages separately for each chat
    const chatsWithMessages = await Promise.all(
      results.map(async (chatResult) => {
        // Get message count
        const messageCountResult = await db.execute(sql`
          SELECT COUNT(*)::int as count
          FROM "Message_v2" 
          WHERE "Message_v2"."chatId" = ${chatResult.id}
        `);
        
        // Get last message
        const lastMessageResult = await db.execute(sql`
          SELECT "Message_v2"."parts"::text as parts, "Message_v2"."createdAt" as createdAt
          FROM "Message_v2" 
          WHERE "Message_v2"."chatId" = ${chatResult.id} 
          ORDER BY "Message_v2"."createdAt" DESC 
          LIMIT 1
        `);
        
        const messageCount = messageCountResult[0]?.count || 0;
        const lastMessageData = lastMessageResult[0];
        
        let lastMessageText = "No messages";
        if (lastMessageData?.parts) {
          try {
            const parsedMessage = JSON.parse(lastMessageData.parts);
            const textPart = parsedMessage.find((part: any) => part.type === "text");
            lastMessageText = textPart?.text || "No messages";
          } catch (error) {
            console.error("Error parsing last message:", error, "Raw message:", lastMessageData.parts);
            lastMessageText = "No messages";
          }
        }
        
        return {
          id: chatResult.id,
          title: chatResult.title,
          createdAt: chatResult.createdAt,
          visibility: chatResult.visibility,
          messageCount,
          lastMessage: lastMessageText,
          lastMessageAt: lastMessageData?.createdAt || null,
        };
      })
    );

    return NextResponse.json({
      chats: chatsWithMessages,
      total: chatsWithMessages.length,
      limit,
      offset,
    });

  } catch (error) {
    console.error("Get chats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
