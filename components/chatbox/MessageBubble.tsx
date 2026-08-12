"use client";

import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  createdAt?: number;
  source?: "rag" | "llm";

  references?: {
    text: string;
    similarity: number;
    documentId: string;
    page?: number;
  }[];
}

export default function MessageBubble({
  role,
  content,
  createdAt,
  source,
  references
  
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-[70%]">
        <div
          className={`rounded-2xl px-5 py-4 text-sm leading-7 shadow-sm ${
            isUser
              ? "bg-green-100 text-neutral-900 rounded-br-md"
              : "bg-[#EEF3FF] text-neutral-900 rounded-bl-md"
          }`}
        >
          <MarkdownRenderer content={content} />
          {!isUser && source === "rag" && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Verified Research
            </div>
          )}

          {!isUser && source === "llm" && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
              This response is based on general AI knowledge because no verified research was found.
            </div>
          )}
        </div>

        {createdAt && (
          <p
            className={`mt-2 text-[11px] text-green-600 ${
              isUser ? "text-right" : ""
            }`}
          >
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}