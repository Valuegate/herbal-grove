"use client";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { useUIStateContext } from "@/components/UIStateContext";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt?: number;
  source?: "rag" | "llm";
  references?: {
    text: string;
    similarity: number;
    documentId: string;
    page?: number;
  }[]
}

interface Props {
  messages: Message[];
  isSending: boolean;
}

export default function ChatMessages({ messages, isSending }: Props) {
  const { darkMode } = useUIStateContext();

  return (
    <div className={`flex-1 overflow-y-auto p-6 space-y-8 ${darkMode ? "bg-[#1c1c1c]" : "bg-white"}`}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          role={message.role}
          content={message.content}
          createdAt={message.createdAt}
          source={message.source}
          references={message.references}
        />
      ))}

      {isSending && <TypingIndicator />}
    </div>
  );
}