"use client";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { useUIStateContext } from "@/components/UIStateContext";
import { Message } from "./usechatbox";

interface Props {
  messages: Message[];
  isSending: boolean;
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