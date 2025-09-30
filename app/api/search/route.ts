import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import { chat, message } from "@/lib/db/schema";
import { desc, ilike, or, sql } from "drizzle-orm";

/**
 * Simple search chats API endpoint
 * GET /api/search?q={query}&limit={limit}&offset={offset}
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
    
    // Simple search without materialized view
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
        // Calculate search relevance score
        relevanceScore: sql<number>`
          CASE 
            WHEN LOWER(${chat.title}) LIKE ${`%${searchQuery}%`} THEN 3
            WHEN LOWER(${chat.title}) LIKE ${`${searchQuery}%`} THEN 2
            ELSE 1
          END +
          CASE 
            WHEN EXISTS(
              SELECT 1 FROM ${message} 
              WHERE ${message.chatId} = ${chat.id} 
              AND LOWER(${message.parts}::text) LIKE ${`%${searchQuery}%`}
            ) THEN 2
            ELSE 0
          END
        `.as('relevance_score'),
      })
      .from(chat)
      .where(
        or(
          // Search in chat titles
          ilike(chat.title, `%${searchQuery}%`),
          // Search in message content
          sql`EXISTS(
            SELECT 1 FROM ${message} 
            WHERE ${message.chatId} = ${chat.id} 
            AND LOWER(${message.parts}::text) LIKE ${`%${searchQuery}%`}
          )`
        )
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
    });

  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}