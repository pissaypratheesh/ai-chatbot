import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/app/(auth)/auth";
import { CelebrityChat } from "@/components/celebrity-chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages } from "@/lib/utils";
import { DEFAULT_CELEBRITY_PERSONA } from "@/lib/celebrity-personas";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  if (chat.visibility === "private") {
    if (!session.user) {
      return notFound();
    }

    // For development, allow access to all chats regardless of ownership
    // TODO: Remove this in production
    if (session.user.id !== chat.userId) {
      console.log(`Development mode: Allowing access to celebrity chat ${id} owned by ${chat.userId} for user ${session.user.id}`);
      // return notFound(); // Commented out for development
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const uiMessages = convertToUIMessages(messagesFromDb);

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get("chat-model");
  const celebrityPersonaFromCookie = cookieStore.get("celebrity-persona");

  const selectedPersona = celebrityPersonaFromCookie?.value || DEFAULT_CELEBRITY_PERSONA.id;

  if (!chatModelFromCookie) {
    return (
      <>
        <CelebrityChat
          autoResume={true}
          id={chat.id}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialLastContext={chat.lastContext ?? undefined}
          initialMessages={uiMessages}
          initialVisibilityType={chat.visibility}
          isReadonly={session?.user?.id !== chat.userId}
          initialCelebrityPersona={selectedPersona}
        />
        <DataStreamHandler />
      </>
    );
  }

  return (
    <>
      <CelebrityChat
        autoResume={true}
        id={chat.id}
        initialChatModel={chatModelFromCookie.value}
        initialLastContext={chat.lastContext ?? undefined}
        initialMessages={uiMessages}
        initialVisibilityType={chat.visibility}
        isReadonly={session?.user?.id !== chat.userId}
        initialCelebrityPersona={selectedPersona}
      />
      <DataStreamHandler />
    </>
  );
}
