"use client"

import { useRouter } from "next/navigation";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";

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

export default function Chatbox () {
  const router = useRouter();
  const { darkMode } = useDashboardContext();

  const handleBack = () => {
    router.push('/dashboard');
  };

  return (
    <main className={`min-h-screen px-4 py-4 sm:px-6 sm:py-6 ${darkMode ? 'bg-[#0f0f0f] text-[#e0e0e0]' : 'bg-[#f5f7f6]'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
        <button onClick={handleBack} 
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${darkMode ? 'bg-[#222224] text-white border border-neutral-700 hover:border-neutral-700/50' : 'bg-emerald-50 text-[#222224] border border-emerald-100 hover:border-emerald-100'}`}>
          <ArrowUpLeftIcon className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>
      
      <section className={`mx-auto flex h-[calc(100vh-2rem)] min-h-112 w-full max-w-6xl flex-col overflow-hidden rounded-3xl shadow-lg ${darkMode ? 'border-neutral-700 bg-[#1c1c1c]' : 'border-slate-200 bg-white'}`}>
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
            <button type="button" className="text-xl" aria-label="Maximize chat">
              <ExpandIcon />
            </button>
            <button type="button" className="text-xl" aria-label="Close chat">
              <XIcon />
            </button>
          </div>
        </header>

        <div className={`flex-1 ${darkMode ? 'bg-[#171717]' : 'bg-white'}`} />
        <footer className={`border-t px-4 py-4 sm:px-5 sm:py-5 ${darkMode ? 'border-neutral-800 bg-[#161616]' : 'border-slate-100 bg-white'}`}>
          <form
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className={`flex h-11 flex-1 min-w-0 items-center rounded-xl px-4 sm:px-5 ${darkMode ? 'bg-[#222224]' : 'bg-[#eef4ff]'}`}>
              <input
                className={`h-full w-full min-w-0 flex-1 bg-transparent text-sm outline-none ${darkMode ? 'text-neutral-100 placeholder:text-green-300/80' : 'text-slate-800 placeholder:text-green-600/80'}`}
                placeholder="Enter message..."
                type="text"
              />

              <button
                type="button"
                className="shrink-0 grid h-8 w-8 place-items-center rounded-full text-green-600"
                aria-label="Attach image"
              >
                <CameraIcon />
              </button>

              <button
                type="submit"
                className="shrink-0 grid h-8 w-8 place-items-center rounded-full bg-green-800 text-white"
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </footer>
      </section>
    </main>
  )
}