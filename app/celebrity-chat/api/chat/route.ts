import { streamText } from "ai";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { geolocation } from "@vercel/functions";
import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
} from "ai";

import { auth, type UserType } from "@/app/(auth)/auth";
import { createStreamId } from "@/lib/db/queries";
import { getChatById, getMessageCountByUserId, getMessagesByChatId } from "@/lib/db/queries";
import { saveChat, saveMessages } from "@/lib/db/queries";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import { myProvider } from "@/lib/ai/providers";
import { generateCelebritySystemPrompt, getCelebrityPersonaById } from "@/lib/celebrity-personas";
import { ChatSDKError } from "@/lib/errors";
import type { VisibilityType } from "@/components/visibility-selector";
import type { ChatMessage } from "@/lib/types";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import { isProductionEnvironment } from "@/lib/constants";
import type { AppUsage } from "@/lib/usage";
import { type PostRequestBody, postRequestBodySchema } from "./schema";

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  try {
    const {
      id,
      message,
      selectedChatModel,
      selectedVisibilityType,
      selectedCelebrityPersona,
    }: {
      id: string;
      message: ChatMessage;
      selectedChatModel: string;
      selectedVisibilityType: VisibilityType;
      selectedCelebrityPersona: string;
    } = requestBody;

    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const userType: UserType = session.user.type;

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
      return new ChatSDKError("rate_limit:chat").toResponse();
    }

    const chat = await getChatById({ id });

    if (chat) {
      if (chat.userId !== session.user.id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }
    } else {
      const title = `Chat with ${getCelebrityPersonaById(selectedCelebrityPersona)?.name || 'Celebrity'}`;

      await saveChat({
        id,
        userId: session.user.id,
        title,
        visibility: selectedVisibilityType,
      });
    }

    const messagesFromDb = await getMessagesByChatId({ id });
    const uiMessages = [...convertToUIMessages(messagesFromDb), message];

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: "user",
          parts: message.parts,
          attachments: [],
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

    let finalMergedUsage: AppUsage | undefined;

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const celebrityPersona = getCelebrityPersonaById(selectedCelebrityPersona);
        const celebritySystemPrompt = celebrityPersona 
          ? generateCelebritySystemPrompt(celebrityPersona)
          : "You are a helpful assistant.";

        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: celebritySystemPrompt,
          messages: convertToModelMessages(uiMessages),
          stopWhen: stepCountIs(5),
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text-celebrity",
          },
        });

        result.consumeStream();

        dataStream.merge(
          result.toUIMessageStream({})
        );
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        try {
          await saveMessages({
            messages: messages.map((currentMessage) => ({
              id: currentMessage.id,
              role: currentMessage.role,
              parts: currentMessage.parts,
              attachments: [],
              createdAt: new Date(),
              chatId: id,
            })),
          });
        } catch (error) {
          console.error("Failed to save messages:", error);
        }
      },
    });

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    console.error("Celebrity chat API error:", error);
    return new ChatSDKError("offline:chat").toResponse();
  }
}
