"use client"

import { useState } from "react";
import Link from "next/link";
import { BookmarkIcon } from "@/components/ui/icons";

const SparkleIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
    {/* Large Sparkle */}
    <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5Z" />
    {/* Small Sparkle */}
    <path d="M19 12L20.2 14.7L23 15.9L20.2 17.1L19 19.8L17.8 17.1L15 15.9L17.8 14.7Z" />
  </svg>
);
 
const mySavedBlogs = [
  {
    id: 1,
    title: "Understanding Turmeric: Science-Backed Benefits and Safe Usage",
    tag: "Education",
    thumbnail: ""
  },
  {
    id: 2,
    title: "Understanding Tusil: Science-Backed Benefits and Safe Usage",
    tag: "Research",
    thumbnail: ""
  }
]

const myChatHistory = [
  {
    id: 1,
    title: "Causes of Seasonal Fatigues",
    date: "Today"
  },
  {
    id: 2,
    title: "Herbal remedies of Diarrhea",
    date: "April 23"
  }
]
interface ActivityCardProps {
  darkMode: boolean;
}

export default function ActivityHistoryCard({ darkMode }: ActivityCardProps) {
  const [savedBlogs] = useState(mySavedBlogs);
  const [chatHistory] = useState(myChatHistory);

  return (
    <section className="space-y-8">
      <h3 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
        Activity History
      </h3>

      {/*My Saved Blog Section*/}
      <div className="space-y-3">
        <div className="flex items-start justify-between px-1">
          <span className={`text-xs font-extrabold uppercase tracking-wider ${darkMode ? 'text-white' : 'text-[#222224]'}`}>
            My Saved Blog Post
          </span>
          <Link href="/dashboard/history"
            className={`text-sm font-bold text-[#222224] ${darkMode ? 'text-white' : 'text-[#222224]'} hover:underline`}
          >
            View All
          </Link>
        </div>

        <div className={`
          border overflow-hidden transition-all duration-300 divide-y 
          ${darkMode
            ? 'bg-[#222224] border-transparent divide-gray-200'
            : 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] divide-gray-200'
           }
        `}>
          {savedBlogs.map((blog) => (
            <div
              key={blog.id}
              className={`p-4 flex items-center justify-between gap-4 transition-colors duration-150 ${darkMode ? 'hover:bg-[#2b2b2b]' : 'hover:bg-gray-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-lg shadow-inner shrink-0 border border-red-950 select-none">
                  <span>{blog.thumbnail}</span>
                </div>
                
                {/* Title & Tag */}
                <div className="space-y-0.5">
                  <h4 className={`text-sm font-bold leading-snug line-clamp-1 md:line-clamp-none ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    {blog.title}
                  </h4>
                  <span className={`block text-[11px] font-semibold ${darkMode ? 'text-neutral-400' : 'text-gray-400'}`}>
                    {blog.tag}
                  </span>
                </div>
              </div>
              <button className="hover:scale-110 active:scale-95 transition p-1.5 rounded-lg shrink-0"
                aria-label="Remove bookmark"
              >
                <BookmarkIcon />
              </button>
            </div>

          ))}
          </div>
      </div>

      {/*Chat History Section*/}
      <div className="space-y-5 pt-7">
        <div className="flex items-start justify-between px-1">
          <span className={`text-xs font-extrabold uppercase tracking-wider ${darkMode ? 'text-white' : 'text-[#222224]'}`}>
            AI Diagnostic Chat History
          </span>
          <Link href="/dashboard/history"
            className={`text-sm font-bold text-[#222224] ${darkMode ? 'text-white' : 'text-[#222224]'} hover:underline`}
          >
            View All
          </Link>
        </div>

        <div className={`
          border overflow-hidden transition-all duration-300 divide-y
          ${darkMode
            ? 'bg-[#222224] border-transparent'
            : 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
           }
        `}>
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 flex items-center justify-between gap-4 ${darkMode ? 'hover:bg-[#2b2b2b]' : 'hover:bg-gray-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <SparkleIcon />
                </div>
                
                {/* Title */}
                <h4 className={`text-sm font-bold leading-snug line-clamp-1 md:line-clamp-none ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                  {chat.title}
                </h4>
              </div>

              {/* Date */}
              <span className={`text-xs font-bold uppercase shrink-0 ${darkMode ? 'text-neutral-400' : 'text-gray-400'}`}>
                {chat.date}
              </span>
            </div>
          ))}
          </div>
      </div>

    </section>
  );
}
