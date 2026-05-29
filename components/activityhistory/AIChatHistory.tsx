const SparkleIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
    {/* Large Sparkle */}
    <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5Z" />
    {/* Small Sparkle */}
    <path d="M19 12L20.2 14.7L23 15.9L20.2 17.1L19 19.8L17.8 17.1L15 15.9L17.8 14.7Z" />
  </svg>
);

interface AIChatHistoryProps {
  darkMode: boolean;
  searchQuery: string;
}

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
  },
  {
    id: 3,
    title: "Benefits of Ginger for Digestion",
    date: "April 21"
  },
  {
    id: 4,
    title: "Natural Sleep Aids: Chamomile and Lavender",
    date: "April 18"
  },
  {
    id: 5,
    title: "Immune Boosting Herbs for Winter",
    date: "April 15"
  },
]

export default function AIChatHistory ({ darkMode, searchQuery }: AIChatHistoryProps) {
  //Search Functionality
  const filterBlogs = myChatHistory.filter(blog => 
    blog.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  if (filterBlogs.length === 0) {
    return (
      <div className={`
        flex flex-col items-center justify-center text-center py-12 px-6
        ${darkMode ? 'bg-[#222224] border-neutral-800/80'
          : 'bg-white border-gray-200/80'
        }  
      `}>
        <div className="space-y-1 max-w-xs">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#222224]'}`}>
            No Matching Chats
          </h3>
          <p className={`text-sm ${darkMode ? 'text-white' : 'text-[#222224]'}`}>
            We could not a matching chat for "{searchQuery}". Try something else.
          </p>
        </div>
      </div>
    )
  }

  return (
      //AI chat history
      <div className="space-y-4">
        <div className='px-1 flex items-center justify-between'>
          <span className={`text-sm font-extrabold uppercase tracking-wider ${darkMode ? 'text-white' : 'text-[#222224]'}`}>
            Saved Articles ({filterBlogs.length})
          </span>
        </div>
  
        <div>
          {myChatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 flex items-center justify-between gap-4 divide-y ${darkMode ? 'hover:bg-[#2b2b2b]' : 'hover:bg-gray-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <SparkleIcon />
                </div>
                
                {/* Title */}
                <h4 className={`text-sm font-sm leading-snug line-clamp-1 md:line-clamp-none ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
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
    )
}