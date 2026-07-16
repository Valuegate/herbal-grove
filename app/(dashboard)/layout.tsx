"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import { useUIStateContext } from "@/components/UIStateContext";
import {
  NotificationIcon,
  ProfileIcon,
  ModeChangeIcon,
} from "@/components/ui/icons";
import { USER_PAGE_TITLES } from "@/lib/constants";

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    darkMode,
    toggleDarkMode,
    sidebarOpen,
    openSidebar,
    closeSidebar,
  } = useUIStateContext();

  const pathname = usePathname();

  const pageTitle = USER_PAGE_TITLES[pathname] ?? "Dashboard";

  const toggleSidebar = () => {
    sidebarOpen ? closeSidebar() : openSidebar();
  };


  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-300 ${darkMode ? 'bg-[#121212] text-[#e0e0e0]' : 'bg-[#FAFAFA] text-[#333333]'}`}>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} darkMode={darkMode} />

        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <header className={`
            sticky top-0 z-30 shrink-0 px-6 py-4 flex items-center justify-between border-b backdrop-blur-md
            ${darkMode ? 'bg-[#1e1e1e]/80 border-neutral-800' : 'bg-[#FAFAFA]/80 border-gray-100'}
          `}>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className={`lg:hidden p-2 rounded-lg transition text-gray-500 ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}
                aria-label="Open sidebar"
              >
                <MenuIcon />
              </button>
              <h1 className={`text-base font-bold uppercase tracking-wider ${darkMode ? 'text-white' : 'text-[#2b7a2d]'}`}>{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                className={`p-2.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 ${darkMode ? 'bg-[#1e1e1e] hover:bg-neutral-800 text-neutral-300' : 'bg-white hover:bg-gray-50 text-gray-600'}`}
                aria-label="Notifications"
              >
                <NotificationIcon />
              </button>

              <button
                className={`p-2.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 ${darkMode ? 'bg-[#1e1e1e] hover:bg-neutral-800 text-neutral-300' : 'bg-white hover:bg-gray-50 text-gray-600'}`}
                aria-label="Profile"
              >
                <ProfileIcon />
              </button>

              <button
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 ${darkMode ? 'bg-[#1e1e1e] hover:bg-neutral-800 text-yellow-400' : 'bg-white hover:bg-gray-50 text-gray-600'}`}
                aria-label="Toggle dark mode"
              >
                <ModeChangeIcon />
              </button>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto space-y-8">
            {children}
          </main>
        </div>
      </div>
  );
}
