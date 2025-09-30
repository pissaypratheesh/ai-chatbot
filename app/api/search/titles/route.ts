import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import { chat, message } from "@/lib/db/schema";
import { desc, ilike, sql } from "drizzle-orm";

/**
 * Title-only search API endpoint
 * GET /api/search/titles?q={query}&limit={limit}&offset={offset}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters long" },
        { status: 400 }
      );
    }

    // Clean and prepare search query
    const searchQuery = query.trim().toLowerCase();
    
    // Search only in chat titles
    const searchResults = await db
      .select({
        id: chat.id,
        title: chat.title,
        createdAt: chat.createdAt,
        visibility: chat.visibility,
        userId: chat.userId,
        // Get message count for each chat
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
        // Calculate title relevance score
        relevanceScore: sql<number>`
          CASE 
            WHEN LOWER(${chat.title}) LIKE ${`%${searchQuery}%`} THEN 3
            WHEN LOWER(${chat.title}) LIKE ${`${searchQuery}%`} THEN 2
            ELSE 1
          END
        `.as('relevance_score'),
      })
      .from(chat)
      .where(
        // Search only in chat titles
        ilike(chat.title, `%${searchQuery}%`)
      )
      .orderBy(desc(sql`relevance_score`), desc(chat.createdAt))
      .limit(limit)
      .offset(offset);

    // Transform results to match frontend interface
    const transformedResults = searchResults.map(result => ({
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
    }));

    return NextResponse.json({
      chats: transformedResults,
      total: transformedResults.length,
      query: searchQuery,
      limit,
      offset,
      searchType: "title-only",
    });

  } catch (error) {
    console.error("Title search API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
