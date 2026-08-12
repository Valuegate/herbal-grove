"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction, useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export type Message = {
  id: number;
  role: "user" | "assistant";
  type: "text";
  content: string;
  source?: "rag" | "llm";
  references?: {
    text: string;
    similarity: number;
    documentId: string;
    page?: number;
  }[];
  createdAt?: number;
};

const WELCOME_MESSAGE: Message = {
  id: 1,
  role: "assistant",
  type: "text",
  content: "Tell me what's on your mind or snap a herb!",
};

export function useChatbox() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get("conversationId");

  const existingMessages = useQuery( api.messages.getMessages, selectedConversationId
      ? {
          conversations: selectedConversationId as any,
        }
      : "skip"
  );

  const createConversation = useMutation(api.conversations.createConversation);

  const updateConversation = useMutation(api.conversations.updateConversation);

  const saveMessages = useMutation(api.messages.saveMessages);

  const sendMessageAction = useAction(api.ai_model.sendMessage);

  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);

  const [conversationId, setConversationId] =useState<any>(null);

  const [input, setInput] = useState("");

  const [isSending, setIsSending] =useState(false);

  useEffect(() => {
    if (!existingMessages) return;

    setMessages(
      existingMessages.map((msg) => ({
        id: Number(msg._creationTime),
        role: msg.role,
        type: "text",
        content: msg.content,
        createdAt: msg._creationTime,
        source: msg.source,
        references: [],
      }))
    );
  }, [existingMessages]);

  useEffect(() => {
    if (conversationId && !selectedConversationId) {
      router.replace(
        `/chat?conversationId=${conversationId}`
      );
    }
  }, [
    conversationId,
    selectedConversationId,
    router,
  ]);

  async function handleSend( event: React.FormEvent<HTMLFormElement> ) {
    event.preventDefault();

    const content = input.trim();

    if (!content || isSending) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      type: "text",
      content,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput("");
    setIsSending(true);

    try {
      let convoId = selectedConversationId ?? conversationId;

      if (!convoId) {
        convoId = await createConversation({
          title: content.slice(0, 50),
        });

        setConversationId(convoId);
      }

      await saveMessages({
        conversationId: convoId,
        role: "user",
        content,
      });

      await updateConversation({conversationId: convoId});

      const aiResponse = await sendMessageAction({message: content});

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        type: "text",
        content: aiResponse.answer ?? "Sorry, I didn't get a response.",
        source: aiResponse.source,
        references: aiResponse.references,
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);

      await saveMessages({
        conversationId: convoId,
        role: "assistant",
        content: assistantMessage.content,
        source: assistantMessage.source
      });
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          type: "text",
          content: "Sorry, something went wrong while processing your request.",
          source: "llm",
          references: [],
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleBack() {
    setMessages([WELCOME_MESSAGE]);
    setConversationId(null);
    setInput("");
    router.push("/dashboard");
  }

  return {
    messages,
    input,
    isSending,
    setInput,
    handleSend,
    handleBack,
  };
}