import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import { chat, message } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Get chat by ID API endpoint
 * GET /api/chats/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params;

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    // Get chat with message count and last message
    const chatResult = await db
      .select({
        id: chat.id,
        title: chat.title,
        createdAt: chat.createdAt,
        visibility: chat.visibility,
        userId: chat.userId,
        // Get message count for this chat
        messageCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${message} 
          WHERE ${message.chatId} = ${chat.id}
        )`,
        // Get last message content
        lastMessage: sql<string>`(
          SELECT ${message.parts}::text 
          FROM ${message} 
          WHERE ${message.chatId} = ${chat.id} 
          ORDER BY ${message.createdAt} DESC 
          LIMIT 1
        )`,
        // Get last message timestamp
        lastMessageAt: sql<Date>`(
          SELECT ${message.createdAt} 
          FROM ${message} 
          WHERE ${message.chatId} = ${chat.id} 
          ORDER BY ${message.createdAt} DESC 
          LIMIT 1
        )`,
      })
      .from(chat)
      .where(eq(chat.id, chatId))
      .limit(1);

    if (chatResult.length === 0) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    const result = chatResult[0];

    // Transform result to match frontend interface
    const transformedResult = {
      id: result.id,
      title: result.title,
      createdAt: result.createdAt,
      visibility: result.visibility,
      messageCount: result.messageCount || 0,
      lastMessage: result.lastMessage ? 
        JSON.parse(result.lastMessage).find((part: any) => part.type === "text")?.text || 
        "No messages" : 
        "No messages",
      lastMessageAt: result.lastMessageAt,
    };

    return NextResponse.json({
      chat: transformedResult,
    });

  } catch (error) {
    console.error("Get chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
