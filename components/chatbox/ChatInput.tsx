"use client";

import { Camera, SendHorizonal } from "lucide-react";
import type { FormEventHandler } from "react";
import { useUIStateContext } from "@/components/UIStateContext";

interface Props {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function ChatInput({ value, disabled, onChange, onSubmit }: Props) {
  const { darkMode } = useUIStateContext();

  return (
    <footer className={`border-t p-4 ${darkMode ? "border-neutral-800 bg-[#1c1c1c]" : "border-slate-100 bg-white"}`}>
      <form
        onSubmit={onSubmit}
        className={`flex items-center gap-3 rounded-full px-4 py-3 ${
          darkMode ? "bg-neutral-800" : "bg-[#EEF3FF]"
        }`}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter message..."
          className={`flex-1 bg-transparent outline-none ${
            darkMode ? "text-white placeholder:text-neutral-500" : ""
          }`}
        />

        <button type="button" className="text-green-600">
          <Camera size={18} />
        </button>

        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="grid h-10 w-10 place-items-center rounded-full bg-green-700 text-white"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </footer>
  );
}