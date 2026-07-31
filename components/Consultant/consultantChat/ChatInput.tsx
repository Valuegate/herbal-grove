"use client";

import { useState } from "react";
import { Paperclip, SendHorizontal } from "lucide-react";
import { useUIStateContext } from "@/components/UIStateContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  consultationId: Id<"consultations">;
}

export default function ChatInput({
  consultationId,
}: Props) {
  const { darkMode } = useUIStateContext();

  const [message, setMessage] = useState("");

  const sendMessage = useMutation(
    api.consultationMessages.sendMessage
  );

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage({
      consultationId,
      sender: "consultant",
      content: message.trim(),
    });

    setMessage("");
  };

  return (
    <div
      className={`sticky bottom-0 border-t p-4 ${
        darkMode
          ? "bg-[#1E1E1E] border-neutral-800"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <button type="button">
          <Paperclip />
        </button>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className={`flex-1 rounded-full px-5 py-3 outline-none ${
            darkMode
              ? "bg-[#2b2b2b]"
              : "bg-gray-100"
          }`}
        />

        <button
          type="button"
          onClick={handleSend}
          className="rounded-full bg-[#2b7a2d] p-3 text-white"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}