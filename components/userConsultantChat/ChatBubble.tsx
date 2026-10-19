"use client";

import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  sender: "user" | "consultant";
  viewer: string,
  text: string;
  time: string;
}

export default function MessageBubble({
  sender,
  text,
  viewer,
  time,
}: Props) {
  const { darkMode } = useUIStateContext();

  console.log({
  sender,
  viewer,
  equal: sender === viewer,
});
  const isUser = sender === viewer;

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 ${
          isUser
            ? "rounded-3xl rounded-br-md bg-[#2b7a2d] text-white"
            : darkMode
            ? "rounded-3xl rounded-bl-md bg-[#222224] text-white"
            : "rounded-3xl rounded-bl-md bg-white text-black shadow-sm border border-gray-100"
        }`}
      >
        <p className="whitespace-pre-wrap wrap-break-word text-[15px] leading-6">
          {text}
        </p>

        <div
          className={`mt-2 flex justify-end text-[11px] ${
            isUser
              ? "text-green-100"
              : darkMode
              ? "text-neutral-400"
              : "text-gray-400"
          }`}
        >
          {time}
        </div>
      </div>
    </div>
  );
}