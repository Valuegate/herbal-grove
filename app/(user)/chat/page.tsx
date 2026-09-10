import { Suspense } from "react";
import Chatbox from "@/components/chatbox/ChatBox";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading chat...</div>}>
      <Chatbox />
    </Suspense>
  );
}