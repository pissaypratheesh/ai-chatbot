import type { NextRequest } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getChatsByUserId } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
  const startingAfter = searchParams.get("starting_after");
  const endingBefore = searchParams.get("ending_before");

  if (startingAfter && endingBefore) {
    return new ChatSDKError(
      "bad_request:api",
      "Only one of starting_after or ending_before can be provided."
    ).toResponse();
  }

  const session = await auth();

  // For development, if no session, try to get chats without user filter
  if (!session?.user) {
    // Try to get all chats for development
    try {
      const { db } = await import("@/lib/db/queries");
      const { chat, message } = await import("@/lib/db/schema");
      const { desc, sql } = await import("drizzle-orm");
      
      const results = await db
        .select({
          id: chat.id,
          title: chat.title,
          createdAt: chat.createdAt,
          visibility: chat.visibility,
          userId: chat.userId,
        })
        .from(chat)
        .orderBy(desc(chat.createdAt))
        .limit(limit);

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
          if (lastMessageData?.parts && typeof lastMessageData.parts === 'string') {
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
            userId: chatResult.userId,
            messageCount,
            lastMessage: lastMessageText,
            lastMessageAt: lastMessageData?.createdAt || null,
          };
        })
      );

      return Response.json({
        chats: chatsWithMessages,
        hasMore: chatsWithMessages.length === limit,
      });
    } catch (error) {
      console.error("Error fetching chats without auth:", error);
      return new ChatSDKError("unauthorized:chat").toResponse();
    }
  }

  // For development, get all chats regardless of user ownership
  // TODO: Remove this in production
  const chats = await getChatsByUserId({
    id: session.user.id,
    limit,
    startingAfter,
    endingBefore,
  });

  // If no chats found for this user, get all chats for development
  if (chats.chats.length === 0) {
    console.log(`No chats found for user ${session.user.id}, getting all chats for development`);
    
    const { db } = await import("@/lib/db/queries");
    const { chat, message } = await import("@/lib/db/schema");
    const { desc, sql } = await import("drizzle-orm");
    
    const results = await db
      .select({
        id: chat.id,
        title: chat.title,
        createdAt: chat.createdAt,
        visibility: chat.visibility,
        userId: chat.userId,
      })
      .from(chat)
      .orderBy(desc(chat.createdAt))
      .limit(limit);

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
        if (lastMessageData?.parts && typeof lastMessageData.parts === 'string') {
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
          userId: chatResult.userId,
          messageCount,
          lastMessage: lastMessageText,
          lastMessageAt: lastMessageData?.createdAt || null,
        };
      })
    );

    return Response.json({
      chats: chatsWithMessages,
      hasMore: chatsWithMessages.length === limit,
    });
  }

  return Response.json(chats);
}
