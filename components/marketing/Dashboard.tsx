"use client"

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar"
import HerbOfTheDay from "@/components/dashboard/herboftheday";
import ActivityHistoryCard from "@/components/dashboard/activitysection"
import { NotificationIcon } from "@/components/ui/icons"
import { ProfileIcon } from "@/components/ui/icons"
import { ModeChangeIcon } from "@/components/ui/icons"

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

// export default function Dashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [darkMode, setdarkMode] = useState(false);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
//   const closeSidebar = () => setSidebarOpen(false);
//   const toggleDarkMode = () => setdarkMode(!darkMode);

//   return (
//     <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-[#1e1e1e] text-white' : 'bg-[#fafafa] text-[#333333]'}`}>
//       {/*Sidebar*/}
//       <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} darkMode={darkMode}/>

//       {/*Main Content*/}
//       <div className="flex-1 flex flex-col h-screen overflow-y-auto">
//         <header className={`sticky top-0 z-30 shrink-0 px-6 py-4 flex items-center justify-between border-b ${darkMode
//             ? 'bg-[#1e1e1e]/80 border-neutral-800'
//             : 'bg-[#FAFAFA]/80 border-gray-100'}`}
//         >
//           <div className="flex items-center gap-4">
//             {/*Mobile Hamburger toggle*/}
//             <button 
//               onClick={toggleSidebar}
//               className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition text-gray-500" 
//               aria-label="Open Sidebar"
//             >
//               <MenuIcon />
//             </button>
//             <h1 className={`text-base font-bold tracking-wider ${darkMode ? 'text-white' : 'text-[#1a7a1e]'}`}>
//               Dashboard
//             </h1>
//           </div>
//           <div className="flex items-center gap-3">
//             <button 
//               className={`p-2.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 ${
//                 darkMode ? 'bg-[#1e1e1e] hover:bg-neutral-800 text-neutral-300' : 'bg-white hover:bg-gray-50 text-gray-600'
//               }`}
//               aria-label="Notifications"
//             >
//               <NotificationIcon />
//             </button>
            
//             <button 
//               className={`p-2.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 ${
//                 darkMode ? 'bg-[#1e1e1e] hover:bg-neutral-800 text-neutral-300' : 'bg-white hover:bg-gray-50 text-gray-600'
//               }`}
//               aria-label="Profile"
//             >
//               <ProfileIcon />
//             </button>
            
//             <button 
//               onClick={toggleDarkMode}
//               className={`p-2.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 ${
//                 darkMode ? 'bg-[#1e1e1e] hover:bg-neutral-800 text-neutral-300' : 'bg-white hover:bg-gray-50 text-gray-600'
//               }`}
//               aria-label="Toggle Dark Mode"
//             >
//               <ModeChangeIcon />
//             </button>
//           </div>
//         </header>

//         {/*Main Content*/}
//         <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto space-y-8">
//           <div className="space-y-1">
//             <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-[#031609]' }`}>
//               Welcome Back, Ayomide
//             </h2>

//             <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
//               Let's find the right balance for your wellness today
//             </p>

//             {/*Herb Of The Day*/}
//             <HerbOfTheDay darkMode={darkMode} />

//             {/*Activity History*/}
//             <ActivityHistoryCard darkMode={darkMode} />
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-300 ${darkMode ? 'bg-[#121212] text-[#e0e0e0]' : 'bg-[#FAFAFA] text-[#333333]'}`}>
      
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} darkMode={darkMode} />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header Bar */}
        <header className={`
          sticky top-0 z-30 shrink-0 px-6 py-4 flex items-center justify-between border-b backdrop-blur-md
          ${darkMode ? 'bg-[#1e1e1e]/80 border-neutral-800' : 'bg-[#FAFAFA]/80 border-gray-100'}
        `}>
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger menu toggle */}
            <button 
              onClick={toggleSidebar} 
              className={`lg:hidden p-2 rounded-lg transition text-gray-500 ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}
              aria-label="Open sidebar"
            >
              <MenuIcon />
            </button>
            <h1 className={`text-base font-bold uppercase tracking-wider ${darkMode ? 'text-white' : 'text-[#2b7a2d]'}`}>Dashboard</h1>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-3">
            <button 
              className={`p-2.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 ${
                darkMode ? 'bg-[#1e1e1e] hover:bg-neutral-800 text-neutral-300' : 'bg-white hover:bg-gray-50 text-gray-600'
              }`}
              aria-label="Notifications"
            >
              <NotificationIcon />
            </button>

            <button 
              className={`p-2.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 ${
                darkMode ? 'bg-[#1e1e1e] hover:bg-neutral-800 text-neutral-300' : 'bg-white hover:bg-gray-50 text-gray-600'
              }`}
              aria-label="Profile"
            >
              <ProfileIcon />
            </button>

            <button 
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 ${
                darkMode ? 'bg-[#1e1e1e] hover:bg-neutral-800 text-yellow-400' : 'bg-white hover:bg-gray-50 text-gray-600'
              }`}
              aria-label="Toggle dark mode"
            >
              <ModeChangeIcon />
            </button>
          </div>
        </header>

        {/* Dashboard Main Viewport */}
        <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto space-y-8">
          
          {/* Welcome Greeting */}
          <div className="space-y-1">
            <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-[#2b7a2d]'}`}>Welcome Back, Ayomide</h2>
            <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>Let's find the right balance for your wellness today</p>
          </div>

          {/* Herb Of The Day Hero Card */}
          <HerbOfTheDay darkMode={darkMode} />

          {/* Activity History Card */}
          <ActivityHistoryCard darkMode={darkMode} />
        </main>
    </div>
  </div>
  )
}
