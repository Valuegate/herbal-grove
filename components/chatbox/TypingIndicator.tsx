"use client";

const SparkleIcon = () => (
  <svg
    className="w-4 h-4 text-green-600"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5Z" />
    <path d="M19 12L20.2 14.7L23 15.9L20.2 17.1L19 19.8L17.8 17.1L15 15.9L17.8 14.7Z" />
  </svg>
);

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-sm rounded-2xl rounded-bl-md bg-[#EEF3FF] px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <SparkleIcon />

          <span className="text-sm">
            Analyzing botanical features...
          </span>

          <div className="ml-auto flex gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-bounce" />
            <span
              className="h-2 w-2 rounded-full bg-green-500 animate-bounce"
              style={{ animationDelay: ".2s" }}
            />
            <span
              className="h-2 w-2 rounded-full bg-green-500 animate-bounce"
              style={{ animationDelay: ".4s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}