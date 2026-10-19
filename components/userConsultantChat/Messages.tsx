"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import MessageBubble from "./ChatBubble";

interface Props {
  consultationId: Id<"consultations">;
}

export default function Messages({
  consultationId,
}: Props) {
  const messages = useQuery(
    api.consultationMessages.getMessages,
    {
      consultationId,
    }
  );

  if (messages === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          sender={message.sender}
          viewer="user"
          text={message.content}
          time={new Date(
            message.createdAt
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
      ))}
    </div>
  );
}