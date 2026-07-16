"use client"

import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useSearchParams, useRouter } from "next/navigation";
import { useUIStateContext } from "@/components/UIStateContext";
import { useState, useEffect } from "react";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer"

import { SendIcon } from "lucide-react";
import { CameraIcon } from "lucide-react";
import { ExpandIcon } from "lucide-react";
import { XIcon } from "@/components/ui/icons";
import { ArrowUpLeftIcon } from "lucide-react";

const SparkleIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
    {/* Large Sparkle */}
    <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5Z" />
    {/* Small Sparkle */}
    <path d="M19 12L20.2 14.7L23 15.9L20.2 17.1L19 19.8L17.8 17.1L15 15.9L17.8 14.7Z" />
  </svg>
);

type Message = {
  id: number;
  role: "user" | "assistant";
  type: "text";
  content: string;
};

export default function Chatbox () {
  const router = useRouter();
  const { darkMode } = useUIStateContext();
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get("conversationId");

  const existingMessages = useQuery(api.messages.getMessages, selectedConversationId ? { conversations: selectedConversationId as any} : "skip");

  useEffect(() => {
  if (!existingMessages) return;

  const formattedMessages = existingMessages.map((msg) => ({
    id: Number(msg._creationTime),
    role: msg.role,
    type: "text" as const,
    content: msg.content,
  }));

  setMessages(formattedMessages);
}, [existingMessages]);



  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      type: "text",
      content: "Tell me what's on your mind or snap a herb!",
    },
  ]);

  const [conversationId, setConversationId] = useState<any>(null)

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const createConversation = useMutation(
    api.conversations.createConversation
  )

  const updateConversation = useMutation(
    api.conversations.updateConversation
  )
  const sendMessageAction = useAction(
    api.ai_model.sendMessage
  );

  const saveMessages = useMutation(
    api.messages.saveMessages
  )

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleSend = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messageText = input.trim();
    if (!messageText || isSending) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      type: "text",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    let currentConversationId = selectedConversationId ?? conversationId;
    if (!currentConversationId) {
      currentConversationId = await createConversation({
        title: messageText.slice(0, 50)
      })

      setConversationId(currentConversationId)
    }

    
    try {
      await saveMessages({
        conversationId: currentConversationId,
        role: "user",
        content: messageText
      })

      await updateConversation({
        conversationId: currentConversationId
      })
      
      console.log("Updating conversation", currentConversationId);

      const aiResponse = await sendMessageAction({ message: messageText });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          type: "text",
          content: aiResponse ?? "Sorry, I didn't get a response.",
        },
      ]);

      await saveMessages({
      conversationId: currentConversationId,
      role: "assistant",
      content: aiResponse ?? "Sorry, I didn't get a respomse"
    })

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          type: "text",
          content: "Something went wrong while sending your message. Please try again.",
        },
      ]);
      console.error("AI send error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className={`px-4 py-4 sm:px-6 sm:py-6 ${darkMode ? 'bg-[#0f0f0f] text-[#e0e0e0]' : 'bg-[#f5f7f6]'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
        <button onClick={handleBack} 
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${darkMode ? 'bg-[#222224] text-white border border-neutral-700 hover:border-neutral-700/50' : 'bg-emerald-50 text-[#222224] border border-emerald-100 hover:border-emerald-100'}`}>
          <ArrowUpLeftIcon className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => router.push("/dashboard/history?tab=chats")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            darkMode
              ? "bg-[#222224] text-white border border-neutral-700 hover:border-neutral-700/50"
              : "bg-emerald-50 text-[#222224] border border-emerald-100 hover:border-emerald-100"
          }`}
        >
          Chat History
        </button>
      </div>
      
      <section className={`mx-auto flex min-h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl shadow-lg relative ${darkMode ? 'border-neutral-700 bg-[#1c1c1c]' : 'border-slate-200 bg-white'}`}>
        {/* Header */}
        <header className={`flex h-20 items-center justify-between gap-3 border-b px-4 sm:px-6 ${darkMode ? 'border-neutral-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-4">
            <div className={`grid h-8 w-8 place-items-center rounded-full ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-50 text-green-500'}`}>
              <SparkleIcon />
            </div>

            <div>
              <h1 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-950'}`}>Herbal Mind AI</h1>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className={`text-[10px] font-bold uppercase ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                  Online
                </span>
              </div>
            </div>

          </div>

          <div className={`flex items-center gap-6 ${darkMode ? 'text-green-300' : 'text-green-500'}`}>
            <button type="button" className="text-xl hover:opacity-70" aria-label="Maximize chat">
              <ExpandIcon />
            </button>
            <button type="button" className="text-xl hover:opacity-70" aria-label="Close chat">
              <XIcon />
            </button>
          </div>
        </header>

        {/* Chat Messages Area */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 ${darkMode ? 'bg-[#171717]' : 'bg-white'}`}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] lg:max-w-4xl px-4 py-2 rounded-2xl ${
                  msg.role === "user"
                    ? darkMode
                      ? "bg-green-700 text-white"
                      : "bg-green-600 text-white"
                    : darkMode
                    ? "bg-[#222224] text-gray-200"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <MarkdownRenderer content={msg.content} />
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${darkMode ? 'bg-[#222224] text-gray-200' : 'bg-gray-200 text-gray-900'}`}>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">Herbal Mind AI is typing</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <footer className={`border-t px-4 py-4 sm:px-5 sm:py-5 ${darkMode ? 'border-neutral-800 bg-[#161616]' : 'border-slate-100 bg-white'}`}>
          <form
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
            onSubmit={handleSend}
          >
            <div className={`flex h-11 flex-1 min-w-0 items-center rounded-xl px-4 sm:px-5 ${darkMode ? 'bg-[#222224]' : 'bg-[#eef4ff]'}`}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className={`h-full w-full min-w-0 flex-1 bg-transparent text-sm outline-none ${darkMode ? 'text-neutral-100 placeholder:text-green-300/80' : 'text-slate-800 placeholder:text-green-600/80'}`}
                placeholder="Enter message..."
                type="text"
                disabled={isSending}
              />

              <button
                type="button"
                className="shrink-0 grid h-8 w-8 place-items-center rounded-full text-green-600 hover:opacity-80"
                aria-label="Attach image"
                disabled
              >
                <CameraIcon />
              </button>

              <button
                type="submit"
                className="shrink-0 grid h-8 w-8 place-items-center rounded-full bg-green-800 text-white hover:bg-green-700 disabled:opacity-50"
                aria-label="Send message"
                disabled={!input.trim() || isSending}
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </footer>
      </section>
    </main>
  );
}