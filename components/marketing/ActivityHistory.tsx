"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import AIChatHistory from "@/components/activityhistory/AIChatHistory";
import SavedPosts from "@/components/activityhistory/savedPosts";

import { ArrowUpLeftIcon } from "lucide-react";
import { Search } from "lucide-react";

export default function ActivityHistory() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { darkMode } = useDashboardContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleBack = () => {
    router.push('/dashboard');
  };
  
  const tabs = searchParams.get("tab") ===  "chats" ? "chats" : "posts"
  const [activeTab, setActiveTab] = useState<'posts' | 'chats'>(tabs); 
  
  return (
    <div className="space-y-8">
      {/*Back & Search Bar*/}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button onClick={handleBack} 
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${darkMode ? 'bg-[#222224] text-white border border-neutral-700 hover:border-neutral-700/50' : 'bg-emerald-50 text-[#222224] border border-emerald-100 hover:border-emerald-100'}`}>
          <ArrowUpLeftIcon className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        {/*Search Bar*/}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </span>
            
            <input 
              type="text"
              placeholder='Quick Search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-full border outline-none 
                ${darkMode ? 'bg-[#222224] border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                  : 'bg-white border-gray-200 text-neutral-800 placeholder-gray-400 focus:border-[#2b7a2d] focus:ring-1 focus:ring-[#2b7a2d]'
                }`}
            />
          </div>
        </div>
      </div>

      {/*Tabs*/}
      <div className="flex items-center gap-3 border-b pb-3 border-neutral-200/40 dark:border-neutral-800/40">
        <button onClick={() => setActiveTab('posts')}
          className={`text-sm font-extrabold px-4 py-2 rounded-full ${activeTab === 'posts' ? 'bg-[#115a13] text-white' : darkMode ? 'text-neutral-400 hover:text-white' : 'text-black'}`}
        >
          Saved Posts
        </button>

        <button onClick={() => setActiveTab('chats')}
          className={`text-sm font-extrabold px-4 py-2 rounded-full ${activeTab === 'chats' ? 'bg-[#115a13] text-white' : darkMode ? 'text-neutral-400 hover:text-white' : 'text-black'}`}
        >
          AI Chat
        </button>
      </div>

      {activeTab === 'posts' ? (
        <SavedPosts darkMode={darkMode} searchQuery={searchQuery} />
      ) : (
        <AIChatHistory darkMode={darkMode} searchQuery={searchQuery} />
      )}
    </div>
  )
}