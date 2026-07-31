"use client";

import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  sender: "user" | "consultant";
  viewer: "user" | "consultant";
  text: string;
  time: string;
}

export default function MessageBubble({
  sender,
  text,
  time,
  viewer
}: Props) {
  const { darkMode } = useUIStateContext();

  console.log({
  sender,
  viewer,
  equal: sender === viewer,
});
  const isMine = sender === viewer;

  return (
    <div
      className={`flex w-full ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 ${
          isMine
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
            isMine
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