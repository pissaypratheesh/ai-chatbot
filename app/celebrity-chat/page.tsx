import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CelebrityChat } from "@/components/celebrity-chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { auth } from "@/app/(auth)/auth";
import { DEFAULT_CELEBRITY_PERSONA } from "@/lib/celebrity-personas";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");
  const celebrityPersonaFromCookie = cookieStore.get("celebrity-persona");

  const selectedPersona = celebrityPersonaFromCookie?.value || DEFAULT_CELEBRITY_PERSONA.id;

  if (!modelIdFromCookie) {
    return (
      <>
        <CelebrityChat
          autoResume={false}
          id={id}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialMessages={[]}
          initialVisibilityType="private"
          isReadonly={false}
          initialCelebrityPersona={selectedPersona}
          key={id}
        />
        <DataStreamHandler />
      </>
    );
  }

  return (
    <>
      <CelebrityChat
        autoResume={false}
        id={id}
        initialChatModel={modelIdFromCookie.value}
        initialMessages={[]}
        initialVisibilityType="private"
        isReadonly={false}
        initialCelebrityPersona={selectedPersona}
        key={id}
      />
      <DataStreamHandler />
    </>
  );
}
