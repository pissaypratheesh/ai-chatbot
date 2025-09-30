import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import { chat, message, user } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/**
 * Simple database viewer API endpoint
 * GET /api/db-viewer?table={tableName}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tableName = searchParams.get("table") || "overview";

    let data;
    let tableInfo;

    switch (tableName) {
      case "overview":
        // Get overview of all tables
        const chatCount = await db.select({ count: sql<number>`count(*)::int` }).from(chat);
        const messageCount = await db.select({ count: sql<number>`count(*)::int` }).from(message);
        const userCount = await db.select({ count: sql<number>`count(*)::int` }).from(user);
        
        data = {
          tables: {
            chats: chatCount[0]?.count || 0,
            messages: messageCount[0]?.count || 0,
            users: userCount[0]?.count || 0,
          }
        };
        tableInfo = "Database Overview";
        break;

      case "chats":
        data = await db.select().from(chat).limit(20);
        tableInfo = "Chats Table";
        break;

      case "messages":
        data = await db.select().from(message).limit(20);
        tableInfo = "Messages Table";
        break;

      case "users":
        data = await db.select().from(user).limit(20);
        tableInfo = "Users Table";
        break;

      default:
        return NextResponse.json(
          { error: "Invalid table name. Use: overview, chats, messages, users" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      table: tableName,
      info: tableInfo,
      data: data,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Database viewer error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
