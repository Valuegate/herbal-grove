"use client";

import { useRouter } from "next/navigation";
import { useUIStateContext } from "@/components/UIStateContext";

import ChatHeader from "@/components/chatbox/ChatHeader";
import ChatMessages from "@/components/chatbox/ChatMessages";
import ChatInput from "@/components/chatbox/ChatInput";
import { useChatbox } from "@/components/chatbox/usechatbox";

export default function Chatbox() {
  const router = useRouter();
  const { darkMode } = useUIStateContext();

  const { messages, input, isSending, setInput, handleSend, handleBack } = useChatbox();

  return (
    <div className={`flex h-full flex-col ${darkMode ? "bg-[#1c1c1c]" : "bg-white"}`}>
      <ChatHeader onBack={handleBack} onClose={() => router.push("/dashboard/history")} />
      <ChatMessages messages={messages} isSending={isSending} />
      <ChatInput value={input} disabled={isSending} onChange={setInput} onSubmit={handleSend} />
    </div>
  );
}